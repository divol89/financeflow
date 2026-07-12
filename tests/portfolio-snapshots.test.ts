import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PortfolioSnapshot } from "@/types/portfolio";
import { shouldStorePortfolioSnapshot } from "@/lib/portfolio/snapshots";
import { getAccessLimits } from "@/lib/levi/access";
import { buildPortfolioCoverage } from "@/lib/portfolio/coverage";

function snapshot(capturedAt: string, leviRaw = "1000000"): PortfolioSnapshot {
  return {
    id: capturedAt,
    wallet: "Wallet1111111111111111111111111111111111111",
    capturedAt,
    assets: [
      { id: "sol", name: "Solana", symbol: "SOL", mint: null, raw: "1000000000", decimals: 9, formatted: "1" },
      { id: "levi", name: "LEVI", symbol: "LEVI", mint: "Mint", raw: leviRaw, decimals: 6, formatted: "1" },
      { id: "levi-ai", name: "LEVI AI", symbol: "LEVI AI", mint: "MintAI", raw: "2000000", decimals: 6, formatted: "2" },
    ],
  };
}

describe("Portfolio snapshot policy", () => {
  it("stores the first observation", () => {
    assert.equal(shouldStorePortfolioSnapshot(null, snapshot("2026-07-11T10:00:00.000Z")), true);
  });

  it("deduplicates an unchanged refresh", () => {
    assert.equal(
      shouldStorePortfolioSnapshot(
        snapshot("2026-07-11T10:00:00.000Z"),
        snapshot("2026-07-11T10:10:00.000Z")
      ),
      false
    );
  });

  it("stores a changed balance after the minimum interval", () => {
    assert.equal(
      shouldStorePortfolioSnapshot(
        snapshot("2026-07-11T10:00:00.000Z"),
        snapshot("2026-07-11T10:06:00.000Z", "2000000")
      ),
      true
    );
  });

  it("stores a daily flat heartbeat", () => {
    assert.equal(
      shouldStorePortfolioSnapshot(
        snapshot("2026-07-10T10:00:00.000Z"),
        snapshot("2026-07-11T10:00:00.000Z")
      ),
      true
    );
  });
});

describe("Portfolio tier limits", () => {
  it("keeps blocked wallets read-only", () => {
    const limits = getAccessLimits("blocked");
    assert.equal(limits.portfolioHistoryDays, 0);
    assert.equal(limits.watchlistLimit, 0);
    assert.equal(limits.journalLimit, 0);
  });

  it("unlocks progressive history only for Full access", () => {
    assert.equal(getAccessLimits("basic").canExtendScanHistory, false);
    assert.equal(getAccessLimits("full").canExtendScanHistory, true);
    assert.equal(getAccessLimits("full").portfolioActivityLimit, 50);
  });
});

describe("Portfolio data coverage", () => {
  const base = {
    activityEnabled: true,
    activityFailed: false,
    activityPartial: false,
    storedActivityCount: 0,
    selectedSignatures: 8,
    loadedTransactions: 8,
    historyPoints: 3,
    refreshedAt: "2026-07-13T10:00:00.000Z",
  };

  it("reports live balances independently from partial activity", () => {
    const coverage = buildPortfolioCoverage({
      ...base,
      activityPartial: true,
      loadedTransactions: 5,
    });

    assert.equal(coverage.balanceStatus, "live");
    assert.equal(coverage.activityStatus, "partial");
    assert.match(coverage.activityMessage, /5\/8/);
  });

  it("keeps stored activity visible when the live RPC read fails", () => {
    const coverage = buildPortfolioCoverage({
      ...base,
      activityFailed: true,
      storedActivityCount: 4,
      loadedTransactions: 0,
    });

    assert.equal(coverage.activityStatus, "cached");
    assert.match(coverage.activityMessage, /stored events/i);
  });

  it("distinguishes unavailable activity from a locked tier", () => {
    assert.equal(
      buildPortfolioCoverage({ ...base, activityFailed: true }).activityStatus,
      "unavailable"
    );
    assert.equal(
      buildPortfolioCoverage({ ...base, activityEnabled: false }).activityStatus,
      "locked"
    );
  });
});
