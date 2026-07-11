import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAccessLimits, getAccessTier } from "@/lib/levi/access";

describe("LEVI access tiers", () => {
  it("blocks wallets below the minimum threshold", () => {
    assert.equal(getAccessTier(2_999.99), "blocked");
  });

  it("unlocks basic access at 3,000 LEVI AI", () => {
    assert.equal(getAccessTier(3_000), "basic");
    assert.equal(getAccessLimits("basic").details, "summary");
  });

  it("unlocks full access at 50,000 LEVI AI", () => {
    assert.equal(getAccessTier(50_000), "full");
    assert.equal(getAccessLimits("full").fullDashboard, true);
  });
});
