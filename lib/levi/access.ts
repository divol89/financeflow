import type { LeviAccessLimits, LeviAccessTier } from "@/types/levi";
import {
  BASIC_SCAN_LIMIT,
  FULL_SCAN_LIMIT,
  LEVI_BASIC_THRESHOLD,
  LEVI_DECIMALS,
  LEVI_FULL_THRESHOLD,
} from "./constants";

export function rawTokenAmount(tokens: number): bigint {
  return BigInt(Math.round(tokens * 10 ** LEVI_DECIMALS));
}

export function uiTokenAmount(rawAmount: bigint, decimals = LEVI_DECIMALS): number {
  return Number(rawAmount) / 10 ** decimals;
}

export function getAccessTier(balance: number): LeviAccessTier {
  if (balance >= LEVI_FULL_THRESHOLD) return "full";
  if (balance >= LEVI_BASIC_THRESHOLD) return "basic";
  return "blocked";
}

export function getAccessLimits(tier: LeviAccessTier): LeviAccessLimits {
  if (tier === "full") {
    return {
      scanLimit: FULL_SCAN_LIMIT,
      fullDashboard: true,
      details: "full",
      portfolioHistoryDays: null,
      portfolioActivityLimit: 50,
      watchlistLimit: 25,
      journalLimit: 200,
      canExtendScanHistory: true,
    };
  }

  if (tier === "basic") {
    return {
      scanLimit: BASIC_SCAN_LIMIT,
      fullDashboard: false,
      details: "summary",
      portfolioHistoryDays: 7,
      portfolioActivityLimit: 10,
      watchlistLimit: 3,
      journalLimit: 10,
      canExtendScanHistory: false,
    };
  }

  return {
    scanLimit: 0,
    fullDashboard: false,
    details: "none",
    portfolioHistoryDays: 0,
    portfolioActivityLimit: 0,
    watchlistLimit: 0,
    journalLimit: 0,
    canExtendScanHistory: false,
  };
}

export function getAccessReason(tier: LeviAccessTier): string {
  if (tier === "full") return "Full Scanner and Portfolio access unlocked with 50,000+ K9.";
  if (tier === "basic") return "Basic scanner unlocked with 3,000+ K9.";
  return "Hold at least 3,000 K9 to unlock scanner access.";
}
