import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSolanaRpcUrls, solanaRpc } from "@/lib/levi/rpc";

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
});
