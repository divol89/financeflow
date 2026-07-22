import type { LeviAccessTier, LeviScanMode, LeviScanReport } from "@/types/levi";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import {
  MOCK_SOLANA,
  SCANNER_MAX_TOKEN_ACCOUNT_SOURCES,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "../constants";
import {
  isSolanaRpcRateLimitError,
  SolanaRpcError,
  solanaRpc,
  solanaRpcBatch,
  type SolanaRpcRequestOptions,
} from "../rpc";
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
import {
  createScannerCursor,
  InvalidScannerCursorError,
  parseScannerCursor,
  type ScannerSignatureSourceCursor,
} from "./cursor";
import { calculateDistributionPressure } from "./pressure";
import {
  allocateScannerSourceLimits,
  canContinueScannerPage,
  scannerBatchSizeForPage,
  scannerInitialWindowComplete,
  scannerTierWindowLimit,
} from "./pagination";
import { getScannerTokenContext } from "./snapshot";

interface SignatureRecord {
  signature: string;
  slot: number;
  err: unknown;
  memo: string | null;
  blockTime: number | null;
}

export interface ScanOptions {
  tier: LeviAccessTier;
  mode?: LeviScanMode;
  targetMint?: string;
  cursor?: string;
}

const SCANNER_RPC_POLICY: SolanaRpcRequestOptions = {
  maxAttempts: 1,
  requestTimeoutMs: 1_200,
  deadlineMs: 2_500,
};
const SCANNER_TRANSACTION_RPC_POLICY: SolanaRpcRequestOptions = {
  maxAttempts: 1,
  requestTimeoutMs: 2_500,
  deadlineMs: 7_000,
};
const SCANNER_TRANSACTION_ITEM_COOLDOWN_MS = 250;

function waitBetweenTransactions(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, SCANNER_TRANSACTION_ITEM_COOLDOWN_MS);
  });
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
      true,
      new PublicKey(programId)
    ).toBase58()
  );
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

function scannerMode(options: ScanOptions, targetMint?: string): LeviScanMode {
  return options.mode || (targetMint ? "token" : "creator");
}

function initialSourceCursors(input: {
  wallet: string;
  targetMint?: string;
  tokenAccounts: string[];
}): ScannerSignatureSourceCursor[] {
  const addresses = input.targetMint ? input.tokenAccounts : [input.wallet];
  return addresses.map((address) => ({ address }));
}

function buildSignatureRequests(input: {
  sources: ScannerSignatureSourceCursor[];
  transactionLimit: number;
  pageIndex: number;
}): Array<{
  sourceIndex: number;
  limit: number;
  request: { method: string; params: unknown[] };
}> {
  const activeSourceIndexes = input.sources
    .map((source, index) => ({ source, index }))
    .filter(({ source }) => !source.done)
    .map(({ index }) => index);
  const limits = allocateScannerSourceLimits({
    sourceCount: activeSourceIndexes.length,
    transactionLimit: input.transactionLimit,
    pageIndex: input.pageIndex,
  });

  return activeSourceIndexes.flatMap((sourceIndex, activeIndex) => {
    const limit = limits[activeIndex] || 0;
    if (limit === 0) return [];
    const source = input.sources[sourceIndex];
    return [
      {
        sourceIndex,
        limit,
        request: {
          method: "getSignaturesForAddress",
          params: [
            source.address,
            {
              limit,
              commitment: "confirmed",
              ...(source.before ? { before: source.before } : {}),
            },
          ],
        },
      },
    ];
  });
}

async function loadParsedTransactions(
  signatures: SignatureRecord[]
): Promise<{
  transactions: ParsedSolanaTransaction[];
  skippedTransactions: number;
  rateLimited: boolean;
}> {
  const transactions: ParsedSolanaTransaction[] = [];
  const errors: unknown[] = [];
  let missingTransactions = 0;

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
        ],
        SCANNER_TRANSACTION_RPC_POLICY
      );
      if (transaction) transactions.push(transaction);
      else missingTransactions += 1;
    } catch (error) {
      errors.push(error);
    }

    if (index + 1 < signatures.length) await waitBetweenTransactions();
  }

  const rateLimitError = errors.find(isSolanaRpcRateLimitError);
  if (
    errors.length === signatures.length ||
    (rateLimitError && transactions.length < Math.ceil(signatures.length / 2))
  ) {
    throw rateLimitError || errors[0];
  }

  return {
    transactions,
    skippedTransactions: missingTransactions + errors.length,
    rateLimited: Boolean(rateLimitError),
  };
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

  const mode = scannerMode(options, targetMint);
  if (mode === "token" && !targetMint) {
    throw new Error("Token mode requires a token mint.");
  }
  const tierWindowLimit = scannerTierWindowLimit(options.tier);
  if (tierWindowLimit === 0) {
    throw new Error("Scanner access is locked for this session.");
  }

  let pageIndex = 0;
  let sourceCursors: ScannerSignatureSourceCursor[] = [];
  let tokenAccounts: string[] = [];
  let accountDiscoveryPartial = false;
  let rateLimited = false;
  let snapshot;

  if (options.cursor) {
    const cursor = parseScannerCursor(options.cursor, {
      wallet,
      targetMint,
      mode,
    });
    pageIndex = cursor.pageIndex;
    sourceCursors = cursor.sources;
    tokenAccounts = targetMint ? sourceCursors.map((source) => source.address) : [];
  } else if (targetMint) {
    const tokenContext = await getScannerTokenContext(
      wallet,
      targetMint,
      SCANNER_RPC_POLICY
    );
    const allDerivedTokenAccounts = deriveAssociatedTokenAccounts(wallet, targetMint);
    const derivedTokenAccounts =
      tokenContext.snapshot.tokenProgram === TOKEN_PROGRAM_ID
        ? allDerivedTokenAccounts.slice(0, 1)
        : tokenContext.snapshot.tokenProgram === TOKEN_2022_PROGRAM_ID
          ? allDerivedTokenAccounts.slice(1)
          : allDerivedTokenAccounts;
    tokenAccounts = [
      ...new Set([...tokenContext.tokenAccounts, ...derivedTokenAccounts]),
    ].slice(0, SCANNER_MAX_TOKEN_ACCOUNT_SOURCES);
    snapshot = tokenContext.snapshot;
    accountDiscoveryPartial = !tokenContext.accountDiscoveryComplete;
    sourceCursors = initialSourceCursors({ wallet, targetMint, tokenAccounts });
  } else {
    sourceCursors = initialSourceCursors({ wallet, tokenAccounts: [] });
  }

  const transactionLimit = scannerBatchSizeForPage(options.tier, pageIndex);
  if (transactionLimit === 0) {
    throw new InvalidScannerCursorError(
      "This continuation is outside the active scanner window."
    );
  }
  const signatureRequests = buildSignatureRequests({
    sources: sourceCursors,
    transactionLimit,
    pageIndex,
  });
  const signatureResults = await solanaRpcBatch<SignatureRecord[]>(
    signatureRequests.map((item) => item.request),
    SCANNER_RPC_POLICY
  );
  if (
    signatureRequests.length > 0 &&
    signatureResults.every((result) => result === null)
  ) {
    throw new SolanaRpcError(
      "getSignaturesForAddress",
      "Solana RPC could not return this scanner page",
      { status: 503 }
    );
  }

  const nextSources = sourceCursors.map((source) => ({ ...source }));
  const fetchedSignatures: SignatureRecord[] = [];
  signatureRequests.forEach((item, index) => {
    const records = signatureResults[index];
    const nextSource = nextSources[item.sourceIndex];
    if (!records) {
      accountDiscoveryPartial = true;
      return;
    }
    fetchedSignatures.push(...records);
    if (records.length === 0) {
      nextSource.done = true;
      return;
    }
    nextSource.before = records[records.length - 1]?.signature;
    nextSource.done = records.length < item.limit;
  });
  const signatures = dedupeSignatures(fetchedSignatures).slice(
    0,
    transactionLimit
  );

  let transactions: ParsedSolanaTransaction[] = [];
  let skippedTransactions = signatures.length;
  if (signatures.length > 0) {
    const loaded = await loadParsedTransactions(signatures);
    transactions = loaded.transactions;
    skippedTransactions = loaded.skippedTransactions;
    rateLimited = rateLimited || loaded.rateLimited;
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
  const hasMoreSources = nextSources.some((source) => !source.done);
  const initialWindowComplete = scannerInitialWindowComplete({
    tier: options.tier,
    pageIndex,
    hasMoreSources,
  });
  const nextPageIndex = pageIndex + 1;
  const canContinue =
    hasMoreSources &&
    fetchedSignatures.length > 0 &&
    canContinueScannerPage({ tier: options.tier, nextPageIndex });
  const nextCursor = canContinue
    ? createScannerCursor({
        wallet,
        targetMint,
        mode,
        pageIndex: nextPageIndex,
        sources: nextSources,
      })
    : null;
  const scanCoverage = {
    source: targetMint ? ("token-accounts" as const) : ("wallet" as const),
    walletSignatures: targetMint ? 0 : fetchedSignatures.length,
    tokenAccountSignatures: targetMint ? fetchedSignatures.length : 0,
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
    nextCursor,
    pageIndex,
    batchSize: transactionLimit,
    tierWindowLimit,
    loadedPageIndexes: [pageIndex],
    initialWindowComplete,
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
    mode,
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
      "The initial scan window is loaded in bounded blockchain pages to protect the public RPC.",
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
      "Free RPC mode reads small signature and transaction batches to keep each server request bounded.",
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
  void tier;
  return report;
}
