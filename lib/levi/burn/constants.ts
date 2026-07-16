import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AGENT_K9_MINT_ADDRESS } from "@/lib/levi/communityBurn";
import { AGENT_K9_DECIMALS } from "@/lib/levi/burnTracker/constants";
import type { BurnTokenProgram } from "@/types/leviBurn";

export const EXTERNAL_BURN_THRESHOLD_TOKENS = 1_000_000;
export const EXTERNAL_BURN_THRESHOLD_RAW = (
  BigInt(EXTERNAL_BURN_THRESHOLD_TOKENS) * BigInt(10 ** AGENT_K9_DECIMALS)
).toString();

export const MAX_BURN_TOKEN_OPTIONS = 100;
export const MAX_BURN_SOURCE_ACCOUNTS = 8;

export const SUPPORTED_BURN_PROGRAMS = {
  [TOKEN_PROGRAM_ID.toBase58()]: "spl-token",
  [TOKEN_2022_PROGRAM_ID.toBase58()]: "token-2022",
} as const satisfies Record<string, BurnTokenProgram>;

export function isLeviAiMint(mint: string): boolean {
  return mint === AGENT_K9_MINT_ADDRESS;
}

export function getBurnTokenProgram(
  programId: string
): BurnTokenProgram | null {
  return SUPPORTED_BURN_PROGRAMS[programId] || null;
}
