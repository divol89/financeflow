import type {
  ClassifiedTokenActivity,
  DistributionPressureFactors,
  DistributionPressureResult,
  ScanCoverage,
  ScannerTokenSnapshot,
} from "@/types/levi";
import { absBigInt, percentageOf } from "./amounts";
import { getPressureLevel } from "./methodology";

interface PressureInput {
  snapshot: ScannerTokenSnapshot;
  events: ClassifiedTokenActivity[];
  coverage: ScanCoverage;
  quickSellSignalCount: number;
}

const ZERO = BigInt(0);

function concentrationScore(share: number | null): number {
  if (share === null || share < 1) return 0;
  if (share < 5) return 5;
  if (share < 10) return 10;
  if (share < 20) return 15;
  return 20;
}

function sellingScore(soldPercent: number | null, latestSellAt: number | null): number {
  if (soldPercent === null || soldPercent <= 0) return 0;
  let score = soldPercent <= 2 ? 8 : soldPercent <= 10 ? 16 : soldPercent <= 25 ? 24 : 32;
  const recentThreshold = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
  if (latestSellAt && latestSellAt >= recentThreshold) score += 3;
  return Math.min(35, score);
}

function confidenceForCoverage(
  coverage: ScanCoverage,
  snapshotComplete: boolean
): "low" | "medium" | "high" {
  const ratio = coverage.loadedRatio ??
    (coverage.selectedSignatures > 0
      ? coverage.loadedTransactions / coverage.selectedSignatures
      : 0);
  if (snapshotComplete && ratio >= 0.8 && !coverage.rateLimited) return "high";
  if (snapshotComplete && ratio >= 0.5) return "medium";
  return "low";
}

export function calculateDistributionPressure({
  snapshot,
  events,
  coverage,
  quickSellSignalCount,
}: PressureInput): DistributionPressureResult {
  const ratio = coverage.loadedRatio ??
    (coverage.selectedSignatures > 0
      ? coverage.loadedTransactions / coverage.selectedSignatures
      : 0);
  const confidence = confidenceForCoverage(coverage, snapshot.complete);
  if (snapshot.addressKind === "programmatic-address") {
    const routedEvents = events.filter(
      (event) => event.classification === "routed"
    );
    return {
      score: null,
      level: "insufficient",
      confidence,
      factors: {
        authorities:
          (snapshot.mintAuthority ? 15 : 0) +
          (snapshot.freezeAuthority ? 10 : 0),
        concentration: 0,
        observedSelling: 0,
        repeatedPattern: 0,
        unknownOutflow: 0,
      },
      summary:
        routedEvents.length > 0
          ? "This program address routes target-token volume, so a human distribution-pressure score does not apply."
          : "This is a program address, so its activity cannot be scored as a human holder strategy.",
      reasons: [
        snapshot.authoritiesRevoked
          ? "Mint and freeze authorities are revoked."
          : "Token authorities still require review.",
        ...(routedEvents.length > 0
          ? [
              `${routedEvents.length} program-routed transaction${routedEvents.length === 1 ? "" : "s"} appeared in the observed window.`,
            ]
          : []),
      ],
      unknowns: [
        "A program address cannot be interpreted as a user wallet or creator trading strategy.",
      ],
    };
  }
  const sellEvents = events.filter(
    (event) => event.classification === "sell" && event.confidence === "high"
  );
  const unknownOutflows = events.filter(
    (event) =>
      BigInt(event.targetDeltaRaw) < ZERO &&
      (event.classification === "unknown" || event.classification === "transfer_out")
  );
  const soldRaw = sellEvents.reduce(
    (total, event) => total + absBigInt(BigInt(event.targetDeltaRaw)),
    ZERO
  );
  const netObserved = events.reduce(
    (total, event) => total + BigInt(event.targetDeltaRaw),
    ZERO
  );
  const currentRaw = BigInt(snapshot.walletBalance.raw);
  const observedStartRaw = currentRaw - netObserved;
  const soldPercent = percentageOf(soldRaw, observedStartRaw > ZERO ? observedStartRaw : soldRaw);
  const unknownRaw = unknownOutflows.reduce(
    (total, event) => total + absBigInt(BigInt(event.targetDeltaRaw)),
    ZERO
  );
  const unknownPercent = percentageOf(
    unknownRaw,
    observedStartRaw > ZERO ? observedStartRaw : unknownRaw
  );
  const latestSellAt = sellEvents.reduce<number | null>(
    (latest, event) => Math.max(latest || 0, event.blockTime || 0) || null,
    null
  );

  const factors: DistributionPressureFactors = {
    authorities:
      (snapshot.mintAuthority ? 15 : 0) + (snapshot.freezeAuthority ? 10 : 0),
    concentration: concentrationScore(snapshot.walletSharePercent),
    observedSelling: sellingScore(soldPercent, latestSellAt),
    repeatedPattern:
      quickSellSignalCount >= 2
        ? 15
        : quickSellSignalCount >= 1 || sellEvents.length >= 5
          ? 10
          : sellEvents.length >= 3
            ? 5
            : 0,
    unknownOutflow: unknownPercent !== null && unknownPercent >= 10 ? 5 : 0,
  };
  const score = Object.values(factors).reduce((total, value) => total + value, 0);
  const insufficient =
    !snapshot.complete || coverage.loadedTransactions < 5 || ratio < 0.5;
  const reasons: string[] = [];
  const unknowns: string[] = [];

  if (snapshot.authoritiesRevoked) reasons.push("Mint and freeze authorities are revoked.");
  if (snapshot.mintAuthority) reasons.push("Mint authority remains active.");
  if (snapshot.freezeAuthority) reasons.push("Freeze authority remains active.");
  if ((snapshot.walletSharePercent || 0) >= 10) {
    reasons.push(`The inspected wallet controls ${snapshot.walletSharePercent?.toFixed(2)}% of current supply.`);
  }
  if (sellEvents.length > 0) {
    reasons.push(`${sellEvents.length} high-confidence sell event${sellEvents.length === 1 ? "" : "s"} appeared in the observed window.`);
  } else {
    reasons.push("No high-confidence sell was found in the observed window.");
  }
  if (unknownOutflows.length > 0) {
    unknowns.push(`${unknownOutflows.length} outgoing movement${unknownOutflows.length === 1 ? "" : "s"} could not be treated as a verified sale.`);
  }
  unknowns.push("Linked wallets, OTC transfers and activity before the inspected window are not proven by this report.");

  if (insufficient) {
    return {
      score: null,
      level: "insufficient",
      confidence,
      factors,
      summary: "There is not enough complete evidence to assign distribution pressure.",
      reasons,
      unknowns,
    };
  }

  const level = getPressureLevel(score);
  const summaries = {
    lower: "Lower distribution pressure in the observed window.",
    watch: "Some distribution or control signals deserve review.",
    elevated: "Meaningful distribution pressure is visible in the observed window.",
    high: "Strong distribution and control signals require careful review.",
  } as const;

  return {
    score,
    level,
    confidence,
    factors,
    summary: summaries[level],
    reasons,
    unknowns,
  };
}
