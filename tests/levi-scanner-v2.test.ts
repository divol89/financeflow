import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ScannerTokenSnapshot } from "@/types/levi";
import type { ParsedSolanaTransaction } from "@/lib/levi/scanner/analyzers";
import {
  classifyActivityEvidence,
  classifyTokenTransaction,
  summarizeClassifiedActivity,
} from "@/lib/levi/scanner/classification";
import { rawAmountValue } from "@/lib/levi/scanner/amounts";
import { calculateDistributionPressure } from "@/lib/levi/scanner/pressure";

const wallet = "Creator111111111111111111111111111111111111";
const mint = "TokenMint11111111111111111111111111111111111";
const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const pumpProgram = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

function transaction(input: {
  signature: string;
  tokenBefore: string;
  tokenAfter: string;
  quoteBefore?: string;
  quoteAfter?: string;
  programId?: string;
  instructionType?: string;
}): ParsedSolanaTransaction {
  const preTokenBalances = [
    {
      accountIndex: 1,
      mint,
      owner: wallet,
      uiTokenAmount: { amount: input.tokenBefore, decimals: 6 },
    },
  ];
  const postTokenBalances = [
    {
      accountIndex: 1,
      mint,
      owner: wallet,
      uiTokenAmount: { amount: input.tokenAfter, decimals: 6 },
    },
  ];

  if (input.quoteBefore !== undefined && input.quoteAfter !== undefined) {
    preTokenBalances.push({
      accountIndex: 2,
      mint: usdc,
      owner: wallet,
      uiTokenAmount: { amount: input.quoteBefore, decimals: 6 },
    });
    postTokenBalances.push({
      accountIndex: 2,
      mint: usdc,
      owner: wallet,
      uiTokenAmount: { amount: input.quoteAfter, decimals: 6 },
    });
  }

  return {
    slot: 432_000_000,
    blockTime: Math.floor(Date.now() / 1000),
    meta: {
      err: null,
      fee: 5_000,
      preBalances: [2_000_000_000],
      postBalances: [1_999_995_000],
      preTokenBalances,
      postTokenBalances,
    },
    transaction: {
      signatures: [input.signature],
      message: {
        accountKeys: [{ pubkey: wallet, signer: true }],
        instructions: [
          {
            programId: input.programId,
            parsed: input.instructionType
              ? { type: input.instructionType, info: { mint } }
              : undefined,
          },
        ],
      },
    },
  };
}

describe("Scanner V2 classification", () => {
  it("counts a token-out and quote-in swap as a high-confidence sell", () => {
    const event = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "sell",
        tokenBefore: "1000000000",
        tokenAfter: "500000000",
        quoteBefore: "1000000",
        quoteAfter: "51000000",
        programId: pumpProgram,
      })
    );

    assert.equal(event?.classification, "sell");
    assert.equal(event?.confidence, "high");
    assert.equal(event?.targetAmount.raw, "500000000");
    assert.equal(event?.quoteAsset?.symbol, "USDC");
    assert.equal(event?.quoteAsset?.delta.raw, "50000000");
  });

  it("does not relabel a plain outgoing transfer as a sale", () => {
    const event = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "transfer",
        tokenBefore: "1000000000",
        tokenAfter: "750000000",
        instructionType: "transferChecked",
      })
    );

    assert.equal(event?.classification, "transfer_out");
    assert.equal(event?.confidence, "high");
  });

  it("separates liquidity movement from a sell", () => {
    const event = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "liquidity",
        tokenBefore: "1000000000",
        tokenAfter: "500000000",
        quoteBefore: "100000000",
        quoteAfter: "50000000",
        programId: pumpProgram,
      })
    );

    assert.equal(event?.classification, "liquidity");
  });

  it("prioritizes a parsed burn instruction", () => {
    const event = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "burn",
        tokenBefore: "1000000000",
        tokenAfter: "900000000",
        instructionType: "burnChecked",
      })
    );

    assert.equal(event?.classification, "burn");
    assert.equal(event?.ruleId, "token-burn-instruction");
  });

  it("shares the same evidence classifier with the methodology simulator", () => {
    const result = classifyActivityEvidence({
      targetDeltaRaw: BigInt(-100),
      quoteDeltaRaw: BigInt(20),
      nativeSolDeltaLamports: BigInt(0),
      venue: "PumpSwap",
      hasTransferInstruction: true,
      hasBurnInstruction: false,
      hasMintInstruction: false,
    });

    assert.equal(result.classification, "sell");
    assert.equal(result.ruleId, "known-swap-token-out-quote-in");
  });
});

describe("Scanner V2 pressure", () => {
  const snapshot: ScannerTokenSnapshot = {
    mint,
    name: "Test token",
    symbol: "TEST",
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    walletBalance: rawAmountValue(BigInt(500_000_000), 6),
    currentSupply: rawAmountValue(BigInt(10_000_000_000), 6),
    walletSharePercent: 5,
    walletSolLamports: "2000000000",
    walletSol: "2",
    tokenAccountCount: 1,
    mintAuthority: null,
    freezeAuthority: null,
    authoritiesRevoked: true,
    complete: true,
  };

  it("returns insufficient data when coverage is too small", () => {
    const result = calculateDistributionPressure({
      snapshot,
      events: [],
      quickSellSignalCount: 0,
      coverage: {
        source: "wallet-and-token-accounts",
        walletSignatures: 2,
        tokenAccountSignatures: 0,
        tokenAccounts: 1,
        selectedSignatures: 10,
        loadedTransactions: 2,
        skippedTransactions: 0,
        rateLimited: true,
        loadedRatio: 0.2,
      },
    });

    assert.equal(result.level, "insufficient");
    assert.equal(result.score, null);
  });

  it("summarizes classified amounts without floating point arithmetic", () => {
    const sell = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "summary-sell",
        tokenBefore: "1000000000",
        tokenAfter: "500000000",
        quoteBefore: "0",
        quoteAfter: "50000000",
        programId: pumpProgram,
      })
    );
    const summary = summarizeClassifiedActivity(sell ? [sell] : [], 6);

    assert.equal(summary.totalSold.raw, "500000000");
    assert.equal(summary.totalSold.formatted, "500");
    assert.equal(summary.observedSellCount, 1);
  });

  it("produces transparent pressure factors when coverage is sufficient", () => {
    const sell = classifyTokenTransaction(
      wallet,
      mint,
      transaction({
        signature: "pressure-sell",
        tokenBefore: "1000000000",
        tokenAfter: "500000000",
        quoteBefore: "0",
        quoteAfter: "50000000",
        programId: pumpProgram,
      })
    );
    const result = calculateDistributionPressure({
      snapshot,
      events: sell ? [sell] : [],
      quickSellSignalCount: 0,
      coverage: {
        source: "wallet-and-token-accounts",
        walletSignatures: 10,
        tokenAccountSignatures: 0,
        tokenAccounts: 1,
        selectedSignatures: 10,
        loadedTransactions: 10,
        skippedTransactions: 0,
        rateLimited: false,
        loadedRatio: 1,
      },
    });

    assert.equal(result.level, "elevated");
    assert.equal(result.factors.concentration, 10);
    assert.equal(result.factors.observedSelling, 35);
    assert.equal(result.score, 45);
  });
});
