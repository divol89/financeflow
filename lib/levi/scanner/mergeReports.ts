import type {
  ClassifiedTokenActivity,
  CreatorSellSignal,
  LeviScanReport,
  TokenActivitySignal,
  TokenCreationSignal,
} from "@/types/levi";
import { summarizeClassifiedActivity } from "./classification";
import { countQuickSellSignals } from "./analyzers";
import { calculateDistributionPressure } from "./pressure";
import { scoreCreatorRisk } from "./score";

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function optionalMaximum(values: Array<number | null | undefined>): number | null {
  const present = values.filter((value): value is number => typeof value === "number");
  return present.length > 0 ? Math.max(...present) : null;
}

function optionalMinimum(values: Array<number | null | undefined>): number | null {
  const present = values.filter((value): value is number => typeof value === "number");
  return present.length > 0 ? Math.min(...present) : null;
}

export function mergeScanReports(
  current: LeviScanReport,
  older: LeviScanReport
): LeviScanReport {
  if (
    current.wallet !== older.wallet ||
    current.targetMint !== older.targetMint ||
    current.mode !== older.mode
  ) {
    throw new Error("Scanner reports must describe the same wallet and token.");
  }
  const currentPages = current.scanCoverage.loadedPageIndexes || [
    current.scanCoverage.pageIndex || 0,
  ];
  const olderPages = older.scanCoverage.loadedPageIndexes || [
    older.scanCoverage.pageIndex || 0,
  ];
  const pageOverlap = olderPages.some((page) => currentPages.includes(page));
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
  const selectedSignatures = pageOverlap
    ? Math.max(
        current.scanCoverage.selectedSignatures,
        older.scanCoverage.selectedSignatures
      )
    : current.scanCoverage.selectedSignatures + older.scanCoverage.selectedSignatures;
  const loadedTransactions = pageOverlap
    ? Math.max(
        current.scanCoverage.loadedTransactions,
        older.scanCoverage.loadedTransactions
      )
    : current.scanCoverage.loadedTransactions + older.scanCoverage.loadedTransactions;
  const skippedTransactions = pageOverlap
    ? Math.max(
        current.scanCoverage.skippedTransactions,
        older.scanCoverage.skippedTransactions
      )
    : current.scanCoverage.skippedTransactions + older.scanCoverage.skippedTransactions;
  const scanCoverage = {
    ...current.scanCoverage,
    walletSignatures: pageOverlap
      ? Math.max(
          current.scanCoverage.walletSignatures,
          older.scanCoverage.walletSignatures
        )
      : current.scanCoverage.walletSignatures + older.scanCoverage.walletSignatures,
    tokenAccountSignatures: pageOverlap
      ? Math.max(
          current.scanCoverage.tokenAccountSignatures,
          older.scanCoverage.tokenAccountSignatures
        )
      : current.scanCoverage.tokenAccountSignatures +
        older.scanCoverage.tokenAccountSignatures,
    tokenAccounts: Math.max(
      current.scanCoverage.tokenAccounts,
      older.scanCoverage.tokenAccounts
    ),
    accountDiscoveryPartial:
      Boolean(current.scanCoverage.accountDiscoveryPartial) ||
      Boolean(older.scanCoverage.accountDiscoveryPartial),
    selectedSignatures,
    loadedTransactions,
    skippedTransactions,
    rateLimited:
      current.scanCoverage.rateLimited || older.scanCoverage.rateLimited,
    loadedRatio:
      selectedSignatures > 0 ? loadedTransactions / selectedSignatures : 0,
    partial:
      Boolean(current.scanCoverage.partial) ||
      Boolean(older.scanCoverage.partial) ||
      skippedTransactions > 0,
    newestBlockTime: optionalMaximum([
      current.scanCoverage.newestBlockTime,
      older.scanCoverage.newestBlockTime,
    ]),
    oldestBlockTime: optionalMinimum([
      current.scanCoverage.oldestBlockTime,
      older.scanCoverage.oldestBlockTime,
    ]),
    nextCursor: older.scanCoverage.nextCursor || null,
    pageIndex: Math.max(
      current.scanCoverage.pageIndex || 0,
      older.scanCoverage.pageIndex || 0
    ),
    batchSize: older.scanCoverage.batchSize || current.scanCoverage.batchSize,
    tierWindowLimit:
      current.scanCoverage.tierWindowLimit || older.scanCoverage.tierWindowLimit,
    loadedPageIndexes: [...new Set([...currentPages, ...olderPages])].sort(
      (left, right) => left - right
    ),
    initialWindowComplete:
      older.scanCoverage.initialWindowComplete ??
      current.scanCoverage.initialWindowComplete,
  };
  const snapshot = current.snapshot || older.snapshot;
  const decimals =
    snapshot?.walletBalance.decimals ||
    activityEvents[0]?.targetAmount.decimals ||
    0;
  const tokenActivitySummaryV2 = summarizeClassifiedActivity(
    activityEvents,
    decimals
  );
  const quickSellSignalCount = countQuickSellSignals(createdTokens, sellSignals);
  const creatorRisk = scoreCreatorRisk({
    createdTokenCount: createdTokens.length,
    sellSignalCount: sellSignals.length,
    quickSellSignalCount,
    inspectedTransactions: loadedTransactions,
  });

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
    score: creatorRisk.score,
    tier: creatorRisk.tier,
    summary: creatorRisk.summary,
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
