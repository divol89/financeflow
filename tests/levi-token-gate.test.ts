import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  TOKEN_2022_PROGRAM_ID,
} from "@/lib/levi/constants";
import { LEVI_AI_MINT_ADDRESS } from "@/lib/levi/communityBurn";
import {
  clearLeviAccessCacheForTests,
  getLeviAccessForWallet,
} from "@/lib/levi/tokenGate";

const originalFetch = globalThis.fetch;

interface RpcRequestBody {
  method?: string;
  params?: unknown[];
}

describe("LEVI token gate RPC", () => {
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

  it("queries the LEVI AI mint directly and computes access", async () => {
    const requestBody: { current?: RpcRequestBody } = {};

    globalThis.fetch = (async (_input, init) => {
      requestBody.current = JSON.parse(String(init?.body));

      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: {
            value: [
              {
                account: {
                  data: {
                    parsed: {
                      info: {
                        mint: LEVI_AI_MINT_ADDRESS,
                        tokenAmount: {
                          amount: "3000000000",
                          decimals: 6,
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }) as typeof fetch;

    const access = await getLeviAccessForWallet(
      "So11111111111111111111111111111111111111112"
    );

    assert.equal(requestBody.current?.method, "getTokenAccountsByOwner");
    assert.deepEqual(requestBody.current?.params?.[1], { mint: LEVI_AI_MINT_ADDRESS });
    assert.equal(access.balanceRaw, "3000000000");
    assert.equal(access.balance, 3000);
    assert.equal(access.tier, "basic");
  });

  it("reuses one short-lived access check across scanner pages", async () => {
    let calls = 0;
    globalThis.fetch = (async () => {
      calls += 1;
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: { value: [] },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const wallet = "So11111111111111111111111111111111111111112";
    await getLeviAccessForWallet(wallet);
    await getLeviAccessForWallet(wallet);

    assert.equal(calls, 1);
  });
});
