import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSolanaRpcUrls,
  SolanaRpcError,
  solanaRpc,
  solanaRpcBatch,
} from "@/lib/levi/rpc";

describe("Solana RPC fallback", () => {
  it("keeps both free public RPC endpoints available", () => {
    const urls = getSolanaRpcUrls();
    assert.equal(urls.includes("https://solana-rpc.publicnode.com"), true);
    assert.equal(urls.includes("https://api.mainnet-beta.solana.com"), true);
    assert.equal(new Set(urls).size, urls.length);
  });

  it("uses the next endpoint when the first public RPC fails", async () => {
    const originalFetch = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      if (calls === 1) return new Response("", { status: 500 });
      return new Response(
        JSON.stringify({ jsonrpc: "2.0", id: 1, result: { value: 42 } }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    };

    try {
      const result = await solanaRpc<{ value: number }>("getBalance", ["wallet"]);
      assert.deepEqual(result, { value: 42 });
      assert.equal(calls, 2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("restores JSON-RPC batch results to request order", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify([
          { jsonrpc: "2.0", id: 2, result: "second" },
          { jsonrpc: "2.0", id: 1, result: "first" },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );

    try {
      const result = await solanaRpcBatch<string>(
        [
          { method: "getBalance", params: ["first"] },
          { method: "getBalance", params: ["second"] },
        ],
        { maxAttempts: 1, maxEndpoints: 1 }
      );
      assert.deepEqual(result, ["first", "second"]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("preserves provider Retry-After timing for paced scanner retries", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response("", {
        status: 429,
        headers: { "Retry-After": "7" },
      });

    try {
      await assert.rejects(
        () =>
          solanaRpc("getBalance", ["wallet"], {
            maxAttempts: 1,
            maxEndpoints: 1,
          }),
        (error: unknown) => {
          assert.equal(error instanceof SolanaRpcError, true);
          assert.equal((error as SolanaRpcError).retryAfterMs, 7_000);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("does not hide a retryable cooldown behind a fallback batch 400", async () => {
    const originalFetch = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => {
      calls += 1;
      return calls === 1
        ? new Response("", {
            status: 429,
            headers: { "Retry-After": "6" },
          })
        : new Response("", { status: 400 });
    };

    try {
      await assert.rejects(
        () =>
          solanaRpcBatch(
            [{ method: "getTransaction", params: ["signature"] }],
            { maxAttempts: 1, maxEndpoints: 2 }
          ),
        (error: unknown) => {
          assert.equal(error instanceof SolanaRpcError, true);
          assert.equal((error as SolanaRpcError).status, 429);
          assert.equal((error as SolanaRpcError).retryAfterMs, 6_000);
          return true;
        }
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
