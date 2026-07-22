import type { BurnTokenProgram } from "@/types/leviBurn";

export interface BurnLedgerEvent {
  signature: string;
  mint: string;
  wallet: string;
  name: string | null;
  symbol: string | null;
  program: BurnTokenProgram;
  programId: string;
  decimals: number;
  amountRaw: string;
  supplyAfterRaw: string;
  occurredAt: string;
  solscanUrl: string;
  tokenUrl: string;
}

export interface BurnLedgerTokenSummary {
  mint: string;
  name: string | null;
  symbol: string | null;
  program: BurnTokenProgram;
  programId: string;
  decimals: number;
  totalBurnedRaw: string;
  burnCount: number;
  currentSupplyRaw: string;
  lastBurnAt: string;
  lastSignature: string;
  tokenUrl: string;
}

export interface BurnLedgerPayload {
  version: 1;
  scope: "flow-finance-portal";
  events: BurnLedgerEvent[];
  tokens: BurnLedgerTokenSummary[];
  updatedAt: string;
}
