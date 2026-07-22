import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  TOKEN_2022_PROGRAM_ID,
} from "@/lib/levi/constants";
import {
  clearLeviAccessCacheForTests,
  getLeviAccessForWallet,
} from "@/lib/levi/tokenGate";

const originalFetch = globalThis.fetch;

describe("open wallet access", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearLeviAccessCacheForTests();
  });

  it("uses the canonical Token-2022 program id", () => {
    assert.equal(
      TOKEN_2022_PROGRAM_ID,
      "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
    );
  });

  it("returns open access without an RPC balance query", async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      throw new Error("Access must not query a token balance");
    }) as typeof fetch;

    const access = await getLeviAccessForWallet(
      "So11111111111111111111111111111111111111112"
    );

    assert.equal(calls, 0);
    assert.equal(access.balanceRaw, "0");
    assert.equal(access.balance, 0);
    assert.equal(access.tier, "full");
    assert.equal(access.limits.fullDashboard, true);
  });

  it("does not add RPC calls across scanner pages", async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      throw new Error("Access must remain RPC-free");
    }) as typeof fetch;

    const wallet = "So11111111111111111111111111111111111111112";
    await getLeviAccessForWallet(wallet);
    await getLeviAccessForWallet(wallet);

    assert.equal(calls, 0);
  });
});
