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

export interface LeviBurnSubmission {
  signature: string;
  solscanUrl: string;
  amountRaw: string;
}
