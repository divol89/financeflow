import type { LeviScanReport } from "@/types/levi";

export function buildMockScanReport(wallet: string): LeviScanReport {
  return {
    wallet,
    generatedAt: new Date().toISOString(),
    source: "mock",
    inspectedSignatures: 42,
    inspectedTransactions: 39,
    createdTokenCount: 3,
    createdTokens: [
      {
        mint: "MockMint1111111111111111111111111111111111111",
        signature: "mock-signature-1",
        slot: 431_000_001,
        blockTime: 1_781_000_000,
        instructionType: "initializeMint2",
      },
    ],
    targetMint: "MockMint1111111111111111111111111111111111111",
    tokenActivitySummary: {
      movementCount: 2,
      largestIn: 90_000,
      largestOut: 250_000,
      netTokenDelta: -160_000,
      netSolDelta: 12.6,
    },
    tokenActivitySignals: [
      {
        mint: "MockMint1111111111111111111111111111111111111",
        signature: "mock-signature-largest-out",
        slot: 431_000_222,
        blockTime: 1_781_001_500,
        direction: "out",
        tokenDelta: -250_000,
        tokenAmountAbs: 250_000,
        solDelta: 18.7,
      },
      {
        mint: "MockMint1111111111111111111111111111111111111",
        signature: "mock-signature-largest-in",
        slot: 431_000_180,
        blockTime: 1_781_001_200,
        direction: "in",
        tokenDelta: 90_000,
        tokenAmountAbs: 90_000,
        solDelta: -6.1,
      },
    ],
    scanCoverage: {
      source: "wallet-and-token-accounts",
      walletSignatures: 20,
      tokenAccountSignatures: 22,
      tokenAccounts: 1,
      selectedSignatures: 40,
      loadedTransactions: 39,
      skippedTransactions: 0,
      rateLimited: false,
    },
    sellSignalCount: 2,
    sellSignals: [
      {
        mint: "MockMint1111111111111111111111111111111111111",
        signature: "mock-signature-2",
        slot: 431_000_111,
        blockTime: 1_781_001_000,
        tokenDelta: -120_000,
        solDelta: 11.4,
        confidence: "high",
        reason:
          "Wallet token balance decreased while native SOL balance increased in the same transaction.",
      },
    ],
    quickSellSignalCount: 1,
    score: 72,
    tier: "high",
    summary:
      "High heuristic risk: mock data shows fast mint and sell behavior for local UI testing.",
    limitations: [
      "MOCK_SOLANA=1 is enabled; this report is not blockchain evidence.",
      "Signals are heuristics and should be reviewed with transaction context.",
    ],
  };
}
