import assert from "node:assert/strict";
import test from "node:test";
import { Keypair } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { extractPortalBurn } from "../lib/burnLedger/chain";
import { buildNextBurnTokenSummary } from "../lib/burnLedger/store";
import { isBurnLedgerPayload } from "../lib/burnLedger/validation";
import type { BurnLedgerEvent } from "../types/burnLedger";

function burnInstruction(input: {
  mint: string;
  wallet: string;
  amount: string;
  programId?: string;
  type?: string;
}) {
  return {
    programId: input.programId || TOKEN_2022_PROGRAM_ID.toBase58(),
    parsed: {
      type: input.type || "burnChecked",
      info: {
        mint: input.mint,
        authority: input.wallet,
        tokenAmount: { amount: input.amount, decimals: 6 },
      },
    },
  };
}

test("sums direct and inner burns for the same mint and wallet with BigInt precision", () => {
  const wallet = Keypair.generate().publicKey.toBase58();
  const mint = Keypair.generate().publicKey.toBase58();
  const result = extractPortalBurn({
    mint,
    wallet,
    transaction: {
      meta: {
        err: null,
        innerInstructions: [{ instructions: [burnInstruction({ mint, wallet, amount: "9007199254740993" })] }],
      },
      transaction: {
        message: { instructions: [burnInstruction({ mint, wallet, amount: "7" })] },
      },
    },
  });

  assert.deepEqual(result, {
    amountRaw: "9007199254741000",
    program: "token-2022",
    programId: TOKEN_2022_PROGRAM_ID.toBase58(),
  });
});

test("ignores transfers, failed transactions, unrelated mints and other authorities", () => {
  const wallet = Keypair.generate().publicKey.toBase58();
  const mint = Keypair.generate().publicKey.toBase58();
  const other = Keypair.generate().publicKey.toBase58();
  const cases = [
    { meta: { err: { InstructionError: [0, "Custom"] } }, transaction: { message: { instructions: [burnInstruction({ mint, wallet, amount: "1" })] } } },
    { meta: { err: null }, transaction: { message: { instructions: [burnInstruction({ mint, wallet, amount: "1", type: "transferChecked" })] } } },
    { meta: { err: null }, transaction: { message: { instructions: [burnInstruction({ mint: other, wallet, amount: "1" })] } } },
    { meta: { err: null }, transaction: { message: { instructions: [burnInstruction({ mint, wallet: other, amount: "1" })] } } },
  ];

  for (const transaction of cases) {
    assert.equal(extractPortalBurn({ transaction, mint, wallet }), null);
  }
});

test("accepts both supported Solana token programs", () => {
  const wallet = Keypair.generate().publicKey.toBase58();
  const mint = Keypair.generate().publicKey.toBase58();
  const result = extractPortalBurn({
    mint,
    wallet,
    transaction: {
      meta: { err: null },
      transaction: {
        message: {
          instructions: [burnInstruction({ mint, wallet, amount: "11", programId: TOKEN_PROGRAM_ID.toBase58() })],
        },
      },
    },
  });
  assert.equal(result?.program, "spl-token");
});

test("keeps portal burn totals separated per token and exact", () => {
  const mint = Keypair.generate().publicKey.toBase58();
  const event: BurnLedgerEvent = {
    signature: "2".repeat(64),
    mint,
    wallet: Keypair.generate().publicKey.toBase58(),
    name: "Adventure Coin",
    symbol: "ADV",
    program: "token-2022",
    programId: TOKEN_2022_PROGRAM_ID.toBase58(),
    decimals: 6,
    amountRaw: "9007199254740993",
    supplyAfterRaw: "999999999999999999",
    occurredAt: "2026-07-22T12:00:00.000Z",
    solscanUrl: `https://solscan.io/tx/${"2".repeat(64)}`,
    tokenUrl: `https://solscan.io/token/${mint}`,
  };
  const first = buildNextBurnTokenSummary(event, null);
  const second = buildNextBurnTokenSummary({ ...event, amountRaw: "7", signature: "3".repeat(64) }, first);

  assert.equal(second.totalBurnedRaw, "9007199254741000");
  assert.equal(second.burnCount, 2);
  assert.equal(second.mint, mint);
});

test("does not replace the latest burn when an older event is recorded late", () => {
  const mint = Keypair.generate().publicKey.toBase58();
  const event: BurnLedgerEvent = {
    signature: "4".repeat(64),
    mint,
    wallet: Keypair.generate().publicKey.toBase58(),
    name: null,
    symbol: "FLOW",
    program: "spl-token",
    programId: TOKEN_PROGRAM_ID.toBase58(),
    decimals: 6,
    amountRaw: "1000000",
    supplyAfterRaw: "9000000",
    occurredAt: "2026-07-22T14:00:00.000Z",
    solscanUrl: `https://solscan.io/tx/${"4".repeat(64)}`,
    tokenUrl: `https://solscan.io/token/${mint}`,
  };
  const current = buildNextBurnTokenSummary(event, null);
  const older = buildNextBurnTokenSummary(
    {
      ...event,
      signature: "5".repeat(64),
      amountRaw: "500000",
      supplyAfterRaw: "8500000",
      occurredAt: "2026-07-22T13:00:00.000Z",
    },
    current
  );

  assert.equal(older.totalBurnedRaw, "1500000");
  assert.equal(older.lastBurnAt, event.occurredAt);
  assert.equal(older.lastSignature, event.signature);
  assert.equal(older.currentSupplyRaw, "8500000");
});

test("validates the public burn-ledger envelope", () => {
  assert.equal(isBurnLedgerPayload({ version: 1, scope: "flow-finance-portal", events: [], tokens: [], updatedAt: new Date().toISOString() }), true);
  assert.equal(isBurnLedgerPayload({ version: 1, scope: "all-solana", events: [], tokens: [], updatedAt: "now" }), false);
});
