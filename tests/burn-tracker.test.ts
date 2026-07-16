import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateBurnMetrics,
  calculateCirculationMetrics,
  formatRawTokenAmount,
  getBurnTrackerNextRefreshAt,
  isBurnTrackerRefreshLeaseActive,
  isBurnTrackerSnapshotFresh,
} from "../lib/levi/burnTracker/calculations";
import {
  extractBurnAmountRaw,
  sumTokenAccountBalances,
} from "../lib/levi/burnTracker/chain";
import { toBurnTrackerPublicSnapshot } from "../lib/levi/burnTracker/service";
import { parseStoredBurnTrackerSnapshot } from "../lib/levi/burnTracker/clientEvents";
import {
  AGENT_K9_MINT_ADDRESS,
  BURN_TRACKER_CACHE_TTL_MS,
} from "../lib/levi/burnTracker/constants";

test("calculates the K9 burn total exactly with BigInt precision", () => {
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

test("removes permanent community locks from effective circulating supply", () => {
  const circulation = calculateCirculationMetrics(
    "999999549999999",
    "100000000"
  );

  assert.deepEqual(circulation, {
    communityLockRaw: "100000000",
    effectiveCirculatingSupplyRaw: "999999449999999",
  });
  assert.equal(
    formatRawTokenAmount(circulation.effectiveCirculatingSupplyRaw),
    "999,999,449.999999"
  );
});

test("caps effective circulating supply at zero when lock data exceeds mint supply", () => {
  const circulation = calculateCirculationMetrics("100", "101");

  assert.equal(circulation.effectiveCirculatingSupplyRaw, "0");
});

test("sums every Token-2022 account owned by the community lock wallet", () => {
  assert.equal(
    sumTokenAccountBalances(["100000000", undefined, "25000000"]),
    "125000000"
  );
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
      version: 2,
      mint: AGENT_K9_MINT_ADDRESS,
      initialSupplyRaw: "1000000000000000",
      currentSupplyRaw: "999999549999999",
      totalBurnedRaw: "450000001",
      communityLockRaw: "100000000",
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
  assert.equal(snapshot.communityLockRaw, "100000000");
  assert.equal(snapshot.effectiveCirculatingSupplyRaw, "999999449999999");
  assert.equal(snapshot.nextRefreshAt, "2026-07-11T12:00:00.000Z");
});

test("accepts only complete public snapshots shared between browser tabs", () => {
  const snapshot = toBurnTrackerPublicSnapshot(
    {
      version: 2,
      mint: AGENT_K9_MINT_ADDRESS,
      initialSupplyRaw: "1000000000000000",
      currentSupplyRaw: "999999549999999",
      totalBurnedRaw: "450000001",
      communityLockRaw: "100000000",
      latestBurn: null,
      lastObservedMintSignature: "observedSignature",
      pendingBurnCursor: null,
      pendingBurnUntil: null,
      verificationPending: false,
      refreshedAt: "2026-07-11T10:00:00.000Z",
      refreshLeaseId: null,
      refreshLeaseUntil: null,
    },
    false
  );

  assert.deepEqual(
    parseStoredBurnTrackerSnapshot(JSON.stringify({ snapshot, publishedAt: 1 })),
    snapshot
  );
  assert.equal(
    parseStoredBurnTrackerSnapshot(JSON.stringify({ snapshot: { mint: "incomplete" } })),
    null
  );
  assert.equal(parseStoredBurnTrackerSnapshot("not-json"), null);
});

test("detects a finalized Token-2022 Burn for the K9 mint", () => {
  const amount = extractBurnAmountRaw({
    meta: { err: null },
    transaction: {
      message: {
        instructions: [
          {
            parsed: {
              type: "burn",
              info: { mint: AGENT_K9_MINT_ADDRESS, amount: "5000000" },
            },
          },
        ],
      },
    },
  });

  assert.equal(amount, "5000000");
});

test("detects a K9 BurnChecked nested inside a transaction", () => {
  const amount = extractBurnAmountRaw({
    meta: {
      err: null,
      innerInstructions: [
        {
          instructions: [
            {
              parsed: {
                type: "burnChecked",
                info: { mint: AGENT_K9_MINT_ADDRESS, amount: "1234567" },
              },
            },
          ],
        },
      ],
    },
  });

  assert.equal(amount, "1234567");
});

test("detects the Token-2022 parsed burn amount shape returned by Solana RPC", () => {
  const amount = extractBurnAmountRaw({
    meta: { err: null },
    transaction: {
      message: {
        instructions: [
          {
            parsed: {
              type: "burnChecked",
              info: {
                mint: AGENT_K9_MINT_ADDRESS,
                tokenAmount: { amount: "1000000000", decimals: 6 },
              },
            },
          },
        ],
      },
    },
  });

  assert.equal(amount, "1000000000");
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
              info: { mint: AGENT_K9_MINT_ADDRESS, amount: "1000000" },
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
                info: { mint: AGENT_K9_MINT_ADDRESS, amount: "1000000" },
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
