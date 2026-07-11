import type { ParsedSolanaTransaction } from "@/lib/levi/scanner/analyzers";
import { classifyTokenTransactions } from "@/lib/levi/scanner/classification";
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
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function fetchPortfolioSnapshot(
  inputWallet: string,
  now = new Date()
): Promise<PortfolioSnapshot> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const [solResult, ...tokenResults] = await Promise.all([
    solanaRpc<BalanceResponse>("getBalance", [wallet, { commitment: "confirmed" }]),
    ...PORTFOLIO_TOKEN_ASSETS.map((asset) =>
      getTokenBalanceForMint(wallet, asset.mint)
    ),
  ]);
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
): Promise<PortfolioActivity[]> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const signatures = await solanaRpc<SignatureRecord[]>("getSignaturesForAddress", [
    wallet,
    { limit: PORTFOLIO_CHAIN_ACTIVITY_BATCH },
  ]);
  const transactions: ParsedSolanaTransaction[] = [];

  for (const [index, item] of signatures.entries()) {
    try {
      const transaction = await solanaRpc<ParsedSolanaTransaction | null>(
        "getTransaction",
        [
          item.signature,
          { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 },
        ]
      );
      if (transaction) transactions.push(transaction);
    } catch (error) {
      if (isSolanaRpcRateLimitError(error)) break;
    }
    if (index < signatures.length - 1) await sleep(160);
  }

  const tokenActivity = PORTFOLIO_TOKEN_ASSETS.flatMap((asset) =>
    classifyTokenTransactions(wallet, asset.mint, transactions).map<PortfolioActivity>(
      (event) => ({
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
      })
    )
  );
  const tokenSignatures = new Set(tokenActivity.map((event) => event.signature));
  const solActivity = transactions
    .filter(
      (transaction) =>
        !tokenSignatures.has(transaction.transaction?.signatures?.[0] || "unknown")
    )
    .map((transaction) => nativeSolActivity(transaction, wallet))
    .filter((event): event is PortfolioActivity => Boolean(event));

  return [...tokenActivity, ...solActivity].sort(
    (left, right) => (right.blockTime || 0) - (left.blockTime || 0)
  );
}
