import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scoreCreatorRisk } from "@/lib/levi/scanner/score";

describe("K9 risk scoring", () => {
  it("keeps quiet wallets low risk", () => {
    const result = scoreCreatorRisk({
      createdTokenCount: 0,
      sellSignalCount: 0,
      quickSellSignalCount: 0,
      inspectedTransactions: 50,
    });
    assert.equal(result.tier, "low");
    assert.equal(result.score, 0);
  });

  it("escalates repeated mint and sell behavior", () => {
    const result = scoreCreatorRisk({
      createdTokenCount: 5,
      sellSignalCount: 4,
      quickSellSignalCount: 2,
      inspectedTransactions: 80,
    });
    assert.equal(result.tier, "critical");
    assert.equal(result.score >= 80, true);
  });
});
