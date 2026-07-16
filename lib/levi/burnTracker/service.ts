import type { BurnTrackerPublicSnapshot, BurnTrackerRecord } from "@/types/burnTracker";
import {
  fetchLatestLeviAiMintSignature,
  fetchLeviAiCommunityLockBalance,
  fetchLeviAiMintSupply,
  scanForLatestLeviAiBurn,
  type DetectedBurn,
} from "./chain";
import {
  calculateBurnMetrics,
  calculateCirculationMetrics,
  getBurnTrackerNextRefreshAt,
} from "./calculations";
import {
  AGENT_K9_DECIMALS,
  AGENT_K9_INITIAL_SUPPLY_RAW,
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_SYMBOL,
  SOLANA_INCINERATOR_ADDRESS,
  SOLANA_INCINERATOR_URL,
} from "./constants";
import {
  acquireBurnTrackerRefreshLease,
  completeBurnTrackerRefresh,
  releaseBurnTrackerRefreshLease,
} from "./store";

export class BurnTrackerUnavailableError extends Error {
  constructor() {
    super("The burn tracker has no cached snapshot yet.");
    this.name = "BurnTrackerUnavailableError";
  }
}

export function toBurnTrackerPublicSnapshot(
  record: BurnTrackerRecord,
  stale: boolean
): BurnTrackerPublicSnapshot {
  const metrics = calculateBurnMetrics(record.currentSupplyRaw);
  const circulation = calculateCirculationMetrics(
    metrics.currentSupplyRaw,
    record.communityLockRaw
  );

  return {
    mint: AGENT_K9_MINT_ADDRESS,
    symbol: AGENT_K9_SYMBOL,
    decimals: AGENT_K9_DECIMALS,
    initialSupplyRaw: AGENT_K9_INITIAL_SUPPLY_RAW,
    currentSupplyRaw: metrics.currentSupplyRaw,
    totalBurnedRaw: metrics.totalBurnedRaw,
    percentageBurned: metrics.percentageBurned,
    communityLockRaw: circulation.communityLockRaw,
    effectiveCirculatingSupplyRaw: circulation.effectiveCirculatingSupplyRaw,
    latestBurn: record.latestBurn,
    communityLockWallet: SOLANA_INCINERATOR_ADDRESS,
    communityLockUrl: SOLANA_INCINERATOR_URL,
    refreshedAt: record.refreshedAt,
    nextRefreshAt: getBurnTrackerNextRefreshAt(record.refreshedAt),
    stale,
    verificationPending: record.verificationPending,
  };
}

async function refreshBurnTracker(
  previous: BurnTrackerRecord | null,
  leaseId: string,
  now: Date,
  verifiedBurn?: DetectedBurn
): Promise<BurnTrackerPublicSnapshot> {
  const [currentSupplyRaw, latestMintSignature, communityLockRaw] = await Promise.all([
    fetchLeviAiMintSupply(),
    fetchLatestLeviAiMintSignature(),
    fetchLeviAiCommunityLockBalance(),
  ]);
  const metrics = calculateBurnMetrics(currentSupplyRaw);
  const nowIso = now.toISOString();

  if (!previous) {
    const record: BurnTrackerRecord = {
      version: 2,
      mint: AGENT_K9_MINT_ADDRESS,
      initialSupplyRaw: AGENT_K9_INITIAL_SUPPLY_RAW,
      currentSupplyRaw: metrics.currentSupplyRaw,
      totalBurnedRaw: metrics.totalBurnedRaw,
      communityLockRaw,
      latestBurn: verifiedBurn || null,
      lastObservedMintSignature: latestMintSignature,
      pendingBurnCursor: null,
      pendingBurnUntil: null,
      verificationPending: false,
      refreshedAt: nowIso,
      refreshLeaseId: null,
      refreshLeaseUntil: null,
    };
    await completeBurnTrackerRefresh(leaseId, record);
    return toBurnTrackerPublicSnapshot(record, false);
  }

  const supplyDecreased =
    BigInt(metrics.currentSupplyRaw) < BigInt(previous.currentSupplyRaw);
  let latestBurn = previous.latestBurn;
  let pendingBurnCursor = previous.pendingBurnCursor;
  let pendingBurnUntil = previous.pendingBurnUntil;
  let verificationPending = previous.verificationPending;

  if (verifiedBurn) {
    latestBurn = verifiedBurn;
    pendingBurnCursor = null;
    pendingBurnUntil = null;
    verificationPending = false;
  } else if (supplyDecreased && previous.lastObservedMintSignature) {
    pendingBurnCursor = null;
    pendingBurnUntil = previous.lastObservedMintSignature;
    verificationPending = true;
  }

  if (verificationPending && pendingBurnUntil) {
    const scan = await scanForLatestLeviAiBurn({
      before: pendingBurnCursor,
      until: pendingBurnUntil,
    });
    if (scan.latestBurn) {
      latestBurn = scan.latestBurn;
      pendingBurnCursor = null;
      pendingBurnUntil = null;
      verificationPending = false;
    } else if (scan.hasMore && scan.nextCursor) {
      pendingBurnCursor = scan.nextCursor;
    } else {
      pendingBurnCursor = null;
      pendingBurnUntil = null;
      verificationPending = false;
    }
  }

  const record: BurnTrackerRecord = {
    version: 2,
    mint: AGENT_K9_MINT_ADDRESS,
    initialSupplyRaw: AGENT_K9_INITIAL_SUPPLY_RAW,
    currentSupplyRaw: metrics.currentSupplyRaw,
    totalBurnedRaw: metrics.totalBurnedRaw,
    communityLockRaw,
    latestBurn,
    lastObservedMintSignature: latestMintSignature || previous.lastObservedMintSignature,
    pendingBurnCursor,
    pendingBurnUntil,
    verificationPending,
    refreshedAt: nowIso,
    refreshLeaseId: null,
    refreshLeaseUntil: null,
  };
  await completeBurnTrackerRefresh(leaseId, record);
  return toBurnTrackerPublicSnapshot(record, false);
}

export async function getLiveBurnTrackerSnapshot(
  now = new Date(),
  options: { force?: boolean; verifiedBurn?: DetectedBurn } = {}
): Promise<BurnTrackerPublicSnapshot> {
  const lease = await acquireBurnTrackerRefreshLease(now, { force: options.force });

  if (lease.state === "fresh") return toBurnTrackerPublicSnapshot(lease.record, false);
  if (lease.state === "locked") {
    if (lease.record) return toBurnTrackerPublicSnapshot(lease.record, true);
    throw new BurnTrackerUnavailableError();
  }

  try {
    return await refreshBurnTracker(
      lease.record,
      lease.leaseId,
      now,
      options.verifiedBurn
    );
  } catch (error) {
    await releaseBurnTrackerRefreshLease(lease.leaseId).catch(() => undefined);
    if (lease.record) return toBurnTrackerPublicSnapshot(lease.record, true);
    throw error;
  }
}
