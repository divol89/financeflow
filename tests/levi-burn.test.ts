import assert from "node:assert/strict";
import test from "node:test";
import { Keypair } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { createLeviBurnTransaction } from "../lib/levi/burn/client";
import {
  formatLeviBurnAmount,
  LeviBurnValidationError,
  parseLeviBurnAmount,
} from "../lib/levi/burn/validation";
import { LEVI_AI_MINT_ADDRESS } from "../lib/levi/communityBurn";

test("parses LEVI AI burn input without floating point rounding", () => {
  assert.equal(parseLeviBurnAmount("100", 6), BigInt(100_000_000));
  assert.equal(parseLeviBurnAmount("0.000001", 6), BigInt(1));
  assert.equal(formatLeviBurnAmount("100000001", 6), "100.000001");
});

test("rejects zero, negative, malformed and over-precise burn amounts", () => {
  for (const input of ["0", "-1", "1e2", "1.0000001", " "]) {
    assert.throws(
      () => parseLeviBurnAmount(input, 6),
      LeviBurnValidationError,
      `expected ${input || "empty"} to be rejected`
    );
  }
});

test("creates Token-2022 BurnChecked instructions that allocate exact amounts", () => {
  const owner = Keypair.generate().publicKey;
  const firstAccount = Keypair.generate().publicKey;
  const secondAccount = Keypair.generate().publicKey;
  const transaction = createLeviBurnTransaction({
    wallet: owner.toBase58(),
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
  assert.equal(firstInstruction.programId.toBase58(), TOKEN_2022_PROGRAM_ID.toBase58());
  assert.equal(secondInstruction.programId.toBase58(), TOKEN_2022_PROGRAM_ID.toBase58());
  assert.equal(firstInstruction.keys[0].pubkey.toBase58(), firstAccount.toBase58());
  assert.equal(secondInstruction.keys[0].pubkey.toBase58(), secondAccount.toBase58());
  assert.equal(firstInstruction.keys[1].pubkey.toBase58(), LEVI_AI_MINT_ADDRESS);
  assert.equal(firstInstruction.keys[2].pubkey.toBase58(), owner.toBase58());
  assert.equal(firstInstruction.data[0], 15);
  assert.equal(secondInstruction.data[0], 15);
  assert.equal(firstInstruction.data.readBigUInt64LE(1), BigInt(750_000));
  assert.equal(secondInstruction.data.readBigUInt64LE(1), BigInt(250_000));
  assert.equal(firstInstruction.data[9], 6);
});

test("refuses a BurnChecked transaction when quoted token accounts cannot cover the amount", () => {
  const owner = Keypair.generate().publicKey;
  const tokenAccount = Keypair.generate().publicKey;

  assert.throws(
    () =>
      createLeviBurnTransaction({
        wallet: owner.toBase58(),
        tokenAccounts: [{ address: tokenAccount.toBase58(), amountRaw: "1" }],
        amountRaw: BigInt(2),
        blockhash: "11111111111111111111111111111111",
      }),
    /exceeds your LEVI AI balance/
  );
});
