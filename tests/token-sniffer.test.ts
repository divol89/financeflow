import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTokenSnifferVerdict,
  normalizeTokenSnifferReport,
  tokenProgramLabel,
} from "@/lib/tokenSniffer/model";
import {
  isTokenSnifferCacheFresh,
  TOKEN_SNIFFER_CACHE_TTL_MS,
  TOKEN_SNIFFER_MIN_REQUEST_INTERVAL_MS,
} from "@/lib/tokenSniffer/provider";

const mint = "AQPhtB5DSqFbhtnN5wSjNdkHmBE15qFX76EfXRnspump";

describe("Token Sniffer report model", () => {
  it("normalizes the provider summary for beginner-facing display", () => {
    const now = new Date("2026-07-13T01:00:00.000Z");
    const report = normalizeTokenSnifferReport(
      mint,
      {
        tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
        risks: [
          {
            name: "High holder concentration",
            description: "The top holders control a large part of supply",
            score: 1016,
            level: "warn",
          },
        ],
        score: 1017,
        score_normalised: 22,
        lpLockedPct: 0,
      },
      now
    );

    assert.equal(report.tokenProgramLabel, "Token-2022");
    assert.equal(report.scoreNormalized, 22);
    assert.equal(report.verdict.tone, "review");
    assert.equal(report.risks[0].tone, "warn");
    assert.equal(report.expiresAt, "2026-07-13T01:10:00.000Z");
  });

  it("never calls a low score safe", () => {
    const verdict = getTokenSnifferVerdict(0, []);
    assert.equal(verdict.label, "Fewer warning signals");
    assert.match(verdict.summary, /does not make the token safe/i);
  });

  it("lets a provider danger signal override a lower numeric score", () => {
    const verdict = getTokenSnifferVerdict(10, [
      {
        id: "danger",
        name: "Danger",
        value: null,
        description: "Review",
        score: 1,
        tone: "danger",
      },
    ]);
    assert.equal(verdict.tone, "high");
  });

  it("recognizes both Solana token programs", () => {
    assert.equal(
      tokenProgramLabel("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      "SPL Token"
    );
    assert.equal(tokenProgramLabel("unknown"), "Unknown token program");
  });
});

describe("Token Sniffer provider protection", () => {
  it("keeps outbound traffic at or below two requests per second", () => {
    assert.ok(TOKEN_SNIFFER_MIN_REQUEST_INTERVAL_MS >= 500);
  });

  it("uses a ten-minute provider cache", () => {
    assert.equal(TOKEN_SNIFFER_CACHE_TTL_MS, 10 * 60_000);
    const report = normalizeTokenSnifferReport(
      mint,
      { tokenProgram: "", risks: [], score_normalised: 0 },
      new Date("2026-07-13T01:00:00.000Z")
    );
    assert.equal(
      isTokenSnifferCacheFresh(report, Date.parse("2026-07-13T01:09:59.999Z")),
      true
    );
    assert.equal(
      isTokenSnifferCacheFresh(report, Date.parse("2026-07-13T01:10:00.000Z")),
      false
    );
  });
});
