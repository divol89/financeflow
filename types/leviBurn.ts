export type BurnTokenProgram = "spl-token" | "token-2022";

export interface BurnTokenOption {
  mint: string;
  name: string | null;
  symbol: string | null;
  program: BurnTokenProgram;
  programId: string;
  decimals: number;
  availableRaw: string;
  accountCount: number;
  isLeviAi: boolean;
  burnable: boolean;
  blockedReason: string | null;
  warning: string | null;
}

export interface BurnWalletInventory {
  wallet: string;
  tokens: BurnTokenOption[];
  totalTokenCount: number;
  truncated: boolean;
  solBalanceLamports: string;
  leviAiBalanceRaw: string;
  leviAiDecimals: number;
  externalBurnThresholdRaw: string;
  externalBurnEligible: boolean;
}

export interface BurnPreparation {
  wallet: string;
  mint: string;
  amountRaw: string;
  decimals: number;
  symbol: string | null;
  programId: string;
  isLeviAi: boolean;
  transactionBase64: string;
}

export interface LeviBurnSigningContext {
  blockhash: string;
}

export type LeviBurnTransactionState =
  | "pending"
  | "confirmed"
  | "finalized"
  | "failed";

export type LeviBurnTrackerSyncState =
  | "idle"
  | "waiting"
  | "refreshing"
  | "updated"
  | "deferred";

export interface LeviBurnTransactionStatus {
  signature: string;
  state: LeviBurnTransactionState;
}

export interface LeviBurnSubmission {
  signature: string;
  solscanUrl: string;
  mint: string;
  symbol: string | null;
  decimals: number;
  amountRaw: string;
  isLeviAi: boolean;
  state: "submitted" | "confirmed";
}
