export type LeviAccessTier = "blocked" | "basic" | "full";

export type LeviRiskTier = "low" | "medium" | "high" | "critical";

export interface LeviAccessLimits {
  scanLimit: number;
  fullDashboard: boolean;
  details: "none" | "summary" | "full";
}

export interface LeviAccessState {
  wallet: string;
  mint: string;
  balance: number;
  balanceRaw: string;
  decimals: number;
  tier: LeviAccessTier;
  limits: LeviAccessLimits;
  checkedAt: string;
  reason: string;
}

export interface LeviSession {
  wallet: string;
  issuedAt: number;
  expiresAt: number;
}

export interface TokenCreationSignal {
  mint: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  instructionType: string;
}

export interface CreatorSellSignal {
  mint: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  tokenDelta: number;
  solDelta: number;
  confidence: "low" | "medium" | "high";
  reason: string;
}

export interface TokenActivitySignal {
  mint: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  direction: "in" | "out";
  tokenDelta: number;
  tokenAmountAbs: number;
  solDelta: number;
}

export interface TokenActivitySummary {
  movementCount: number;
  largestIn: number;
  largestOut: number;
  netTokenDelta: number;
  netSolDelta: number;
}

export interface ScanCoverage {
  source: "wallet" | "wallet-and-token-accounts";
  walletSignatures: number;
  tokenAccountSignatures: number;
  tokenAccounts: number;
  selectedSignatures: number;
  loadedTransactions: number;
  skippedTransactions: number;
  rateLimited: boolean;
}

export interface RiskScoreResult {
  score: number;
  tier: LeviRiskTier;
  summary: string;
}

export interface LeviScanReport {
  wallet: string;
  generatedAt: string;
  source: "solana-mainnet" | "mock";
  inspectedSignatures: number;
  inspectedTransactions: number;
  createdTokenCount: number;
  createdTokens: TokenCreationSignal[];
  targetMint?: string;
  tokenActivitySummary?: TokenActivitySummary;
  tokenActivitySignals?: TokenActivitySignal[];
  scanCoverage: ScanCoverage;
  sellSignalCount: number;
  sellSignals: CreatorSellSignal[];
  quickSellSignalCount: number;
  score: number;
  tier: LeviRiskTier;
  summary: string;
  limitations: string[];
}
