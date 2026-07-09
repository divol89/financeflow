import type { LeviAccessTier, LeviScanReport } from "@/types/levi";
import { BASIC_SCAN_LIMIT, FULL_SCAN_LIMIT, MOCK_SOLANA } from "../constants";
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

interface ScanOptions {
  tier: LeviAccessTier;
  targetMint?: string;
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
  limit: number
): Promise<SignatureRecord[]> {
  return solanaRpc<SignatureRecord[]>("getSignaturesForAddress", [
    address,
    { limit },
  ]);
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

  const walletSignatureLimit = targetMint ? Math.max(10, Math.floor(limit / 2)) : limit;
  const walletSignatures = await fetchSignaturesForAddress(wallet, walletSignatureLimit);
  let tokenAccounts: string[] = [];
  let tokenAccountSignatures: SignatureRecord[] = [];

  if (targetMint) {
    tokenAccounts = await fetchOwnedTokenAccounts(wallet, targetMint);
    const perAccountLimit =
      tokenAccounts.length > 0 ? Math.max(5, Math.ceil(limit / tokenAccounts.length)) : 0;
    const tokenSignatureResults = await Promise.allSettled(
      tokenAccounts.map((account) =>
        fetchSignaturesForAddress(account, perAccountLimit)
      )
    );

    tokenAccountSignatures = tokenSignatureResults.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );
  }

  const signatures = dedupeSignatures([
    ...tokenAccountSignatures,
    ...walletSignatures,
  ]).slice(0, limit);

  const transactions: ParsedSolanaTransaction[] = [];
  let skippedTransactions = 0;
  let rateLimited = false;

  for (const [index, item] of signatures.entries()) {
    try {
      const transaction = await solanaRpc<ParsedSolanaTransaction | null>(
        "getTransaction",
        [
          item.signature,
          {
            encoding: "jsonParsed",
            maxSupportedTransactionVersion: 0,
          },
        ]
      );

      if (transaction) {
        transactions.push(transaction);
      }
    } catch (error) {
      if (isSolanaRpcRateLimitError(error)) {
        rateLimited = true;
        break;
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

  return {
    wallet,
    generatedAt: new Date().toISOString(),
    source: "solana-mainnet",
    inspectedSignatures: signatures.length,
    inspectedTransactions: transactions.length,
    createdTokenCount: createdTokens.length,
    createdTokens,
    targetMint,
    tokenActivitySummary,
    tokenActivitySignals,
    scanCoverage: {
      source: targetMint ? "wallet-and-token-accounts" : "wallet",
      walletSignatures: walletSignatures.length,
      tokenAccountSignatures: tokenAccountSignatures.length,
      tokenAccounts: tokenAccounts.length,
      selectedSignatures: signatures.length,
      loadedTransactions: transactions.length,
      skippedTransactions,
      rateLimited,
    },
    sellSignalCount: sellSignals.length,
    sellSignals,
    quickSellSignalCount,
    score: scored.score,
    tier: scored.tier,
    summary: scored.summary,
    limitations: [
      "This report is heuristic. It does not prove fraud, intent, or legal wrongdoing.",
      "Creator sells are inferred from token/SOL balance deltas and require manual transaction review.",
      "The scan is limited to the most recent signatures available under the active LEVI access tier.",
      "Created tokens are detected only when mint initialization appears in the scanned wallet transactions.",
      ...(targetMint
        ? [
            "Specific token activity uses the creator wallet and owned token accounts for the target mint when available.",
            "Specific token activity is ranked by token balance delta in the scanned transactions, not by a full historical index.",
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
    sellSignals: [],
    limitations: [
      ...report.limitations,
      "Basic access hides detailed sell-event rows. Hold 50,000+ LEVI for the full dashboard.",
    ],
  };
}
