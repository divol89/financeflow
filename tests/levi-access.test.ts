import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAccessLimits, getAccessReason, getAccessTier } from "@/lib/levi/access";

describe("open platform access", () => {
  it("does not derive access from a project-token balance", () => {
    assert.equal(getAccessTier(0), "full");
    assert.equal(getAccessTier(2_999.99), "full");
    assert.equal(getAccessTier(50_000), "full");
  });

  it("uses the same bounded platform capacity for legacy tier values", () => {
    assert.deepEqual(getAccessLimits("blocked"), getAccessLimits("full"));
    assert.deepEqual(getAccessLimits("basic"), getAccessLimits("full"));
    assert.equal(getAccessLimits("full").fullDashboard, true);
  });

  it("describes wallet verification without a holding requirement", () => {
    assert.match(getAccessReason("full"), /without requiring any token holding/i);
  });
});
