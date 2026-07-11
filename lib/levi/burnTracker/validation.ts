import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";

function isLatestBurn(value: unknown): boolean {
  if (value === null) return true;
  if (!value || typeof value !== "object") return false;

  const burn = value as Record<string, unknown>;
  return (
    typeof burn.signature === "string" &&
    typeof burn.occurredAt === "string" &&
    (burn.amountRaw === null || typeof burn.amountRaw === "string") &&
    typeof burn.solscanUrl === "string"
  );
}

export function isBurnTrackerPublicSnapshot(
  value: unknown
): value is BurnTrackerPublicSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Record<string, unknown>;

  return (
    typeof snapshot.mint === "string" &&
    typeof snapshot.symbol === "string" &&
    typeof snapshot.decimals === "number" &&
    typeof snapshot.initialSupplyRaw === "string" &&
    typeof snapshot.currentSupplyRaw === "string" &&
    typeof snapshot.totalBurnedRaw === "string" &&
    typeof snapshot.percentageBurned === "string" &&
    typeof snapshot.communityLockRaw === "string" &&
    typeof snapshot.effectiveCirculatingSupplyRaw === "string" &&
    isLatestBurn(snapshot.latestBurn) &&
    typeof snapshot.communityLockWallet === "string" &&
    typeof snapshot.communityLockUrl === "string" &&
    typeof snapshot.refreshedAt === "string" &&
    typeof snapshot.nextRefreshAt === "string" &&
    typeof snapshot.stale === "boolean" &&
    typeof snapshot.verificationPending === "boolean"
  );
}
