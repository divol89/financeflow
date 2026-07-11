import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PortfolioSnapshot } from "@/types/portfolio";
import { shouldStorePortfolioSnapshot } from "@/lib/portfolio/snapshots";
import { getAccessLimits } from "@/lib/levi/access";

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
