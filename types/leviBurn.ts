export interface LeviBurnTokenAccount {
  address: string;
  amountRaw: string;
}

export interface LeviBurnQuote {
  wallet: string;
  mint: string;
  symbol: string;
  decimals: number;
  availableRaw: string;
  tokenAccounts: LeviBurnTokenAccount[];
  solBalanceLamports: string;
}

export interface LeviBurnSigningContext {
  blockhash: string;
}

export type LeviBurnTransactionState = "pending" | "confirmed" | "failed";

export interface LeviBurnTransactionStatus {
  signature: string;
  state: LeviBurnTransactionState;
}

export interface LeviBurnSubmission {
  signature: string;
  solscanUrl: string;
  amountRaw: string;
  state: "submitted" | "confirmed";
}
