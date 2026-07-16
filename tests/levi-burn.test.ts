import assert from "node:assert/strict";
import test from "node:test";
import { Keypair, type Transaction } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  parseAndValidatePreparedBurn,
  submitPreparedBurn,
} from "../lib/levi/burn/client";
import { createBurnTransaction } from "../lib/levi/burn/transactionFactory";
import { prepareBurnTransaction } from "../lib/levi/burn/prepare";
import {
  refreshBurnTrackerAfterBurn,
  synchronizeBurnTrackerAfterBurn,
  waitForLeviBurnFinalization,
} from "../lib/levi/burn/gateway";
import {
  classifyLeviBurnTransactionStatus,
  getLeviBurnSigningContext,
} from "../lib/levi/burn/transaction";
import {
  BurnValidationError,
  formatBurnAmount,
  parseBurnAmount,
} from "../lib/levi/burn/validation";
import { AGENT_K9_MINT_ADDRESS } from "../lib/levi/communityBurn";
import {
  parseMetaplexBurnMetadata,
  parseToken2022BurnMetadataExtension,
  sanitizeBurnMetadataText,
} from "../lib/levi/burn/metadata";
import { getBurnTokenDisplayName } from "../lib/levi/burn/presentation";
import type { BurnPreparation, BurnTokenOption } from "../types/leviBurn";

const originalFetch = globalThis.fetch;

function encodeMetadataString(value: string): Buffer {
  const encoded = Buffer.from(value, "utf8");
  const length = Buffer.alloc(4);
  length.writeUInt32LE(encoded.length);
  return Buffer.concat([length, encoded]);
}

test("parses arbitrary token burn input without floating point rounding", () => {
  assert.equal(parseBurnAmount("100", 6, "TOKEN"), BigInt(100_000_000));
  assert.equal(parseBurnAmount("0.000000001", 9, "TOKEN"), BigInt(1));
  assert.equal(formatBurnAmount("100000001", 6), "100.000001");
});

test("rejects zero, negative, malformed and over-precise burn amounts", () => {
  for (const input of ["0", "-1", "1e2", "1.0000001", " "]) {
    assert.throws(
      () => parseBurnAmount(input, 6, "TOKEN"),
      BurnValidationError,
      `expected ${input || "empty"} to be rejected`
    );
  }
});

test("parses and sanitizes Metaplex token names and symbols", () => {
  const mint = Keypair.generate().publicKey;
  const accountData = Buffer.concat([
    Buffer.from([4]),
    Buffer.alloc(32),
    mint.toBuffer(),
    encodeMetadataString("  USD Coin  "),
    encodeMetadataString("USDC"),
  ]);

  assert.deepEqual(parseMetaplexBurnMetadata(accountData, mint), {
    name: "USD Coin",
    symbol: "USDC",
  });
  assert.equal(
    parseMetaplexBurnMetadata(accountData, Keypair.generate().publicKey),
    null
  );
});

test("parses Token-2022 inline metadata and bounds untrusted labels", () => {
  const mint = Keypair.generate().publicKey;
  const extensionData = Buffer.concat([
    Buffer.alloc(32),
    mint.toBuffer(),
    encodeMetadataString(`Cashia\u202E cat ${"x".repeat(80)}`),
    encodeMetadataString("cashiacat"),
  ]);
  const metadata = parseToken2022BurnMetadataExtension(extensionData, mint);

  assert.ok(metadata?.name);
  assert.equal(metadata.symbol, "cashiacat");
  assert.equal(metadata.name.includes("\u202E"), false);
  assert.equal(Array.from(metadata.name).length, 48);
  assert.equal(metadata.name.endsWith("..."), true);
  assert.equal(sanitizeBurnMetadataText("\u0000   ", 16), null);
});

test("presents the on-chain token name and symbol together", () => {
  const token: BurnTokenOption = {
    mint: Keypair.generate().publicKey.toBase58(),
    name: "Cashia cat",
    symbol: "cashiacat",
    program: "token-2022",
    programId: TOKEN_2022_PROGRAM_ID.toBase58(),
    decimals: 6,
    availableRaw: "1000000",
    accountCount: 1,
    isLeviAi: false,
    burnable: true,
    blockedReason: null,
    warning: null,
  };

  assert.equal(getBurnTokenDisplayName(token), "Cashia cat (cashiacat)");
  assert.equal(
    getBurnTokenDisplayName({ ...token, name: "USDC", symbol: "usdc" }),
    "USDC"
  );
});

test("creates SPL and Token-2022 BurnChecked instructions with exact allocations", () => {
  const owner = Keypair.generate().publicKey;
  const mint = Keypair.generate().publicKey;
  const firstAccount = Keypair.generate().publicKey;
  const secondAccount = Keypair.generate().publicKey;

  for (const programId of [TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID]) {
    const transaction = createBurnTransaction({
      wallet: owner.toBase58(),
      mint: mint.toBase58(),
      programId: programId.toBase58(),
      decimals: 6,
      tokenAccounts: [
        { address: firstAccount.toBase58(), amountRaw: "750000" },
        { address: secondAccount.toBase58(), amountRaw: "500000" },
      ],
      amountRaw: BigInt(1_000_000),
      blockhash: "11111111111111111111111111111111",
    });

    assert.equal(transaction.feePayer?.toBase58(), owner.toBase58());
    assert.equal(transaction.instructions.length, 2);
    const [firstInstruction, secondInstruction] = transaction.instructions;
    assert.equal(firstInstruction.programId.toBase58(), programId.toBase58());
    assert.equal(secondInstruction.programId.toBase58(), programId.toBase58());
    assert.equal(firstInstruction.keys[0].pubkey.toBase58(), firstAccount.toBase58());
    assert.equal(secondInstruction.keys[0].pubkey.toBase58(), secondAccount.toBase58());
    assert.equal(firstInstruction.keys[1].pubkey.toBase58(), mint.toBase58());
    assert.equal(firstInstruction.keys[2].pubkey.toBase58(), owner.toBase58());
    assert.equal(firstInstruction.data[0], 15);
    assert.equal(secondInstruction.data[0], 15);
    assert.equal(firstInstruction.data.readBigUInt64LE(1), BigInt(750_000));
    assert.equal(secondInstruction.data.readBigUInt64LE(1), BigInt(250_000));
    assert.equal(firstInstruction.data[9], 6);
  }
});

test("refuses a BurnChecked transaction when quoted token accounts cannot cover the amount", () => {
  const owner = Keypair.generate().publicKey;
  const tokenAccount = Keypair.generate().publicKey;

  assert.throws(
    () =>
      createBurnTransaction({
        wallet: owner.toBase58(),
        mint: Keypair.generate().publicKey.toBase58(),
        programId: TOKEN_PROGRAM_ID.toBase58(),
        decimals: 6,
        tokenAccounts: [{ address: tokenAccount.toBase58(), amountRaw: "1" }],
        amountRaw: BigInt(2),
        blockhash: "11111111111111111111111111111111",
      }),
    /exceeds the selected token balance/
  );
});

test("validates the prepared transaction before delegating submission to the wallet", async () => {
  const owner = Keypair.generate().publicKey;
  const mint = Keypair.generate().publicKey;
  const tokenAccount = Keypair.generate().publicKey;
  let capturedBlockhash = "";
  let capturedInstructionCount = 0;
  const transaction = createBurnTransaction({
    wallet: owner.toBase58(),
    mint: mint.toBase58(),
    programId: TOKEN_PROGRAM_ID.toBase58(),
    decimals: 6,
    tokenAccounts: [{ address: tokenAccount.toBase58(), amountRaw: "1000000000" }],
    amountRaw: BigInt(1_000_000_000),
    blockhash: "11111111111111111111111111111111",
  });
  const preparation: BurnPreparation = {
    wallet: owner.toBase58(),
    mint: mint.toBase58(),
    programId: TOKEN_PROGRAM_ID.toBase58(),
    decimals: 6,
    symbol: "TEST",
    amountRaw: "1000000000",
    isLeviAi: false,
    transactionBase64: transaction
      .serialize({ requireAllSignatures: false, verifySignatures: false })
      .toString("base64"),
  };

  assert.equal(parseAndValidatePreparedBurn(preparation).instructions.length, 1);
  const submission = await submitPreparedBurn({
    provider: {
      connect: async () => ({ publicKey: owner }),
      signMessage: async () => new Uint8Array(),
      signAndSendTransaction: async (prepared: Transaction) => {
        capturedBlockhash = prepared.recentBlockhash || "";
        capturedInstructionCount = prepared.instructions.length;
        return { signature: "walletSubmittedSignature" };
      },
    },
    preparation,
  });

  assert.equal(submission.signature, "walletSubmittedSignature");
  assert.equal(submission.state, "submitted");
  assert.equal(capturedBlockhash, "11111111111111111111111111111111");
  assert.equal(capturedInstructionCount, 1);
});

test("enforces a signed 1,000,000 K9 gate only for external token burns", async () => {
  const owner = Keypair.generate().publicKey.toBase58();
  const externalMint = Keypair.generate().publicKey.toBase58();
  const externalAccount = Keypair.generate().publicKey.toBase58();
  const leviAccount = Keypair.generate().publicKey.toBase58();
  let leviBalanceRaw = "1000000000000";

  globalThis.fetch = (async (_input, init) => {
    const request = JSON.parse(String(init?.body)) as {
      method: string;
      params: Array<Record<string, string>>;
    };
    let result: unknown;

    if (request.method === "getTokenAccountsByOwner") {
      const programId = request.params[1]?.programId;
      result = {
        value:
          programId === TOKEN_PROGRAM_ID.toBase58()
            ? [
                {
                  pubkey: externalAccount,
                  account: {
                    owner: TOKEN_PROGRAM_ID.toBase58(),
                    data: {
                      parsed: {
                        info: {
                          mint: externalMint,
                          state: "initialized",
                          tokenAmount: { amount: "5000000000", decimals: 6 },
                        },
                      },
                    },
                  },
                },
              ]
            : [
                {
                  pubkey: leviAccount,
                  account: {
                    owner: TOKEN_2022_PROGRAM_ID.toBase58(),
                    data: {
                      parsed: {
                        info: {
                          mint: AGENT_K9_MINT_ADDRESS,
                          state: "initialized",
                          tokenAmount: { amount: leviBalanceRaw, decimals: 6 },
                        },
                      },
                    },
                  },
                },
              ],
      };
    } else if (request.method === "getBalance") {
      result = { value: 10_000_000 };
    } else if (request.method === "getLatestBlockhash") {
      result = { value: { blockhash: "11111111111111111111111111111111" } };
    } else {
      throw new Error(`Unexpected RPC method ${request.method}`);
    }

    return new Response(
      JSON.stringify({ jsonrpc: "2.0", id: 1, result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  try {
    await assert.rejects(
      () =>
        prepareBurnTransaction({
          wallet: owner,
          mint: externalMint,
          amountRaw: "1000000",
          sessionWallet: null,
        }),
      /Sign access/
    );

    leviBalanceRaw = "999999999999";
    await assert.rejects(
      () =>
        prepareBurnTransaction({
          wallet: owner,
          mint: externalMint,
          amountRaw: "1000000",
          sessionWallet: owner,
        }),
      /Hold at least 1,000,000 K9/
    );

    leviBalanceRaw = "1000000000000";
    const externalPreparation = await prepareBurnTransaction({
      wallet: owner,
      mint: externalMint,
      amountRaw: "1000000",
      sessionWallet: owner,
    });
    assert.equal(externalPreparation.programId, TOKEN_PROGRAM_ID.toBase58());
    assert.equal(externalPreparation.isLeviAi, false);
    assert.equal(
      parseAndValidatePreparedBurn(externalPreparation).instructions.length,
      1
    );

    leviBalanceRaw = "100";
    const leviPreparation = await prepareBurnTransaction({
      wallet: owner,
      mint: AGENT_K9_MINT_ADDRESS,
      amountRaw: "1",
      sessionWallet: null,
    });
    assert.equal(leviPreparation.programId, TOKEN_2022_PROGRAM_ID.toBase58());
    assert.equal(leviPreparation.isLeviAi, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("distinguishes confirmed from finalized burn transaction states", () => {
  const signature = "signature";

  assert.deepEqual(classifyLeviBurnTransactionStatus(signature, null), {
    signature,
    state: "pending",
  });
  assert.deepEqual(
    classifyLeviBurnTransactionStatus(signature, {
      err: null,
      confirmationStatus: "confirmed",
    }),
    { signature, state: "confirmed" }
  );
  assert.deepEqual(
    classifyLeviBurnTransactionStatus(signature, {
      err: { InstructionError: [0, "Custom"] },
      confirmationStatus: "confirmed",
    }),
    { signature, state: "failed" }
  );
  assert.deepEqual(
    classifyLeviBurnTransactionStatus(signature, {
      err: null,
      confirmationStatus: "finalized",
    }),
    { signature, state: "finalized" }
  );
});

test("waits for finalization before forcing one tracker refresh", async () => {
  const signature = "2".repeat(64);
  let statusReads = 0;
  let trackerPosts = 0;
  const snapshot = {
    mint: AGENT_K9_MINT_ADDRESS,
    symbol: "K9",
    decimals: 6,
    initialSupplyRaw: "1000000000000000",
    currentSupplyRaw: "999996549999999",
    totalBurnedRaw: "3450000001",
    percentageBurned: "0.000345",
    communityLockRaw: "100000000",
    effectiveCirculatingSupplyRaw: "999996449999999",
    latestBurn: {
      signature,
      occurredAt: "2026-07-11T12:00:00.000Z",
      amountRaw: "1000000000",
      solscanUrl: `https://solscan.io/tx/${signature}`,
    },
    communityLockWallet: "1nc1nerator11111111111111111111111111111111",
    communityLockUrl: "https://solscan.io/account/1nc1nerator11111111111111111111111111111111",
    refreshedAt: "2026-07-11T12:00:01.000Z",
    nextRefreshAt: "2026-07-11T14:00:01.000Z",
    stale: false,
    verificationPending: false,
  };

  globalThis.fetch = (async (input, init) => {
    const url = String(input);
    if (url.startsWith("/api/burn/transaction")) {
      statusReads += 1;
      return new Response(
        JSON.stringify({
          signature,
          state: statusReads === 1 ? "confirmed" : "finalized",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    assert.equal(url, "/api/burn-tracker");
    assert.equal(init?.method, "POST");
    trackerPosts += 1;
    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;

  try {
    const result = await synchronizeBurnTrackerAfterBurn(signature, {
      initialState: "confirmed",
      finalizationAttempts: 2,
      delayMs: 0,
      refreshAttempts: 1,
    });

    assert.equal(statusReads, 2);
    assert.equal(trackerPosts, 1);
    assert.equal(result.state, "finalized");
    assert.deepEqual(result.snapshot, snapshot);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects an invalid tracker payload after a finalized burn", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () => refreshBurnTrackerAfterBurn("3".repeat(64)),
      /Unable to refresh the burn tracker/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("reports the latest non-final state when finalization times out", async () => {
  const signature = "4".repeat(64);
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ signature, state: "confirmed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

  try {
    assert.deepEqual(await waitForLeviBurnFinalization(signature, 2, 0), {
      signature,
      state: "confirmed",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("retrieves a signing blockhash through the server RPC service", async () => {
  const requestBody: { current?: { method?: string; params?: unknown[] } } = {};
  globalThis.fetch = (async (_input, init) => {
    requestBody.current = JSON.parse(String(init?.body));
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        result: { value: { blockhash: "11111111111111111111111111111111" } },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }) as typeof fetch;

  try {
    assert.deepEqual(await getLeviBurnSigningContext(), {
      blockhash: "11111111111111111111111111111111",
    });
    assert.equal(requestBody.current?.method, "getLatestBlockhash");
    assert.deepEqual(requestBody.current?.params, [{ commitment: "confirmed" }]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
