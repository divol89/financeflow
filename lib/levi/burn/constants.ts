import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import type { BurnTokenProgram } from "@/types/leviBurn";

export const MAX_BURN_TOKEN_OPTIONS = 100;
export const MAX_BURN_SOURCE_ACCOUNTS = 8;

export const SUPPORTED_BURN_PROGRAMS = {
  [TOKEN_PROGRAM_ID.toBase58()]: "spl-token",
  [TOKEN_2022_PROGRAM_ID.toBase58()]: "token-2022",
} as const satisfies Record<string, BurnTokenProgram>;

export function getBurnTokenProgram(
  programId: string
): BurnTokenProgram | null {
  return SUPPORTED_BURN_PROGRAMS[programId] || null;
}
