import type {
  CreatorSellSignal,
  TokenActivitySummary,
  TokenActivitySignal,
  TokenCreationSignal,
} from "@/types/levi";
import { AGENT_K9_MINT_ADDRESS } from "@/lib/agentK9/brand";

export interface ParsedSolanaTransaction {
  slot?: number;
  blockTime?: number | null;
  meta?: {
    err?: unknown;
    fee?: number;
    logMessages?: string[] | null;
    preBalances?: number[];
    postBalances?: number[];
    preTokenBalances?: TokenBalanceRecord[];
    postTokenBalances?: TokenBalanceRecord[];
    innerInstructions?: Array<{ instructions?: ParsedInstruction[] }>;
  } | null;
  transaction?: {
    signatures?: string[];
    message?: {
      accountKeys?: AccountKeyRecord[];
      instructions?: ParsedInstruction[];
    };
  };
}

export interface ParsedInstruction {
  program?: string;
  programId?: string;
  parsed?: {
    type?: string;
    info?: Record<string, unknown>;
  };
}

export interface TokenBalanceRecord {
  accountIndex?: number;
  mint?: string;
  owner?: string;
  uiTokenAmount?: {
    amount?: string;
    decimals?: number;
    uiAmount?: number | null;
    uiAmountString?: string;
  };
}

export type AccountKeyRecord =
  | string
  | {
      pubkey?: string;
      signer?: boolean;
      writable?: boolean;
      source?: string;
    };

function getSignature(tx: ParsedSolanaTransaction): string {
  return tx.transaction?.signatures?.[0] || "unknown";
}

function getAccountKeyPubkey(accountKey: AccountKeyRecord): string {
  return typeof accountKey === "string" ? accountKey : accountKey.pubkey || "";
}

function getWalletAccountIndex(
  wallet: string,
  accountKeys: AccountKeyRecord[] = []
): number {
  return accountKeys.findIndex((accountKey) => getAccountKeyPubkey(accountKey) === wallet);
}

function isWalletSigner(wallet: string, accountKeys: AccountKeyRecord[] = []): boolean {
  return accountKeys.some((accountKey) => {
    if (typeof accountKey === "string") return accountKey === wallet;
    return accountKey.pubkey === wallet && accountKey.signer === true;
  });
}

function getAllInstructions(tx: ParsedSolanaTransaction): ParsedInstruction[] {
  const topLevel = tx.transaction?.message?.instructions || [];
  const inner =
    tx.meta?.innerInstructions?.flatMap((item) => item.instructions || []) || [];
  return [...topLevel, ...inner];
}

function tokenAmountToNumber(record: TokenBalanceRecord): number {
  const amount = BigInt(record.uiTokenAmount?.amount || "0");
  const decimals = record.uiTokenAmount?.decimals ?? 0;
  return Number(amount) / 10 ** decimals;
}

function sumTokenBalancesByMint(
  wallet: string,
  records: TokenBalanceRecord[] = []
): Map<string, number> {
  return records.reduce((map, record) => {
    if (!record.mint || record.owner !== wallet) return map;
    map.set(record.mint, (map.get(record.mint) || 0) + tokenAmountToNumber(record));
    return map;
  }, new Map<string, number>());
}

export function extractTokenCreationSignals(
  wallet: string,
  transactions: ParsedSolanaTransaction[]
): TokenCreationSignal[] {
  const seen = new Set<string>();
  const signals: TokenCreationSignal[] = [];

  for (const tx of transactions) {
    const accountKeys = tx.transaction?.message?.accountKeys || [];
    if (!isWalletSigner(wallet, accountKeys)) continue;

    for (const instruction of getAllInstructions(tx)) {
      const type = instruction.parsed?.type;
      const info = instruction.parsed?.info;
      const mint = typeof info?.mint === "string" ? info.mint : null;

      if (!type || !mint || !type.toLowerCase().startsWith("initializemint")) {
        continue;
      }

      const key = `${getSignature(tx)}:${mint}`;
      if (seen.has(key)) continue;
      seen.add(key);

      signals.push({
        mint,
        signature: getSignature(tx),
        slot: tx.slot || 0,
        blockTime: tx.blockTime || null,
        instructionType: type,
      });
    }
  }

  return signals;
}

export function extractCreatorSellSignals(
  wallet: string,
  transactions: ParsedSolanaTransaction[]
): CreatorSellSignal[] {
  const signals: CreatorSellSignal[] = [];

  for (const tx of transactions) {
    const accountKeys = tx.transaction?.message?.accountKeys || [];
    const walletIndex = getWalletAccountIndex(wallet, accountKeys);
    if (tx.meta?.err) continue;

    const preSol = walletIndex >= 0 ? tx.meta?.preBalances?.[walletIndex] || 0 : 0;
    const postSol =
      walletIndex >= 0 ? tx.meta?.postBalances?.[walletIndex] || 0 : 0;
    const solDelta =
      walletIndex >= 0 ? (postSol - preSol) / 1_000_000_000 : 0;
    const preTokens = sumTokenBalancesByMint(wallet, tx.meta?.preTokenBalances);
    const postTokens = sumTokenBalancesByMint(wallet, tx.meta?.postTokenBalances);
    const mints = new Set([...preTokens.keys(), ...postTokens.keys()]);

    for (const mint of mints) {
      if (mint === AGENT_K9_MINT_ADDRESS) continue;

      const tokenDelta = (postTokens.get(mint) || 0) - (preTokens.get(mint) || 0);
      const lostMeaningfulTokens = tokenDelta < -0.000001;
      const gainedSol = solDelta > 0.0001;

      if (!lostMeaningfulTokens || !gainedSol) continue;

      signals.push({
        mint,
        signature: getSignature(tx),
        slot: tx.slot || 0,
        blockTime: tx.blockTime || null,
        tokenDelta,
        solDelta,
        confidence: solDelta > 0.05 ? "high" : "medium",
        reason:
          "Wallet token balance decreased while native SOL balance increased in the same transaction.",
      });
    }
  }

  return signals;
}

export function extractTokenActivitySignals(
  wallet: string,
  mint: string,
  transactions: ParsedSolanaTransaction[],
  limit = 10
): TokenActivitySignal[] {
  const signals: TokenActivitySignal[] = [];

  for (const tx of transactions) {
    const accountKeys = tx.transaction?.message?.accountKeys || [];
    const walletIndex = getWalletAccountIndex(wallet, accountKeys);
    if (tx.meta?.err) continue;

    const preSol = walletIndex >= 0 ? tx.meta?.preBalances?.[walletIndex] || 0 : 0;
    const postSol =
      walletIndex >= 0 ? tx.meta?.postBalances?.[walletIndex] || 0 : 0;
    const solDelta =
      walletIndex >= 0 ? (postSol - preSol) / 1_000_000_000 : 0;
    const preTokens = sumTokenBalancesByMint(wallet, tx.meta?.preTokenBalances);
    const postTokens = sumTokenBalancesByMint(wallet, tx.meta?.postTokenBalances);
    const tokenDelta = (postTokens.get(mint) || 0) - (preTokens.get(mint) || 0);

    if (Math.abs(tokenDelta) < 0.000001) continue;

    signals.push({
      mint,
      signature: getSignature(tx),
      slot: tx.slot || 0,
      blockTime: tx.blockTime || null,
      direction: tokenDelta > 0 ? "in" : "out",
      tokenDelta,
      tokenAmountAbs: Math.abs(tokenDelta),
      solDelta,
    });
  }

  return signals
    .sort((a, b) => b.tokenAmountAbs - a.tokenAmountAbs)
    .slice(0, limit);
}

export function summarizeTokenActivitySignals(
  signals: TokenActivitySignal[] = []
): TokenActivitySummary {
  return signals.reduce<TokenActivitySummary>(
    (summary, signal) => {
      if (signal.direction === "in") {
        summary.largestIn = Math.max(summary.largestIn, signal.tokenAmountAbs);
      } else {
        summary.largestOut = Math.max(summary.largestOut, signal.tokenAmountAbs);
      }

      summary.movementCount += 1;
      summary.netTokenDelta += signal.tokenDelta;
      summary.netSolDelta += signal.solDelta;
      return summary;
    },
    {
      movementCount: 0,
      largestIn: 0,
      largestOut: 0,
      netTokenDelta: 0,
      netSolDelta: 0,
    }
  );
}

export function countQuickSellSignals(
  createdTokens: TokenCreationSignal[],
  sellSignals: CreatorSellSignal[]
): number {
  let count = 0;

  for (const created of createdTokens) {
    if (!created.blockTime) continue;
    const createdBlockTime = created.blockTime;

    const quickSell = sellSignals.some((signal) => {
      if (signal.mint !== created.mint || !signal.blockTime) return false;
      const secondsAfterCreation = signal.blockTime - createdBlockTime;
      return secondsAfterCreation >= 0 && secondsAfterCreation <= 60 * 60 * 24;
    });

    if (quickSell) count += 1;
  }

  return count;
}
