import { solanaRpc } from "@/lib/levi/rpc";
import {
  BURN_TRACKER_SIGNATURE_PAGE_SIZE,
  BURN_TRACKER_SOLSCAN_TRANSACTION_URL,
  AGENT_K9_MINT_ADDRESS,
  SOLANA_INCINERATOR_ADDRESS,
} from "./constants";

interface TokenSupplyResponse {
  value: {
    amount: string;
    decimals: number;
  };
}

interface TokenAccountsByOwnerResponse {
  value: Array<{
    pubkey: string;
    account: {
      data: {
        parsed?: {
          info?: {
            tokenAmount?: {
              amount?: string;
            };
          };
        };
      };
    };
  }>;
}

export interface LeviAiTokenAccountBalance {
  address: string;
  amountRaw: string;
}

export interface MintSignatureRecord {
  signature: string;
  blockTime?: number | null;
  err?: unknown;
}

interface ParsedInstruction {
  parsed?: {
    type?: string;
    info?: Record<string, unknown>;
  };
}

interface ParsedBurnTransaction {
  blockTime?: number | null;
  meta?: {
    err?: unknown;
    innerInstructions?: Array<{ instructions?: ParsedInstruction[] }>;
  } | null;
  transaction?: {
    message?: {
      instructions?: ParsedInstruction[];
    };
  };
}

export interface DetectedBurn {
  signature: string;
  occurredAt: string;
  amountRaw: string | null;
  solscanUrl: string;
}

export interface BurnScanResult {
  latestBurn: DetectedBurn | null;
  nextCursor: string | null;
  hasMore: boolean;
}

function allInstructions(transaction: ParsedBurnTransaction): ParsedInstruction[] {
  return [
    ...(transaction.transaction?.message?.instructions || []),
    ...(transaction.meta?.innerInstructions?.flatMap((item) => item.instructions || []) || []),
  ];
}

function extractInstructionAmountRaw(info?: Record<string, unknown>): string | null {
  const directAmount = info?.amount;
  if (typeof directAmount === "string" || typeof directAmount === "number") {
    return String(directAmount);
  }

  const tokenAmount = info?.tokenAmount;
  if (!tokenAmount || typeof tokenAmount !== "object") return null;
  const rawAmount = (tokenAmount as Record<string, unknown>).amount;
  return typeof rawAmount === "string" || typeof rawAmount === "number"
    ? String(rawAmount)
    : null;
}

function toDetectedBurn(
  signature: string,
  transaction: ParsedBurnTransaction,
  fallbackBlockTime?: number | null
): DetectedBurn | null {
  const amountRaw = extractBurnAmountRaw(transaction);
  if (amountRaw === null) return null;

  const occurredAtSeconds = transaction.blockTime ?? fallbackBlockTime ?? null;
  if (!occurredAtSeconds) return null;

  return {
    signature,
    occurredAt: new Date(occurredAtSeconds * 1000).toISOString(),
    amountRaw,
    solscanUrl: `${BURN_TRACKER_SOLSCAN_TRANSACTION_URL}/${signature}`,
  };
}

export function extractBurnAmountRaw(
  transaction: ParsedBurnTransaction,
  mint = AGENT_K9_MINT_ADDRESS
): string | null {
  if (transaction.meta?.err) return null;

  for (const instruction of allInstructions(transaction)) {
    const type = instruction.parsed?.type?.toLowerCase();
    const info = instruction.parsed?.info;
    if ((type !== "burn" && type !== "burnchecked") || info?.mint !== mint) continue;

    return extractInstructionAmountRaw(info);
  }

  return null;
}

export async function fetchLeviAiMintSupply(): Promise<string> {
  const result = await solanaRpc<TokenSupplyResponse>("getTokenSupply", [
    AGENT_K9_MINT_ADDRESS,
    { commitment: "finalized" },
  ]);
  return result.value.amount;
}

export function sumTokenAccountBalances(rawAmounts: Array<string | undefined>): string {
  return rawAmounts.reduce((total, amount) => total + BigInt(amount || "0"), BigInt(0)).toString();
}

export async function fetchLeviAiTokenAccountsByOwner(
  owner: string,
  commitment: "confirmed" | "finalized" = "finalized"
): Promise<LeviAiTokenAccountBalance[]> {
  const result = await solanaRpc<TokenAccountsByOwnerResponse>(
    "getTokenAccountsByOwner",
    [
      owner,
      { mint: AGENT_K9_MINT_ADDRESS },
      { encoding: "jsonParsed", commitment },
    ]
  );

  return result.value.flatMap((account) => {
    const amountRaw = account.account.data.parsed?.info?.tokenAmount?.amount;
    if (!account.pubkey || typeof amountRaw !== "string") return [];

    return [{ address: account.pubkey, amountRaw }];
  });
}

export async function fetchLeviAiCommunityLockBalance(): Promise<string> {
  const accounts = await fetchLeviAiTokenAccountsByOwner(SOLANA_INCINERATOR_ADDRESS);
  return sumTokenAccountBalances(accounts.map((account) => account.amountRaw));
}

export async function fetchLatestLeviAiMintSignature(): Promise<string | null> {
  const signatures = await solanaRpc<MintSignatureRecord[]>("getSignaturesForAddress", [
    AGENT_K9_MINT_ADDRESS,
    { limit: 1, commitment: "finalized" },
  ]);
  return signatures.find((item) => !item.err)?.signature || null;
}

export async function fetchLeviAiBurnBySignature(
  signature: string
): Promise<DetectedBurn | null> {
  const transaction = await solanaRpc<ParsedBurnTransaction | null>("getTransaction", [
    signature,
    {
      commitment: "finalized",
      encoding: "jsonParsed",
      maxSupportedTransactionVersion: 0,
    },
  ]);
  if (!transaction) return null;

  return toDetectedBurn(signature, transaction);
}

export async function scanForLatestLeviAiBurn(input: {
  before: string | null;
  until: string | null;
}): Promise<BurnScanResult> {
  const signatures = await solanaRpc<MintSignatureRecord[]>("getSignaturesForAddress", [
    AGENT_K9_MINT_ADDRESS,
    {
      limit: BURN_TRACKER_SIGNATURE_PAGE_SIZE,
      commitment: "finalized",
      ...(input.before ? { before: input.before } : {}),
      ...(input.until ? { until: input.until } : {}),
    },
  ]);
  const successfulSignatures = signatures.filter((item) => !item.err);

  for (const signatureInfo of successfulSignatures) {
    const transaction = await solanaRpc<ParsedBurnTransaction | null>("getTransaction", [
      signatureInfo.signature,
      {
        commitment: "finalized",
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
      },
    ]);
    if (!transaction) continue;

    const latestBurn = toDetectedBurn(
      signatureInfo.signature,
      transaction,
      signatureInfo.blockTime
    );
    if (!latestBurn) continue;

    return {
      latestBurn,
      nextCursor: null,
      hasMore: false,
    };
  }

  return {
    latestBurn: null,
    nextCursor: signatures.at(-1)?.signature || null,
    hasMore: signatures.length === BURN_TRACKER_SIGNATURE_PAGE_SIZE,
  };
}
