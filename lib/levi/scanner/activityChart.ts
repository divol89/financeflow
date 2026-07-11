import type { ClassifiedTokenActivity } from "@/types/levi";
import { absBigInt, formatRawAmount } from "./amounts";

const ZERO = BigInt(0);

export type ScannerObservedPostureTone =
  | "accumulating"
  | "distributing"
  | "mixed"
  | "inbound"
  | "outbound"
  | "routing"
  | "unknown";

export interface ScannerActivityChartPoint {
  id: string;
  timeLabel: string;
  timestamp: number | null;
  buy: number | null;
  sell: number | null;
  otherFlow: number | null;
  routedBuy: number | null;
  routedSell: number | null;
  routedNeutral: number | null;
  burn: number | null;
  cumulativeNet: number;
  cumulativeRoutedNet: number;
}

export interface ScannerActivityChartModel {
  points: ScannerActivityChartPoint[];
  posture: {
    tone: ScannerObservedPostureTone;
    label: string;
    summary: string;
  };
  buyCount: number;
  sellCount: number;
  routedCount: number;
  routedBuyCount: number;
  routedSellCount: number;
  otherMovementCount: number;
}

function chartNumber(raw: bigint, decimals: number): number {
  const value = Number(formatRawAmount(raw, decimals));
  return Number.isFinite(value) ? value : 0;
}

function timeLabel(event: ClassifiedTokenActivity, index: number): string {
  if (!event.blockTime) return `#${index + 1}`;
  return new Date(event.blockTime * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function observedPosture(input: {
  boughtRaw: bigint;
  soldRaw: bigint;
  inboundRaw: bigint;
  outboundRaw: bigint;
  routedRaw: bigint;
  routedBoughtRaw: bigint;
  routedSoldRaw: bigint;
}): ScannerActivityChartModel["posture"] {
  const {
    boughtRaw,
    soldRaw,
    inboundRaw,
    outboundRaw,
    routedRaw,
    routedBoughtRaw,
    routedSoldRaw,
  } = input;

  if (boughtRaw > ZERO || soldRaw > ZERO) {
    if (boughtRaw * BigInt(100) > soldRaw * BigInt(120)) {
      return {
        tone: "accumulating",
        label: "Observed accumulation",
        summary: "Verified buy volume exceeds verified sell volume in the loaded window.",
      };
    }
    if (soldRaw * BigInt(100) > boughtRaw * BigInt(120)) {
      return {
        tone: "distributing",
        label: "Observed distribution",
        summary: "Verified sell volume exceeds verified buy volume in the loaded window.",
      };
    }
    return {
      tone: "mixed",
      label: "Mixed trading",
      summary: "Verified buying and selling are close enough to require transaction-level review.",
    };
  }

  if (routedRaw > ZERO) {
    if (routedBoughtRaw * BigInt(100) > routedSoldRaw * BigInt(120)) {
      return {
        tone: "accumulating",
        label: "Buy-side routing dominates",
        summary: "Signer-side target-token increases exceed sell-side route volume in the loaded window.",
      };
    }
    if (routedSoldRaw * BigInt(100) > routedBoughtRaw * BigInt(120)) {
      return {
        tone: "distributing",
        label: "Sell-side routing dominates",
        summary: "Signer-side target-token decreases exceed buy-side route volume in the loaded window.",
      };
    }
    return {
      tone: "routing",
      label: "Mixed routed flow",
      summary: "Both buy-side and sell-side target-token routes appear in the loaded window.",
    };
  }

  if (outboundRaw > inboundRaw) {
    return {
      tone: "outbound",
      label: "Outbound movement",
      summary: "Tokens left the wallet, but no swap evidence proves those movements were sales.",
    };
  }
  if (inboundRaw > outboundRaw) {
    return {
      tone: "inbound",
      label: "Inbound movement",
      summary: "Tokens entered the wallet, but no swap evidence proves those movements were buys.",
    };
  }
  return {
    tone: "unknown",
    label: "No proven trade direction",
    summary: "The loaded window contains no target-token balance change that proves a buy or sell.",
  };
}

export function buildScannerActivityChart(
  events: ClassifiedTokenActivity[]
): ScannerActivityChartModel {
  const ordered = [...events].sort((left, right) => {
    const timeDifference = (left.blockTime || 0) - (right.blockTime || 0);
    return timeDifference || left.slot - right.slot;
  });
  let cumulativeRaw = ZERO;
  let boughtRaw = ZERO;
  let soldRaw = ZERO;
  let inboundRaw = ZERO;
  let outboundRaw = ZERO;
  let routedRaw = ZERO;
  let routedBoughtRaw = ZERO;
  let routedSoldRaw = ZERO;
  let cumulativeRoutedRaw = ZERO;
  let buyCount = 0;
  let sellCount = 0;
  let routedCount = 0;
  let routedBuyCount = 0;
  let routedSellCount = 0;
  let otherMovementCount = 0;

  const points = ordered.map((event, index) => {
    const deltaRaw = BigInt(event.targetDeltaRaw);
    const amountRaw = absBigInt(deltaRaw);
    const decimals = event.targetAmount.decimals;
    const amount = chartNumber(amountRaw, decimals);
    cumulativeRaw += deltaRaw;
    let buy: number | null = null;
    let sell: number | null = null;
    let otherFlow: number | null = null;
    let routedBuy: number | null = null;
    let routedSell: number | null = null;
    let routedNeutral: number | null = null;
    let burn: number | null = null;

    if (event.classification === "buy") {
      boughtRaw += amountRaw;
      buyCount += 1;
      buy = amount;
    } else if (event.classification === "sell") {
      soldRaw += amountRaw;
      sellCount += 1;
      sell = -amount;
    } else if (event.classification === "burn") {
      outboundRaw += amountRaw;
      otherMovementCount += 1;
      burn = -amount;
    } else if (event.classification === "routed") {
      const routedAmountRaw = BigInt(event.targetAmount.raw);
      routedRaw += routedAmountRaw;
      routedCount += 1;
      if (event.routeDirection === "buy") {
        routedBoughtRaw += routedAmountRaw;
        cumulativeRoutedRaw += routedAmountRaw;
        routedBuyCount += 1;
        routedBuy = chartNumber(routedAmountRaw, decimals);
      } else if (event.routeDirection === "sell") {
        routedSoldRaw += routedAmountRaw;
        cumulativeRoutedRaw -= routedAmountRaw;
        routedSellCount += 1;
        routedSell = -chartNumber(routedAmountRaw, decimals);
      } else {
        routedNeutral = chartNumber(routedAmountRaw, decimals);
      }
    } else {
      otherMovementCount += 1;
      otherFlow = chartNumber(deltaRaw, decimals);
      if (deltaRaw > ZERO) inboundRaw += deltaRaw;
      if (deltaRaw < ZERO) outboundRaw += absBigInt(deltaRaw);
    }

    return {
      id: event.id,
      timeLabel: timeLabel(event, index),
      timestamp: event.blockTime ? event.blockTime * 1000 : null,
      buy,
      sell,
      otherFlow,
      routedBuy,
      routedSell,
      routedNeutral,
      burn,
      cumulativeNet: chartNumber(cumulativeRaw, decimals),
      cumulativeRoutedNet: chartNumber(cumulativeRoutedRaw, decimals),
    };
  });

  return {
    points,
    posture: observedPosture({
      boughtRaw,
      soldRaw,
      inboundRaw,
      outboundRaw,
      routedRaw,
      routedBoughtRaw,
      routedSoldRaw,
    }),
    buyCount,
    sellCount,
    routedCount,
    routedBuyCount,
    routedSellCount,
    otherMovementCount,
  };
}
