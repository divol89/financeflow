import assert from "node:assert/strict";
import test from "node:test";
import {
  ContestValidationError,
  normalizePostUrl,
} from "../lib/contest/validation";
import { getContestEligibility } from "../lib/contest/eligibility";
import {
  CONTEST_HOLDER_TIERS,
  CONTEST_HOLDER_TOKENS,
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

test("keeps social participation open without holder tokens or tiers", async () => {
  assert.deepEqual(CONTEST_HOLDER_TOKENS, []);
  assert.deepEqual(CONTEST_HOLDER_TIERS, []);
  const eligibility = await getContestEligibility(
    "So11111111111111111111111111111111111111112"
  );
  assert.equal(eligibility.eligible, true);
  assert.equal(eligibility.tier, null);
  assert.deepEqual(eligibility.holdings, []);
});

test("formats contest tiers identically during server and browser rendering", () => {
  assert.equal(formatContestHolding(500), "500");
  assert.equal(formatContestHolding(1_000), "1,000");
  assert.equal(formatContestHolding(10_000), "10,000");
});
