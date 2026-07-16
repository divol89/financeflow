import type { BurnTrackerRecord } from "@/types/burnTracker";
import {
  BURN_TRACKER_CACHE_TTL_MS,
  AGENT_K9_DECIMALS,
  AGENT_K9_INITIAL_SUPPLY_RAW,
} from "./constants";

const PERCENTAGE_DECIMALS = 6;
const PERCENTAGE_SCALE = BigInt(10 ** PERCENTAGE_DECIMALS);

export interface BurnMetrics {
  currentSupplyRaw: string;
  totalBurnedRaw: string;
  percentageBurned: string;
}

export interface CirculationMetrics {
  communityLockRaw: string;
  effectiveCirculatingSupplyRaw: string;
}

function parseRawAmount(rawAmount: string): bigint {
  const value = BigInt(rawAmount);
  if (value < 0) throw new Error("Token amounts cannot be negative.");
  return value;
}

function addThousands(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calculateBurnMetrics(currentSupplyRaw: string): BurnMetrics {
  const initialSupply = parseRawAmount(AGENT_K9_INITIAL_SUPPLY_RAW);
  const currentSupply = parseRawAmount(currentSupplyRaw);
  const totalBurned = currentSupply >= initialSupply ? BigInt(0) : initialSupply - currentSupply;
  const percentageScaled = (totalBurned * BigInt(100) * PERCENTAGE_SCALE) / initialSupply;

  return {
    currentSupplyRaw: currentSupply.toString(),
    totalBurnedRaw: totalBurned.toString(),
    percentageBurned: formatRawTokenAmount(
      percentageScaled.toString(),
      PERCENTAGE_DECIMALS,
      PERCENTAGE_DECIMALS
    ),
  };
}

export function calculateCirculationMetrics(
  currentSupplyRaw: string,
  communityLockRaw: string
): CirculationMetrics {
  const currentSupply = parseRawAmount(currentSupplyRaw);
  const communityLock = parseRawAmount(communityLockRaw);
  const effectiveCirculatingSupply =
    currentSupply > communityLock ? currentSupply - communityLock : BigInt(0);

  return {
    communityLockRaw: communityLock.toString(),
    effectiveCirculatingSupplyRaw: effectiveCirculatingSupply.toString(),
  };
}

export function formatRawTokenAmount(
  rawAmount: string,
  decimals = AGENT_K9_DECIMALS,
  maximumFractionDigits = decimals
): string {
  const value = parseRawAmount(rawAmount).toString().padStart(decimals + 1, "0");
  const whole = value.slice(0, -decimals) || "0";
  const fraction = value.slice(-decimals).slice(0, maximumFractionDigits).replace(/0+$/, "");

  return fraction ? `${addThousands(whole)}.${fraction}` : addThousands(whole);
}

export function isBurnTrackerSnapshotFresh(
  record: Pick<BurnTrackerRecord, "refreshedAt">,
  nowMs: number
): boolean {
  const refreshedAtMs = Date.parse(record.refreshedAt);
  return Number.isFinite(refreshedAtMs) && nowMs - refreshedAtMs < BURN_TRACKER_CACHE_TTL_MS;
}

export function isBurnTrackerRefreshLeaseActive(
  record: Pick<BurnTrackerRecord, "refreshLeaseUntil">,
  nowMs: number
): boolean {
  if (!record.refreshLeaseUntil) return false;
  const leaseUntilMs = Date.parse(record.refreshLeaseUntil);
  return Number.isFinite(leaseUntilMs) && leaseUntilMs > nowMs;
}

export function getBurnTrackerNextRefreshAt(refreshedAt: string): string {
  const refreshedAtMs = Date.parse(refreshedAt);
  const nextRefreshAtMs = Number.isFinite(refreshedAtMs)
    ? refreshedAtMs + BURN_TRACKER_CACHE_TTL_MS
    : Date.now() + BURN_TRACKER_CACHE_TTL_MS;
  return new Date(nextRefreshAtMs).toISOString();
}
