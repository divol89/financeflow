export type LeviAccessTier = "blocked" | "basic" | "full";

export type LeviRiskTier = "low" | "medium" | "high" | "critical";

export type LeviScanMode = "token" | "creator";

export type SignalConfidence = "low" | "medium" | "high";

export type RoutedTradeDirection = "buy" | "sell" | "neutral";

export type TokenActivityClassification =
  | "sell"
  | "buy"
  | "transfer_in"
  | "transfer_out"
  | "routed"
  | "liquidity"
  | "burn"
  | "mint"
  | "unknown";

export type DistributionPressureLevel =
  | "lower"
  | "watch"
  | "elevated"
  | "high"
  | "insufficient";

export interface LeviAccessLimits {
  scanLimit: number;
  fullDashboard: boolean;
  details: "none" | "summary" | "full";
  portfolioHistoryDays: number | null;
  portfolioActivityLimit: number;
  watchlistLimit: number;
  journalLimit: number;
  canExtendScanHistory: boolean;
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
  confidence: SignalConfidence;
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

export interface RawAmountValue {
  raw: string;
  decimals: number;
  formatted: string;
}

export interface ScannerTokenSnapshot {
  mint: string;
  addressKind?: "signer-wallet" | "programmatic-address";
  name: string | null;
  symbol: string | null;
  tokenProgram: string | null;
  walletBalance: RawAmountValue;
  currentSupply: RawAmountValue;
  walletSharePercent: number | null;
  walletSolLamports: string | null;
  walletSol: string | null;
  tokenAccountCount: number;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  authoritiesRevoked: boolean;
  complete: boolean;
}

export interface ClassifiedTokenActivity {
  id: string;
  sourceScanId?: string;
  mint: string;
  signature: string;
  slot: number;
  blockTime: number | null;
  classification: TokenActivityClassification;
  confidence: SignalConfidence;
  targetDeltaRaw: string;
  targetAmount: RawAmountValue;
  grossTargetInRaw?: string;
  grossTargetOutRaw?: string;
  routeDirection?: RoutedTradeDirection;
  routeActor?: string | null;
  preBalanceRaw: string;
  postBalanceRaw: string;
  quoteAsset: {
    mint: string;
    symbol: string;
    delta: RawAmountValue;
  } | null;
  netSolLamports: string;
  netSol: string;
  feeLamports: string;
  venue: string | null;
  programIds: string[];
  evidence: string[];
  ruleId: string;
}

export interface TokenActivitySummaryV2 {
  observedSellCount: number;
  probableSellCount: number;
  buyCount: number;
  routedCount: number;
  routedBuyCount: number;
  routedSellCount: number;
  routedNeutralCount: number;
  transferCount: number;
  unknownCount: number;
  totalSold: RawAmountValue;
  totalBought: RawAmountValue;
  totalRouted: RawAmountValue;
  totalRoutedBought: RawAmountValue;
  totalRoutedSold: RawAmountValue;
  possibleOutflow: RawAmountValue;
  netTokenChange: RawAmountValue;
  largestSell: RawAmountValue;
  latestSellAt: number | null;
  latestRoutedAt: number | null;
  quoteReceived: Array<{
    mint: string;
    symbol: string;
    amount: RawAmountValue;
  }>;
}

export interface DistributionPressureFactors {
  authorities: number;
  concentration: number;
  observedSelling: number;
  repeatedPattern: number;
  unknownOutflow: number;
}

export interface DistributionPressureResult {
  score: number | null;
  level: DistributionPressureLevel;
  confidence: SignalConfidence;
  factors: DistributionPressureFactors;
  summary: string;
  reasons: string[];
  unknowns: string[];
}

export interface ScanCoverage {
  source: "wallet" | "wallet-and-token-accounts" | "token-accounts";
  walletSignatures: number;
  tokenAccountSignatures: number;
  tokenAccounts: number;
  accountDiscoveryPartial?: boolean;
  selectedSignatures: number;
  loadedTransactions: number;
  skippedTransactions: number;
  rateLimited: boolean;
  loadedRatio?: number;
  partial?: boolean;
  newestBlockTime?: number | null;
  oldestBlockTime?: number | null;
  nextCursor?: string | null;
  pageIndex?: number;
  batchSize?: number;
  tierWindowLimit?: number;
  loadedPageIndexes?: number[];
  initialWindowComplete?: boolean;
}

export interface RiskScoreResult {
  score: number;
  tier: LeviRiskTier;
  summary: string;
}

export interface LeviScanReport {
  version?: 2;
  scanId?: string;
  mode?: LeviScanMode;
  wallet: string;
  generatedAt: string;
  source: "solana-mainnet" | "mock";
  inspectedSignatures: number;
  inspectedTransactions: number;
  createdTokenCount: number;
  createdTokens: TokenCreationSignal[];
  targetMint?: string;
  snapshot?: ScannerTokenSnapshot;
  tokenActivitySummary?: TokenActivitySummary;
  tokenActivitySignals?: TokenActivitySignal[];
  tokenActivitySummaryV2?: TokenActivitySummaryV2;
  activityEvents?: ClassifiedTokenActivity[];
  distributionPressure?: DistributionPressureResult;
  scanCoverage: ScanCoverage;
  sellSignalCount: number;
  sellSignals: CreatorSellSignal[];
  quickSellSignalCount: number;
  score: number;
  tier: LeviRiskTier;
  summary: string;
  limitations: string[];
}
