import type { LeviAccessTier, LeviScanMode, LeviScanReport } from "@/types/levi";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import {
  BASIC_SCAN_LIMIT,
  FULL_SCAN_LIMIT,
  MOCK_SOLANA,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "../constants";
import { isSolanaRpcRateLimitError, solanaRpc } from "../rpc";
import { normalizeSolanaAddress } from "../wallet";
import {
  countQuickSellSignals,
  extractCreatorSellSignals,
  extractTokenActivitySignals,
  extractTokenCreationSignals,
  summarizeTokenActivitySignals,
  type ParsedSolanaTransaction,
} from "./analyzers";
import { buildMockScanReport } from "./mock";
import { scoreCreatorRisk } from "./score";
import { classifyTokenTransactions, summarizeClassifiedActivity } from "./classification";
import { calculateDistributionPressure } from "./pressure";
import { getScannerTokenSnapshot } from "./snapshot";

interface SignatureRecord {
  signature: string;
  slot: number;
  err: unknown;
  memo: string | null;
  blockTime: number | null;
}

interface TokenAccountsResponse {
  value: Array<{
    pubkey?: string;
  }>;
}

export interface ScanOptions {
  tier: LeviAccessTier;
  mode?: LeviScanMode;
  targetMint?: string;
  cursor?: string;
}

const PUBLIC_RPC_TRANSACTION_DELAY_MS = 180;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getLimitForTier(tier: LeviAccessTier): number {
  if (tier === "full") return FULL_SCAN_LIMIT;
  if (tier === "basic") return BASIC_SCAN_LIMIT;
  return 0;
}

async function fetchSignaturesForAddress(
  address: string,
  limit: number,
  before?: string
): Promise<SignatureRecord[]> {
  return solanaRpc<SignatureRecord[]>("getSignaturesForAddress", [
    address,
    { limit, commitment: "confirmed", ...(before ? { before } : {}) },
  ]);
}

export function deriveAssociatedTokenAccounts(
  wallet: string,
  mint: string
): string[] {
  const ownerKey = new PublicKey(wallet);
  const mintKey = new PublicKey(mint);
  return [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID].map((programId) =>
    getAssociatedTokenAddressSync(
      mintKey,
      ownerKey,
      false,
      new PublicKey(programId)
    ).toBase58()
  );
}

async function fetchOwnedTokenAccounts(
  wallet: string,
  mint: string
): Promise<string[]> {
  const result = await solanaRpc<TokenAccountsResponse>(
    "getTokenAccountsByOwner",
    [
      wallet,
      { mint },
      {
        encoding: "jsonParsed",
      },
    ]
  );

  return result.value
    .map((item) => item.pubkey)
    .filter((pubkey): pubkey is string => Boolean(pubkey));
}

function dedupeSignatures(records: SignatureRecord[]): SignatureRecord[] {
  const seen = new Set<string>();
  const deduped: SignatureRecord[] = [];

  for (const record of records) {
    if (seen.has(record.signature)) continue;
    seen.add(record.signature);
    deduped.push(record);
  }

  return deduped.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
}

export async function scanSolanaCreatorWallet(
  inputWallet: string,
  options: ScanOptions
): Promise<LeviScanReport> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const targetMint = options.targetMint
    ? normalizeSolanaAddress(options.targetMint)
    : undefined;

  if (MOCK_SOLANA) {
    return buildMockScanReport(wallet);
  }

  const limit = getLimitForTier(options.tier);
  if (limit === 0) {
    throw new Error("Scanner access is locked for this session.");
  }

  const walletSignatureLimit = limit;
  const walletSignatures = await fetchSignaturesForAddress(
    wallet,
    walletSignatureLimit,
    options.cursor
  );
  let tokenAccounts: string[] = [];
  let tokenAccountSignatures: SignatureRecord[] = [];
  let accountDiscoveryPartial = false;
  let rateLimited = false;

  if (targetMint) {
    const derivedTokenAccounts = deriveAssociatedTokenAccounts(wallet, targetMint);
    try {
      const activeTokenAccounts = await fetchOwnedTokenAccounts(wallet, targetMint);
      tokenAccounts = [...new Set([...activeTokenAccounts, ...derivedTokenAccounts])];
    } catch (error) {
      tokenAccounts = derivedTokenAccounts;
      accountDiscoveryPartial = true;
      rateLimited = isSolanaRpcRateLimitError(error);
    }
    const perAccountLimit =
      tokenAccounts.length > 0 ? Math.max(8, Math.ceil(limit / tokenAccounts.length)) : 0;
    const tokenSignatureResults = options.cursor
      ? []
      : await Promise.allSettled(
          tokenAccounts.map((account) =>
            fetchSignaturesForAddress(account, perAccountLimit)
          )
        );

    tokenAccountSignatures = tokenSignatureResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );
    for (const result of tokenSignatureResults) {
      if (result.status !== "rejected") continue;
      accountDiscoveryPartial = true;
      rateLimited = rateLimited || isSolanaRpcRateLimitError(result.reason);
    }
  }

  const signatures = dedupeSignatures([
    ...tokenAccountSignatures,
    ...walletSignatures,
  ]).slice(0, limit);

  const transactions: ParsedSolanaTransaction[] = [];
  let skippedTransactions = 0;
  let consecutiveRateLimits = 0;

  for (const [index, item] of signatures.entries()) {
    try {
      const transaction = await solanaRpc<ParsedSolanaTransaction | null>(
        "getTransaction",
        [
          item.signature,
          {
            encoding: "jsonParsed",
            maxSupportedTransactionVersion: 0,
            commitment: "confirmed",
          },
        ]
      );

      if (transaction) {
        transactions.push(transaction);
      }
      consecutiveRateLimits = 0;
    } catch (error) {
      if (isSolanaRpcRateLimitError(error)) {
        rateLimited = true;
        skippedTransactions += 1;
        consecutiveRateLimits += 1;
        if (consecutiveRateLimits >= 3) break;
        await sleep(PUBLIC_RPC_TRANSACTION_DELAY_MS * (consecutiveRateLimits + 2));
        continue;
      }

      skippedTransactions += 1;
    }

    if (index < signatures.length - 1) {
      await sleep(PUBLIC_RPC_TRANSACTION_DELAY_MS);
    }
  }

  const createdTokens = extractTokenCreationSignals(wallet, transactions);
  const sellSignals = extractCreatorSellSignals(wallet, transactions);
  const tokenActivitySignals = targetMint
    ? extractTokenActivitySignals(wallet, targetMint, transactions)
    : undefined;
  const tokenActivitySummary = targetMint
    ? summarizeTokenActivitySignals(tokenActivitySignals)
    : undefined;
  const quickSellSignalCount = countQuickSellSignals(createdTokens, sellSignals);
  const scored = scoreCreatorRisk({
    createdTokenCount: createdTokens.length,
    sellSignalCount: sellSignals.length,
    quickSellSignalCount,
    inspectedTransactions: transactions.length,
  });

  const snapshot = targetMint
    ? await getScannerTokenSnapshot(wallet, targetMint)
    : undefined;
  const activityEvents = targetMint
    ? classifyTokenTransactions(wallet, targetMint, transactions, tokenAccounts)
    : undefined;
  const tokenDecimals = snapshot?.walletBalance.decimals ||
    activityEvents?.[0]?.targetAmount.decimals ||
    0;
  const tokenActivitySummaryV2 = targetMint
    ? summarizeClassifiedActivity(activityEvents || [], tokenDecimals)
    : undefined;
  const loadedRatio =
    signatures.length > 0 ? transactions.length / signatures.length : 0;
  const blockTimes = transactions
    .map((transaction) => transaction.blockTime)
    .filter((value): value is number => typeof value === "number");
  const scanCoverage = {
    source: targetMint ? ("wallet-and-token-accounts" as const) : ("wallet" as const),
    walletSignatures: walletSignatures.length,
    tokenAccountSignatures: tokenAccountSignatures.length,
    tokenAccounts: tokenAccounts.length,
    accountDiscoveryPartial,
    selectedSignatures: signatures.length,
    loadedTransactions: transactions.length,
    skippedTransactions,
    rateLimited,
    loadedRatio,
    partial: rateLimited || skippedTransactions > 0 || loadedRatio < 1,
    newestBlockTime: blockTimes.length > 0 ? Math.max(...blockTimes) : null,
    oldestBlockTime: blockTimes.length > 0 ? Math.min(...blockTimes) : null,
    nextCursor:
      options.tier === "full" && walletSignatures.length > 0
        ? walletSignatures[walletSignatures.length - 1]?.signature || null
        : null,
  };
  const distributionPressure =
    targetMint && snapshot
      ? calculateDistributionPressure({
          snapshot,
          events: activityEvents || [],
          coverage: scanCoverage,
          quickSellSignalCount,
        })
      : undefined;

  return {
    version: 2,
    mode: options.mode || (targetMint ? "token" : "creator"),
    wallet,
    generatedAt: new Date().toISOString(),
    source: "solana-mainnet",
    inspectedSignatures: signatures.length,
    inspectedTransactions: transactions.length,
    createdTokenCount: createdTokens.length,
    createdTokens,
    targetMint,
    snapshot,
    tokenActivitySummary,
    tokenActivitySignals,
    tokenActivitySummaryV2,
    activityEvents,
    distributionPressure,
    scanCoverage,
    sellSignalCount: sellSignals.length,
    sellSignals,
    quickSellSignalCount,
    score: scored.score,
    tier: scored.tier,
    summary: scored.summary,
    limitations: [
      "This report is heuristic. It does not prove fraud, intent, or legal wrongdoing.",
      "A sell is counted only when token and quote-asset movements align with a known swap venue; every classification still requires human review.",
      "The scan is limited to the most recent signatures available under the active LEVI access tier.",
      "Created tokens are detected only when mint initialization appears in the scanned wallet transactions.",
      ...(targetMint
        ? [
            "Specific token activity uses the wallet plus active and deterministic token accounts for the target mint.",
            "Specific token activity covers the displayed observed window, not a complete historical index.",
          ]
        : []),
      ...(accountDiscoveryPartial
        ? [
            "One token-account discovery source was unavailable; deterministic associated accounts were still inspected.",
          ]
        : []),
      "Free RPC mode loads transactions sequentially to avoid paid node dependencies.",
      ...(skippedTransactions > 0
        ? [`${skippedTransactions} transactions could not be loaded from the public RPC.`]
        : []),
      ...(rateLimited
        ? [
            "The public Solana RPC rate limit was reached; this report uses the transactions loaded before the limit.",
          ]
        : []),
    ],
  };
}

export function redactScanReportForTier(
  report: LeviScanReport,
  tier: LeviAccessTier
): LeviScanReport {
  if (tier === "full") return report;

  return {
    ...report,
    createdTokens: report.createdTokens.slice(0, 3).map((token) => ({
      ...token,
      signature: `${token.signature.slice(0, 10)}...`,
    })),
    tokenActivitySignals: report.tokenActivitySignals?.slice(0, 3).map((signal) => ({
      ...signal,
      signature: `${signal.signature.slice(0, 10)}...`,
    })),
    activityEvents: report.activityEvents?.slice(0, 10),
    sellSignals: [],
    limitations: [
      ...report.limitations,
      "Basic access limits detailed activity rows. Hold 50,000+ LEVI for Full Scanner and Portfolio access.",
    ],
  };
}
