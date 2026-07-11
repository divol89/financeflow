import type {
  ClassifiedTokenActivity,
  CreatorSellSignal,
  LeviScanReport,
  TokenActivitySignal,
  TokenCreationSignal,
} from "@/types/levi";
import { summarizeClassifiedActivity } from "./classification";
import { calculateDistributionPressure } from "./pressure";

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function mergeScanReports(
  current: LeviScanReport,
  older: LeviScanReport
): LeviScanReport {
  const activityEvents = uniqueBy<ClassifiedTokenActivity>(
    [...(current.activityEvents || []), ...(older.activityEvents || [])],
    (event) => event.id
  ).sort((left, right) => (right.blockTime || 0) - (left.blockTime || 0));
  const createdTokens = uniqueBy<TokenCreationSignal>(
    [...current.createdTokens, ...older.createdTokens],
    (event) => `${event.signature}:${event.mint}`
  );
  const sellSignals = uniqueBy<CreatorSellSignal>(
    [...current.sellSignals, ...older.sellSignals],
    (event) => `${event.signature}:${event.mint}`
  );
  const tokenActivitySignals = uniqueBy<TokenActivitySignal>(
    [...(current.tokenActivitySignals || []), ...(older.tokenActivitySignals || [])],
    (event) => `${event.signature}:${event.mint}`
  );
  const selectedSignatures =
    current.scanCoverage.selectedSignatures + older.scanCoverage.selectedSignatures;
  const loadedTransactions =
    current.scanCoverage.loadedTransactions + older.scanCoverage.loadedTransactions;
  const scanCoverage = {
    ...current.scanCoverage,
    walletSignatures:
      current.scanCoverage.walletSignatures + older.scanCoverage.walletSignatures,
    tokenAccountSignatures:
      current.scanCoverage.tokenAccountSignatures + older.scanCoverage.tokenAccountSignatures,
    selectedSignatures,
    loadedTransactions,
    skippedTransactions:
      current.scanCoverage.skippedTransactions + older.scanCoverage.skippedTransactions,
    rateLimited:
      current.scanCoverage.rateLimited || older.scanCoverage.rateLimited,
    loadedRatio:
      selectedSignatures > 0 ? loadedTransactions / selectedSignatures : 0,
    partial:
      Boolean(current.scanCoverage.partial) || Boolean(older.scanCoverage.partial),
    newestBlockTime:
      current.scanCoverage.newestBlockTime || older.scanCoverage.newestBlockTime || null,
    oldestBlockTime:
      older.scanCoverage.oldestBlockTime || current.scanCoverage.oldestBlockTime || null,
    nextCursor: older.scanCoverage.nextCursor || null,
  };
  const snapshot = older.snapshot || current.snapshot;
  const decimals =
    snapshot?.walletBalance.decimals ||
    activityEvents[0]?.targetAmount.decimals ||
    0;
  const tokenActivitySummaryV2 = summarizeClassifiedActivity(
    activityEvents,
    decimals
  );
  const quickSellSignalCount = Math.max(
    current.quickSellSignalCount,
    older.quickSellSignalCount
  );

  return {
    ...current,
    inspectedSignatures: selectedSignatures,
    inspectedTransactions: loadedTransactions,
    createdTokens,
    createdTokenCount: createdTokens.length,
    sellSignals,
    sellSignalCount: sellSignals.length,
    tokenActivitySignals,
    activityEvents,
    tokenActivitySummaryV2,
    quickSellSignalCount,
    scanCoverage,
    limitations: uniqueBy(
      [...current.limitations, ...older.limitations],
      (item) => item
    ),
    distributionPressure:
      snapshot && current.targetMint
        ? calculateDistributionPressure({
            snapshot,
            events: activityEvents,
            coverage: scanCoverage,
            quickSellSignalCount,
          })
        : current.distributionPressure,
  };
}
