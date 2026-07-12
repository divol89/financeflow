import type {
  DistributionPressureResult,
  LeviAccessState,
  ScannerTokenSnapshot,
  TokenActivityClassification,
} from "./levi";

export type PortfolioAssetId = "sol" | "levi" | "levi-ai";
export type JournalDecision = "watch" | "entered" | "trimmed" | "exited" | "avoided";
export type PortfolioActivityStatus =
  | "live"
  | "partial"
  | "cached"
  | "unavailable"
  | "locked";

export interface PortfolioAssetBalance {
  id: PortfolioAssetId;
  name: string;
  symbol: string;
  mint: string | null;
  raw: string;
  decimals: number;
  formatted: string;
}

export interface PortfolioSnapshot {
  id: string;
  wallet: string;
  capturedAt: string;
  assets: PortfolioAssetBalance[];
}

export interface PortfolioActivity {
  id: string;
  signature: string;
  assetId: PortfolioAssetId;
  assetSymbol: string;
  classification: TokenActivityClassification | "sol_in" | "sol_out";
  confidence: "low" | "medium" | "high";
  amountRaw: string;
  amountFormatted: string;
  blockTime: number | null;
  venue: string | null;
  solscanUrl: string;
}

export interface PortfolioWatchItem {
  id: string;
  targetWallet: string;
  tokenMint: string;
  scanId: string | null;
  snapshot: ScannerTokenSnapshot | null;
  pressure: DistributionPressureResult | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioJournalEntry {
  id: string;
  decision: JournalDecision;
  tokenMint: string;
  targetWallet: string | null;
  thesis: string;
  invalidation: string;
  notes: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioDataCoverage {
  balanceStatus: "live";
  activityStatus: PortfolioActivityStatus;
  activityMessage: string;
  selectedSignatures: number;
  loadedTransactions: number;
  historyPoints: number;
  refreshedAt: string;
}

export interface PortfolioPayload {
  access: LeviAccessState;
  current: PortfolioSnapshot;
  history: PortfolioSnapshot[];
  activity: PortfolioActivity[];
  watchlist: PortfolioWatchItem[];
  journal: PortfolioJournalEntry[];
  coverage: PortfolioDataCoverage;
  persistenceAvailable: boolean;
  persistenceMessage?: string;
}
