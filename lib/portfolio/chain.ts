import type { ParsedSolanaTransaction } from "@/lib/levi/scanner/analyzers";
import { classifyTokenTransactions } from "@/lib/levi/scanner/classification";
import { deriveAssociatedTokenAccounts } from "@/lib/levi/scanner/scanWallet";
import { absBigInt, formatRawAmount } from "@/lib/levi/scanner/amounts";
import { isSolanaRpcRateLimitError, solanaRpc } from "@/lib/levi/rpc";
import { getTokenBalanceForMint } from "@/lib/levi/tokenGate";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import type {
  PortfolioActivity,
  PortfolioAssetBalance,
  PortfolioSnapshot,
} from "@/types/portfolio";
import {
  PORTFOLIO_CHAIN_ACTIVITY_BATCH,
  PORTFOLIO_TOKEN_ASSETS,
} from "./constants";

interface BalanceResponse {
  value: number;
}

interface SignatureRecord {
  signature: string;
  blockTime: number | null;
  err?: unknown;
}

export interface PortfolioActivityResult {
  events: PortfolioActivity[];
  selectedSignatures: number;
  loadedTransactions: number;
  sourceCount: number;
  partial: boolean;
  rateLimited: boolean;
}

interface KnownTokenBalance {
  raw: string;
  decimals: number;
}

const PORTFOLIO_SIGNATURES_PER_SOURCE = 6;
const PORTFOLIO_SOURCE_COOLDOWN_MS = 140;
const PORTFOLIO_TRANSACTION_COOLDOWN_MS = 250;
const PORTFOLIO_RPC_POLICY = {
  maxAttempts: 1,
  requestTimeoutMs: 2_500,
  deadlineMs: 6_000,
} as const;

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function fetchPortfolioSnapshot(
  inputWallet: string,
  now = new Date(),
  knownTokenBalances: Record<string, KnownTokenBalance> = {}
): Promise<PortfolioSnapshot> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const solResult = await solanaRpc<BalanceResponse>(
    "getBalance",
    [wallet, { commitment: "confirmed" }],
    PORTFOLIO_RPC_POLICY
  );
  const tokenResults: Array<{ raw: bigint; decimals: number }> = [];
  for (const [index, asset] of PORTFOLIO_TOKEN_ASSETS.entries()) {
    const known = knownTokenBalances[asset.mint];
    tokenResults.push(
      known
        ? { raw: BigInt(known.raw), decimals: known.decimals }
        : await getTokenBalanceForMint(wallet, asset.mint)
    );
    if (index < PORTFOLIO_TOKEN_ASSETS.length - 1) {
      await sleep(PORTFOLIO_SOURCE_COOLDOWN_MS);
    }
  }
  const solRaw = BigInt(Math.trunc(solResult.value));
  const assets: PortfolioAssetBalance[] = [
    {
      id: "sol",
      name: "Solana",
      symbol: "SOL",
      mint: null,
      raw: solRaw.toString(),
      decimals: 9,
      formatted: formatRawAmount(solRaw, 9),
    },
    ...PORTFOLIO_TOKEN_ASSETS.map((asset, index) => {
      const balance = tokenResults[index];
      return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        mint: asset.mint,
        raw: balance.raw.toString(),
        decimals: balance.decimals,
        formatted: formatRawAmount(balance.raw, balance.decimals),
      };
    }),
  ];

  return {
    id: now.toISOString(),
    wallet,
    capturedAt: now.toISOString(),
    assets,
  };
}

function walletIndex(transaction: ParsedSolanaTransaction, wallet: string): number {
  return (transaction.transaction?.message?.accountKeys || []).findIndex((key) =>
    typeof key === "string" ? key === wallet : key.pubkey === wallet
  );
}

function nativeSolActivity(
  transaction: ParsedSolanaTransaction,
  wallet: string
): PortfolioActivity | null {
  if (transaction.meta?.err) return null;
  const index = walletIndex(transaction, wallet);
  if (index < 0) return null;
  const before = transaction.meta?.preBalances?.[index] || 0;
  const after = transaction.meta?.postBalances?.[index] || 0;
  const fee = index === 0 ? transaction.meta?.fee || 0 : 0;
  const delta = BigInt(Math.trunc(after - before + fee));
  if (absBigInt(delta) < BigInt(1_000_000)) return null;
  const signature = transaction.transaction?.signatures?.[0] || "unknown";
  return {
    id: `${signature}:sol`,
    signature,
    assetId: "sol",
    assetSymbol: "SOL",
    classification: delta > BigInt(0) ? "sol_in" : "sol_out",
    confidence: "medium",
    amountRaw: absBigInt(delta).toString(),
    amountFormatted: formatRawAmount(absBigInt(delta), 9),
    blockTime: transaction.blockTime || null,
    venue: null,
    solscanUrl: `https://solscan.io/tx/${signature}`,
  };
}

export async function fetchRecentPortfolioActivity(
  inputWallet: string
): Promise<PortfolioActivityResult> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const tokenAccounts = new Map(
    PORTFOLIO_TOKEN_ASSETS.map((asset) => [
      asset.mint,
      deriveAssociatedTokenAccounts(wallet, asset.mint),
    ])
  );
  const sources = [
    wallet,
    ...PORTFOLIO_TOKEN_ASSETS.flatMap(
      (asset) => tokenAccounts.get(asset.mint) || []
    ),
  ].filter((source, index, all) => all.indexOf(source) === index);
  const signatureErrors: unknown[] = [];
  const signatureMap = new Map<string, SignatureRecord>();

  for (const [index, source] of sources.entries()) {
    try {
      const records = await solanaRpc<SignatureRecord[]>(
        "getSignaturesForAddress",
        [source, { limit: PORTFOLIO_SIGNATURES_PER_SOURCE, commitment: "confirmed" }],
        PORTFOLIO_RPC_POLICY
      );
      for (const record of records) {
        if (!record.err && !signatureMap.has(record.signature)) {
          signatureMap.set(record.signature, record);
        }
      }
    } catch (error) {
      signatureErrors.push(error);
    }
    if (index < sources.length - 1) await sleep(PORTFOLIO_SOURCE_COOLDOWN_MS);
  }

  if (signatureMap.size === 0 && signatureErrors.length === sources.length) {
    throw signatureErrors.find(isSolanaRpcRateLimitError) || signatureErrors[0];
  }

  const signatures = [...signatureMap.values()]
    .sort((left, right) => (right.blockTime || 0) - (left.blockTime || 0))
    .slice(0, PORTFOLIO_CHAIN_ACTIVITY_BATCH);
  const transactions: ParsedSolanaTransaction[] = [];
  const transactionErrors: unknown[] = [];
  let rateLimited = signatureErrors.some(isSolanaRpcRateLimitError);

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
        PORTFOLIO_RPC_POLICY
      );
      if (transaction) transactions.push(transaction);
    } catch (error) {
      transactionErrors.push(error);
      if (isSolanaRpcRateLimitError(error)) {
        rateLimited = true;
        break;
      }
    }
    if (index < signatures.length - 1) {
      await sleep(PORTFOLIO_TRANSACTION_COOLDOWN_MS);
    }
  }

  const tokenActivity = PORTFOLIO_TOKEN_ASSETS.flatMap((asset) =>
    classifyTokenTransactions(
      wallet,
      asset.mint,
      transactions,
      tokenAccounts.get(asset.mint) || []
    ).map<PortfolioActivity>((event) => ({
      id: event.id,
      signature: event.signature,
      assetId: asset.id,
      assetSymbol: asset.symbol,
      classification: event.classification,
      confidence: event.confidence,
      amountRaw: event.targetAmount.raw,
      amountFormatted: event.targetAmount.formatted,
      blockTime: event.blockTime,
      venue: event.venue,
      solscanUrl: `https://solscan.io/tx/${event.signature}`,
    }))
  );
  const tokenSignatures = new Set(tokenActivity.map((event) => event.signature));
  const solActivity = transactions
    .filter(
      (transaction) =>
        !tokenSignatures.has(transaction.transaction?.signatures?.[0] || "unknown")
    )
    .map((transaction) => nativeSolActivity(transaction, wallet))
    .filter((event): event is PortfolioActivity => Boolean(event));

  return {
    events: [...tokenActivity, ...solActivity].sort(
      (left, right) => (right.blockTime || 0) - (left.blockTime || 0)
    ),
    selectedSignatures: signatures.length,
    loadedTransactions: transactions.length,
    sourceCount: sources.length,
    partial:
      signatureErrors.length > 0 ||
      transactionErrors.length > 0 ||
      transactions.length < signatures.length,
    rateLimited,
  };
}
