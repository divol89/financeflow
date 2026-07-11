import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LeviScanReport } from "@/types/levi";
import {
  createScannerCursor,
  InvalidScannerCursorError,
  parseScannerCursor,
} from "@/lib/levi/scanner/cursor";
import { mergeScanReports } from "@/lib/levi/scanner/mergeReports";
import {
  allocateScannerSourceLimits,
  scannerBatchSizeForPage,
  scannerInitialPageCount,
  scannerInitialWindowComplete,
} from "@/lib/levi/scanner/pagination";
import { scannerRetryDelay } from "@/lib/levi/scanner/retry";

const wallet = "ARu4n5mFdZogZAravu7CcizaojWnS6oqka37gdLT5SZn";
const mint = "AQPhtB5DSqFbhtnN5wSjNdkHmBE15qFX76EfXRnspump";
const tokenAccount = "BYCgQQpJT1odaunfvk6gtm5hVd7Xu93vYwbumFfqgHb3";

function report(input: {
  pageIndex: number;
  selected: number;
  loaded: number;
  nextCursor?: string | null;
}): LeviScanReport {
  return {
    version: 2,
    mode: "token",
    wallet,
    targetMint: mint,
    generatedAt: new Date().toISOString(),
    source: "solana-mainnet",
    inspectedSignatures: input.selected,
    inspectedTransactions: input.loaded,
    createdTokenCount: 0,
    createdTokens: [],
    scanCoverage: {
      source: "token-accounts",
      walletSignatures: 0,
      tokenAccountSignatures: input.selected,
      tokenAccounts: 1,
      selectedSignatures: input.selected,
      loadedTransactions: input.loaded,
      skippedTransactions: input.selected - input.loaded,
      rateLimited: false,
      loadedRatio: input.selected > 0 ? input.loaded / input.selected : 0,
      pageIndex: input.pageIndex,
      batchSize: 6,
      tierWindowLimit: 20,
      loadedPageIndexes: [input.pageIndex],
      initialWindowComplete: input.pageIndex >= 3,
      nextCursor: input.nextCursor || null,
    },
    sellSignalCount: 0,
    sellSignals: [],
    quickSellSignalCount: 0,
    score: 0,
    tier: "low",
    summary: "test",
    limitations: [],
  };
}

describe("Scanner cursor and tier pagination", () => {
  it("signs a continuation cursor and binds it to one wallet and mint", () => {
    const cursor = createScannerCursor({
      wallet,
      targetMint: mint,
      mode: "token",
      pageIndex: 1,
      sources: [{ address: tokenAccount, before: "signature" }],
    });
    const parsed = parseScannerCursor(cursor, {
      wallet,
      targetMint: mint,
      mode: "token",
    });

    assert.equal(parsed.pageIndex, 1);
    assert.equal(parsed.sources[0]?.before, "signature");
    assert.throws(
      () =>
        parseScannerCursor(cursor, {
          wallet: tokenAccount,
          targetMint: mint,
          mode: "token",
        }),
      InvalidScannerCursorError
    );
  });

  it("rejects a cursor modified by the client", () => {
    const cursor = createScannerCursor({
      wallet,
      targetMint: mint,
      mode: "token",
      pageIndex: 1,
      sources: [{ address: tokenAccount }],
    });
    const tampered = `${cursor.slice(0, -1)}${cursor.endsWith("a") ? "b" : "a"}`;
    assert.throws(
      () =>
        parseScannerCursor(tampered, {
          wallet,
          targetMint: mint,
          mode: "token",
        }),
      InvalidScannerCursorError
    );
  });

  it("splits Basic and Full windows into bounded pages", () => {
    assert.equal(scannerInitialPageCount("basic"), 4);
    assert.deepEqual(
      [0, 1, 2, 3, 4].map((pageIndex) =>
        scannerBatchSizeForPage("basic", pageIndex)
      ),
      [6, 6, 6, 2, 0]
    );
    assert.equal(scannerInitialPageCount("full"), 17);
    assert.equal(scannerBatchSizeForPage("full", 16), 4);
    assert.equal(scannerBatchSizeForPage("full", 17), 6);
  });

  it("rotates a bounded transaction budget across token accounts", () => {
    assert.deepEqual(
      allocateScannerSourceLimits({
        sourceCount: 3,
        transactionLimit: 6,
        pageIndex: 0,
      }),
      [2, 2, 2]
    );
    assert.deepEqual(
      allocateScannerSourceLimits({
        sourceCount: 3,
        transactionLimit: 2,
        pageIndex: 1,
      }),
      [0, 1, 1]
    );
    assert.equal(
      scannerInitialWindowComplete({
        tier: "basic",
        pageIndex: 3,
        hasMoreSources: true,
      }),
      true
    );
  });

  it("backs off transient scanner pages without retrying auth failures forever", () => {
    assert.equal(scannerRetryDelay({ status: 503, attempt: 0 }), 2_000);
    assert.equal(
      scannerRetryDelay({ status: 429, attempt: 1, retryAfterMs: 4_000 }),
      4_000
    );
    assert.equal(scannerRetryDelay({ status: 503, attempt: 4 }), 20_000);
    assert.equal(scannerRetryDelay({ status: 503, attempt: 5 }), null);
    assert.equal(scannerRetryDelay({ status: 401, attempt: 0 }), null);
  });
});

describe("Scanner report aggregation", () => {
  it("adds distinct pages and keeps the latest continuation", () => {
    const merged = mergeScanReports(
      report({ pageIndex: 0, selected: 6, loaded: 6, nextCursor: "page-1" }),
      report({ pageIndex: 1, selected: 6, loaded: 5, nextCursor: "page-2" })
    );

    assert.equal(merged.scanCoverage.selectedSignatures, 12);
    assert.equal(merged.scanCoverage.loadedTransactions, 11);
    assert.deepEqual(merged.scanCoverage.loadedPageIndexes, [0, 1]);
    assert.equal(merged.scanCoverage.nextCursor, "page-2");
  });

  it("does not double count a retried page", () => {
    const first = report({ pageIndex: 0, selected: 6, loaded: 4 });
    const retry = report({ pageIndex: 0, selected: 6, loaded: 6 });
    const merged = mergeScanReports(first, retry);

    assert.equal(merged.scanCoverage.selectedSignatures, 6);
    assert.equal(merged.scanCoverage.loadedTransactions, 6);
    assert.deepEqual(merged.scanCoverage.loadedPageIndexes, [0]);
  });
});
