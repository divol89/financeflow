import type { PortfolioSnapshot } from "@/types/portfolio";
import {
  PORTFOLIO_FLAT_HEARTBEAT_MS,
  PORTFOLIO_SNAPSHOT_MIN_INTERVAL_MS,
} from "./constants";

export function portfolioAssetsEqual(
  left: PortfolioSnapshot,
  right: PortfolioSnapshot
): boolean {
  return left.assets.every((asset) => {
    const candidate = right.assets.find((item) => item.id === asset.id);
    return candidate?.raw === asset.raw && candidate.decimals === asset.decimals;
  });
}

export function shouldStorePortfolioSnapshot(
  lastStored: PortfolioSnapshot | null,
  current: PortfolioSnapshot
): boolean {
  if (!lastStored) return true;
  const lastMs = new Date(lastStored.capturedAt).getTime();
  const currentMs = new Date(current.capturedAt).getTime();
  const elapsed = currentMs - lastMs;
  if (elapsed >= PORTFOLIO_FLAT_HEARTBEAT_MS) return true;
  return (
    !portfolioAssetsEqual(lastStored, current) &&
    elapsed >= PORTFOLIO_SNAPSHOT_MIN_INTERVAL_MS
  );
}
