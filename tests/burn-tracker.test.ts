import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateBurnMetrics,
  formatRawTokenAmount,
  getBurnTrackerNextRefreshAt,
  isBurnTrackerRefreshLeaseActive,
  isBurnTrackerSnapshotFresh,
} from "../lib/levi/burnTracker/calculations";
import { extractBurnAmountRaw } from "../lib/levi/burnTracker/chain";
import { toBurnTrackerPublicSnapshot } from "../lib/levi/burnTracker/service";
import {
  LEVI_AI_MINT_ADDRESS,
  BURN_TRACKER_CACHE_TTL_MS,
} from "../lib/levi/burnTracker/constants";

test("calculates the LEVI AI burn total exactly with BigInt precision", () => {
  const metrics = calculateBurnMetrics("999999549999999");

  assert.deepEqual(metrics, {
    currentSupplyRaw: "999999549999999",
    totalBurnedRaw: "450000001",
    percentageBurned: "0.000045",
  });
  assert.equal(formatRawTokenAmount(metrics.totalBurnedRaw), "450.000001");
  assert.equal(formatRawTokenAmount(metrics.currentSupplyRaw), "999,999,549.999999");
});

test("never reports a negative burn total when supply is above the 1B baseline", () => {
  const metrics = calculateBurnMetrics("1000000000000001");

  assert.equal(metrics.totalBurnedRaw, "0");
  assert.equal(metrics.percentageBurned, "0");
});

test("the two-hour tracker cache expires at the exact boundary", () => {
  const refreshedAt = "2026-07-11T10:00:00.000Z";
  const refreshedAtMs = Date.parse(refreshedAt);
  const record = { refreshedAt };

  assert.equal(isBurnTrackerSnapshotFresh(record, refreshedAtMs), true);
  assert.equal(
    isBurnTrackerSnapshotFresh(record, refreshedAtMs + BURN_TRACKER_CACHE_TTL_MS - 1),
    true
  );
  assert.equal(
    isBurnTrackerSnapshotFresh(record, refreshedAtMs + BURN_TRACKER_CACHE_TTL_MS),
    false
  );
  assert.equal(
    getBurnTrackerNextRefreshAt(refreshedAt),
    "2026-07-11T12:00:00.000Z"
  );
});

test("Firestore refresh leases remain active only before their stored expiry", () => {
  const now = Date.parse("2026-07-11T10:00:00.000Z");

  assert.equal(
    isBurnTrackerRefreshLeaseActive(
      { refreshLeaseUntil: "2026-07-11T10:01:30.000Z" },
      now
    ),
    true
  );
  assert.equal(
    isBurnTrackerRefreshLeaseActive(
      { refreshLeaseUntil: "2026-07-11T10:00:00.000Z" },
      now
    ),
    false
  );
  assert.equal(isBurnTrackerRefreshLeaseActive({ refreshLeaseUntil: null }, now), false);
});

test("serves an expired cached snapshot as stale without inventing a burn transaction", () => {
  const snapshot = toBurnTrackerPublicSnapshot(
    {
      version: 1,
      mint: LEVI_AI_MINT_ADDRESS,
      initialSupplyRaw: "1000000000000000",
      currentSupplyRaw: "999999549999999",
      totalBurnedRaw: "450000001",
      latestBurn: null,
      lastObservedMintSignature: "observedSignature",
      pendingBurnCursor: null,
      pendingBurnUntil: null,
      verificationPending: false,
      refreshedAt: "2026-07-11T10:00:00.000Z",
      refreshLeaseId: "lease",
      refreshLeaseUntil: "2026-07-11T10:01:30.000Z",
    },
    true
  );

  assert.equal(snapshot.stale, true);
  assert.equal(snapshot.latestBurn, null);
  assert.equal(snapshot.totalBurnedRaw, "450000001");
  assert.equal(snapshot.nextRefreshAt, "2026-07-11T12:00:00.000Z");
});

test("detects a finalized Token-2022 Burn for the LEVI AI mint", () => {
  const amount = extractBurnAmountRaw({
    meta: { err: null },
    transaction: {
      message: {
        instructions: [
          {
            parsed: {
              type: "burn",
              info: { mint: LEVI_AI_MINT_ADDRESS, amount: "5000000" },
            },
          },
        ],
      },
    },
  });

  assert.equal(amount, "5000000");
});

test("detects a LEVI AI BurnChecked nested inside a transaction", () => {
  const amount = extractBurnAmountRaw({
    meta: {
      err: null,
      innerInstructions: [
        {
          instructions: [
            {
              parsed: {
                type: "burnChecked",
                info: { mint: LEVI_AI_MINT_ADDRESS, amount: "1234567" },
              },
            },
          ],
        },
      ],
    },
  });

  assert.equal(amount, "1234567");
});

test("ignores transfers, dead-wallet locks, unrelated mints and failed transactions", () => {
  const tokenTransfer = {
    meta: { err: null },
    transaction: {
      message: {
        instructions: [
          {
            parsed: {
              type: "transferChecked",
              info: { mint: LEVI_AI_MINT_ADDRESS, amount: "1000000" },
            },
          },
        ],
      },
    },
  };
  const otherMintBurn = {
    meta: { err: null },
    transaction: {
      message: {
        instructions: [
          {
            parsed: {
              type: "burnChecked",
              info: { mint: "OtherMint", amount: "1000000" },
            },
          },
        ],
      },
    },
  };
  const failedBurn = {
    meta: {
      err: { InstructionError: [0, "Custom"] },
      innerInstructions: [
        {
          instructions: [
            {
              parsed: {
                type: "burn",
                info: { mint: LEVI_AI_MINT_ADDRESS, amount: "1000000" },
              },
            },
          ],
        },
      ],
    },
  };

  assert.equal(extractBurnAmountRaw(tokenTransfer), null);
  assert.equal(extractBurnAmountRaw(otherMintBurn), null);
  assert.equal(extractBurnAmountRaw(failedBurn), null);
});
