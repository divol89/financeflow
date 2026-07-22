import { solanaRpc } from "@/lib/levi/rpc";
import { getBurnTokenProgram } from "@/lib/levi/burn/constants";
import type { BurnTokenProgram } from "@/types/leviBurn";

interface ParsedInstruction {
  programId?: string;
  parsed?: {
    type?: string;
    info?: Record<string, unknown>;
  };
}

export interface ParsedBurnTransaction {
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

interface TokenSupplyResponse {
  value: {
    amount: string;
    decimals: number;
  };
}

export interface VerifiedBurnOnChain {
  mint: string;
  wallet: string;
  program: BurnTokenProgram;
  programId: string;
  decimals: number;
  amountRaw: string;
  supplyAfterRaw: string;
  occurredAt: string;
}

function readRawAmount(info: Record<string, unknown>): string | null {
  const direct = info.amount;
  if (typeof direct === "string" || typeof direct === "number") {
    return String(direct);
  }

  const tokenAmount = info.tokenAmount;
  if (!tokenAmount || typeof tokenAmount !== "object") return null;
  const amount = (tokenAmount as Record<string, unknown>).amount;
  return typeof amount === "string" || typeof amount === "number"
    ? String(amount)
    : null;
}

function allInstructions(transaction: ParsedBurnTransaction): ParsedInstruction[] {
  return [
    ...(transaction.transaction?.message?.instructions || []),
    ...(transaction.meta?.innerInstructions?.flatMap(
      (group) => group.instructions || []
    ) || []),
  ];
}

export function extractPortalBurn(input: {
  transaction: ParsedBurnTransaction;
  mint: string;
  wallet: string;
}): Pick<VerifiedBurnOnChain, "amountRaw" | "program" | "programId"> | null {
  if (input.transaction.meta?.err) return null;

  let total = BigInt(0);
  let programId: string | null = null;
  let program: BurnTokenProgram | null = null;

  for (const instruction of allInstructions(input.transaction)) {
    const type = instruction.parsed?.type?.toLowerCase();
    const info = instruction.parsed?.info;
    const instructionProgramId = instruction.programId || "";
    const instructionProgram = getBurnTokenProgram(instructionProgramId);
    if (
      !info ||
      (type !== "burn" && type !== "burnchecked") ||
      info.mint !== input.mint ||
      (info.authority !== input.wallet && info.owner !== input.wallet) ||
      !instructionProgram
    ) {
      continue;
    }

    const rawAmount = readRawAmount(info);
    if (!rawAmount || !/^\d+$/.test(rawAmount)) continue;
    const amount = BigInt(rawAmount);
    if (amount <= BigInt(0)) continue;

    if (programId && programId !== instructionProgramId) return null;
    programId = instructionProgramId;
    program = instructionProgram;
    total += amount;
  }

  if (!programId || !program || total <= BigInt(0)) return null;
  return { amountRaw: total.toString(), program, programId };
}

export async function fetchVerifiedPortalBurn(input: {
  signature: string;
  mint: string;
  wallet: string;
}): Promise<VerifiedBurnOnChain | null> {
  const transaction = await solanaRpc<ParsedBurnTransaction | null>(
    "getTransaction",
    [
      input.signature,
      {
        commitment: "finalized",
        encoding: "jsonParsed",
        maxSupportedTransactionVersion: 0,
      },
    ]
  );
  if (!transaction?.blockTime) return null;

  const burn = extractPortalBurn({
    transaction,
    mint: input.mint,
    wallet: input.wallet,
  });
  if (!burn) return null;

  const supply = await solanaRpc<TokenSupplyResponse>("getTokenSupply", [
    input.mint,
    { commitment: "finalized" },
  ]);

  return {
    mint: input.mint,
    wallet: input.wallet,
    ...burn,
    decimals: supply.value.decimals,
    supplyAfterRaw: supply.value.amount,
    occurredAt: new Date(transaction.blockTime * 1000).toISOString(),
  };
}
