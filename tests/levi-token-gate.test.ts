import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  LEVI_MINT_ADDRESS,
  TOKEN_2022_PROGRAM_ID,
} from "@/lib/levi/constants";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";

const originalFetch = globalThis.fetch;

interface RpcRequestBody {
  method?: string;
  params?: unknown[];
}

describe("LEVI token gate RPC", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("uses the canonical Token-2022 program id", () => {
    assert.equal(
      TOKEN_2022_PROGRAM_ID,
      "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
    );
  });

  it("queries the LEVI mint directly and computes access", async () => {
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
                        mint: LEVI_MINT_ADDRESS,
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
    assert.deepEqual(requestBody.current?.params?.[1], { mint: LEVI_MINT_ADDRESS });
    assert.equal(access.balanceRaw, "3000000000");
    assert.equal(access.balance, 3000);
    assert.equal(access.tier, "basic");
  });
});
