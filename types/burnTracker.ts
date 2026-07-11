export interface BurnTrackerLatestBurn {
  signature: string;
  occurredAt: string;
  amountRaw: string | null;
  solscanUrl: string;
}

export interface BurnTrackerRecord {
  version: 2;
  mint: string;
  initialSupplyRaw: string;
  currentSupplyRaw: string;
  totalBurnedRaw: string;
  communityLockRaw: string;
  latestBurn: BurnTrackerLatestBurn | null;
  lastObservedMintSignature: string | null;
  pendingBurnCursor: string | null;
  pendingBurnUntil: string | null;
  verificationPending: boolean;
  refreshedAt: string;
  refreshLeaseId: string | null;
  refreshLeaseUntil: string | null;
}

export interface BurnTrackerPublicSnapshot {
  mint: string;
  symbol: string;
  decimals: number;
  initialSupplyRaw: string;
  currentSupplyRaw: string;
  totalBurnedRaw: string;
  percentageBurned: string;
  communityLockRaw: string;
  effectiveCirculatingSupplyRaw: string;
  latestBurn: BurnTrackerLatestBurn | null;
  communityLockWallet: string;
  communityLockUrl: string;
  refreshedAt: string;
  nextRefreshAt: string;
  stale: boolean;
  verificationPending: boolean;
}
