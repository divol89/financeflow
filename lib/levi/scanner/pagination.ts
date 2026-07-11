import type { LeviAccessTier } from "@/types/levi";
import {
  BASIC_SCAN_LIMIT,
  FULL_SCAN_LIMIT,
  SCANNER_TRANSACTION_BATCH_SIZE,
} from "../constants";

export function scannerTierWindowLimit(tier: LeviAccessTier): number {
  if (tier === "full") return FULL_SCAN_LIMIT;
  if (tier === "basic") return BASIC_SCAN_LIMIT;
  return 0;
}

export function scannerInitialPageCount(
  tier: LeviAccessTier,
  batchSize = SCANNER_TRANSACTION_BATCH_SIZE
): number {
  const limit = scannerTierWindowLimit(tier);
  return limit > 0 ? Math.ceil(limit / batchSize) : 0;
}

export function scannerBatchSizeForPage(
  tier: LeviAccessTier,
  pageIndex: number,
  batchSize = SCANNER_TRANSACTION_BATCH_SIZE
): number {
  const limit = scannerTierWindowLimit(tier);
  const initialPageCount = scannerInitialPageCount(tier, batchSize);
  if (limit === 0 || pageIndex < 0) return 0;
  if (pageIndex >= initialPageCount) {
    return tier === "full" ? batchSize : 0;
  }
  return Math.min(batchSize, limit - pageIndex * batchSize);
}

export function allocateScannerSourceLimits(input: {
  sourceCount: number;
  transactionLimit: number;
  pageIndex: number;
}): number[] {
  const { sourceCount, transactionLimit, pageIndex } = input;
  if (sourceCount <= 0 || transactionLimit <= 0) return [];

  const limits = Array.from({ length: sourceCount }, () => 0);
  const start = pageIndex % sourceCount;
  for (let index = 0; index < transactionLimit; index += 1) {
    limits[(start + index) % sourceCount] += 1;
  }
  return limits;
}

export function scannerInitialWindowComplete(input: {
  tier: LeviAccessTier;
  pageIndex: number;
  hasMoreSources: boolean;
  batchSize?: number;
}): boolean {
  if (!input.hasMoreSources) return true;
  return (
    input.pageIndex + 1 >=
    scannerInitialPageCount(
      input.tier,
      input.batchSize || SCANNER_TRANSACTION_BATCH_SIZE
    )
  );
}

export function canContinueScannerPage(input: {
  tier: LeviAccessTier;
  nextPageIndex: number;
}): boolean {
  if (input.tier === "full") return true;
  return input.nextPageIndex < scannerInitialPageCount(input.tier);
}
