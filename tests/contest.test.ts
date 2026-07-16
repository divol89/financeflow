import assert from "node:assert/strict";
import test from "node:test";
import {
  ContestValidationError,
  normalizePostUrl,
} from "../lib/contest/validation";
import { getHighestContestTier } from "../lib/contest/eligibility";
import {
  CONTEST_HOLDER_TOKENS,
  AGENT_K9_HOLDER_MINT,
} from "../lib/contest/constants";
import { formatContestHolding } from "../lib/contest/formatting";

test("normalizes direct x.com post links", () => {
  assert.equal(
    normalizePostUrl("https://www.x.com/agentk9/status/1234567890/?s=20"),
    "https://x.com/agentk9/status/1234567890"
  );
});

test("accepts legacy twitter.com post links", () => {
  assert.equal(
    normalizePostUrl("https://twitter.com/agentk9/status/1234567890"),
    "https://twitter.com/agentk9/status/1234567890"
  );
});

test("rejects profiles, non-https URLs and unrelated hosts", () => {
  for (const value of [
    "https://x.com/agentk9",
    "https://x.com/search?q=agentk9",
    "http://x.com/agentk9/status/1234567890",
    "https://example.com/agentk9/status/1234567890",
  ]) {
    assert.throws(() => normalizePostUrl(value), ContestValidationError);
  }
});

test("supports K9 with the three surprise holding tiers", () => {
  assert.equal(CONTEST_HOLDER_TOKENS.length, 1);
  assert.equal(CONTEST_HOLDER_TOKENS[0].symbol, "K9");
  assert.equal(CONTEST_HOLDER_TOKENS[0].mint, AGENT_K9_HOLDER_MINT);

  const holding = (balance: number) => [
    {
      symbol: "K9",
      mint: AGENT_K9_HOLDER_MINT,
      balance,
      available: true,
    },
  ];

  assert.equal(getHighestContestTier(holding(499)), null);
  assert.equal(getHighestContestTier(holding(500))?.id, "signal");
  assert.equal(getHighestContestTier(holding(1_000))?.id, "amplifier");
  assert.equal(getHighestContestTier(holding(10_000))?.id, "sentinel");
});

test("formats contest tiers identically during server and browser rendering", () => {
  assert.equal(formatContestHolding(500), "500");
  assert.equal(formatContestHolding(1_000), "1,000");
  assert.equal(formatContestHolding(10_000), "10,000");
});
