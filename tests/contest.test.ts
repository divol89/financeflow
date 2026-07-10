import assert from "node:assert/strict";
import test from "node:test";
import {
  ContestValidationError,
  normalizePostUrl,
} from "../lib/contest/validation";

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
