import assert from "node:assert/strict";
import test from "node:test";
import {
  ContestValidationError,
  normalizePostUrl,
} from "../lib/contest/validation";
import { getHighestContestTier } from "../lib/contest/eligibility";
import { AQP_HOLDER_MINT, CONTEST_HOLDER_TOKENS } from "../lib/contest/constants";

test("normalizes direct x.com post links", () => {
  assert.equal(
    normalizePostUrl("https://www.x.com/levi/status/1234567890/?s=20"),
    "https://x.com/levi/status/1234567890"
  );
});

test("accepts legacy twitter.com post links", () => {
  assert.equal(
    normalizePostUrl("https://twitter.com/levi/status/1234567890"),
    "https://twitter.com/levi/status/1234567890"
  );
});

test("rejects profiles, non-https URLs and unrelated hosts", () => {
  for (const value of [
    "https://x.com/levi",
    "https://x.com/search?q=levi",
    "http://x.com/levi/status/1234567890",
    "https://example.com/levi/status/1234567890",
  ]) {
    assert.throws(() => normalizePostUrl(value), ContestValidationError);
  }
});

test("supports LEVI and AQP with the three surprise holding tiers", () => {
  assert.equal(CONTEST_HOLDER_TOKENS.length, 2);
  assert.equal(CONTEST_HOLDER_TOKENS[1].mint, AQP_HOLDER_MINT);

  const holding = (balance: number) => [
    {
      symbol: "AQP",
      mint: AQP_HOLDER_MINT,
      balance,
      available: true,
    },
  ];

  assert.equal(getHighestContestTier(holding(499)), null);
  assert.equal(getHighestContestTier(holding(500))?.id, "signal");
  assert.equal(getHighestContestTier(holding(1_000))?.id, "amplifier");
  assert.equal(getHighestContestTier(holding(10_000))?.id, "sentinel");
});
