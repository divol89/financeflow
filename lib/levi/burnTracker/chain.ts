import { solanaRpc } from "@/lib/levi/rpc";
import {
  BURN_TRACKER_SIGNATURE_PAGE_SIZE,
  BURN_TRACKER_SOLSCAN_TRANSACTION_URL,
  LEVI_AI_MINT_ADDRESS,
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

export function extractBurnAmountRaw(
  transaction: ParsedBurnTransaction,
  mint = LEVI_AI_MINT_ADDRESS
): string | null {
  if (transaction.meta?.err) return null;

  for (const instruction of allInstructions(transaction)) {
    const type = instruction.parsed?.type?.toLowerCase();
    const info = instruction.parsed?.info;
    if ((type !== "burn" && type !== "burnchecked") || info?.mint !== mint) continue;

    return typeof info.amount === "string" || typeof info.amount === "number"
      ? String(info.amount)
      : null;
  }

  return null;
}

export async function fetchLeviAiMintSupply(): Promise<string> {
  const result = await solanaRpc<TokenSupplyResponse>("getTokenSupply", [
    LEVI_AI_MINT_ADDRESS,
    { commitment: "finalized" },
  ]);
  return result.value.amount;
}

export function sumTokenAccountBalances(rawAmounts: Array<string | undefined>): string {
  return rawAmounts.reduce((total, amount) => total + BigInt(amount || "0"), BigInt(0)).toString();
}

export async function fetchLeviAiCommunityLockBalance(): Promise<string> {
  const result = await solanaRpc<TokenAccountsByOwnerResponse>(
    "getTokenAccountsByOwner",
    [
      SOLANA_INCINERATOR_ADDRESS,
      { mint: LEVI_AI_MINT_ADDRESS },
      { encoding: "jsonParsed", commitment: "finalized" },
    ]
  );

  return sumTokenAccountBalances(
    result.value.map((account) => account.account.data.parsed?.info?.tokenAmount?.amount)
  );
}

export async function fetchLatestLeviAiMintSignature(): Promise<string | null> {
  const signatures = await solanaRpc<MintSignatureRecord[]>("getSignaturesForAddress", [
    LEVI_AI_MINT_ADDRESS,
    { limit: 1, commitment: "finalized" },
  ]);
  return signatures.find((item) => !item.err)?.signature || null;
}

export async function scanForLatestLeviAiBurn(input: {
  before: string | null;
  until: string | null;
}): Promise<BurnScanResult> {
  const signatures = await solanaRpc<MintSignatureRecord[]>("getSignaturesForAddress", [
    LEVI_AI_MINT_ADDRESS,
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

    const amountRaw = extractBurnAmountRaw(transaction);
    if (amountRaw === null) continue;

    const occurredAtSeconds = transaction.blockTime ?? signatureInfo.blockTime ?? null;
    if (!occurredAtSeconds) continue;

    return {
      latestBurn: {
        signature: signatureInfo.signature,
        occurredAt: new Date(occurredAtSeconds * 1000).toISOString(),
        amountRaw,
        solscanUrl: `${BURN_TRACKER_SOLSCAN_TRANSACTION_URL}/${signatureInfo.signature}`,
      },
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
