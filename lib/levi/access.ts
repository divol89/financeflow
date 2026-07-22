import type { LeviAccessLimits, LeviAccessTier } from "@/types/levi";
import {
  FULL_SCAN_LIMIT,
  LEVI_DECIMALS,
} from "./constants";

export function rawTokenAmount(tokens: number): bigint {
  return BigInt(Math.round(tokens * 10 ** LEVI_DECIMALS));
}

export function uiTokenAmount(rawAmount: bigint, decimals = LEVI_DECIMALS): number {
  return Number(rawAmount) / 10 ** decimals;
}

export function getAccessTier(balance = 0): LeviAccessTier {
  void balance;
  return "full";
}

export function getAccessLimits(tier: LeviAccessTier = "full"): LeviAccessLimits {
  void tier;
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

export function getAccessReason(tier: LeviAccessTier = "full"): string {
  void tier;
  return "Open platform access. Wallet signatures protect private data without requiring any token holding.";
}
