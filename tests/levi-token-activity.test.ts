import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractTokenActivitySignals,
  summarizeTokenActivitySignals,
  type ParsedSolanaTransaction,
} from "@/lib/levi/scanner/analyzers";

const wallet = "Creator111111111111111111111111111111111111";
const mint = "TokenMint11111111111111111111111111111111111";

function buildTransaction(
  signature: string,
  tokenBefore: string,
  tokenAfter: string,
  solBefore: number,
  solAfter: number
): ParsedSolanaTransaction {
  return {
    slot: 431_000_000,
    blockTime: 1_781_000_000,
    meta: {
      preBalances: [solBefore],
      postBalances: [solAfter],
      preTokenBalances: [
        {
          accountIndex: 0,
          mint,
          owner: wallet,
          uiTokenAmount: {
            amount: tokenBefore,
            decimals: 6,
          },
        },
      ],
      postTokenBalances: [
        {
          accountIndex: 0,
          mint,
          owner: wallet,
          uiTokenAmount: {
            amount: tokenAfter,
            decimals: 6,
          },
        },
      ],
    },
    transaction: {
      signatures: [signature],
      message: {
        accountKeys: [{ pubkey: wallet, signer: true }],
      },
    },
  };
}

describe("specific token activity extraction", () => {
  it("ranks wallet token movements by absolute quantity", () => {
    const signals = extractTokenActivitySignals(wallet, mint, [
      buildTransaction("small-in", "0", "100000000", 5_000_000_000, 4_900_000_000),
      buildTransaction("large-out", "500000000", "0", 1_000_000_000, 2_500_000_000),
    ]);

    assert.equal(signals.length, 2);
    assert.equal(signals[0].signature, "large-out");
    assert.equal(signals[0].direction, "out");
    assert.equal(signals[0].tokenAmountAbs, 500);
    assert.equal(signals[0].solDelta, 1.5);
    assert.equal(signals[1].direction, "in");
    assert.equal(signals[1].tokenAmountAbs, 100);

    const summary = summarizeTokenActivitySignals(signals);
    assert.equal(summary.movementCount, 2);
    assert.equal(summary.largestOut, 500);
    assert.equal(summary.largestIn, 100);
    assert.equal(summary.netTokenDelta, -400);
  });

  it("detects token-account owner movements even when wallet is not an account key", () => {
    const tx = buildTransaction(
      "owner-only-in",
      "0",
      "75000000",
      0,
      0
    );
    tx.transaction = {
      signatures: ["owner-only-in"],
      message: {
        accountKeys: [{ pubkey: "DifferentSigner111111111111111111111111111", signer: true }],
      },
    };

    const [signal] = extractTokenActivitySignals(wallet, mint, [tx]);

    assert.equal(signal.direction, "in");
    assert.equal(signal.tokenAmountAbs, 75);
    assert.equal(signal.solDelta, 0);
  });
});
