import type {
  PortfolioActivityStatus,
  PortfolioDataCoverage,
} from "@/types/portfolio";

export interface PortfolioCoverageInput {
  activityEnabled: boolean;
  activityFailed: boolean;
  activityPartial: boolean;
  storedActivityCount: number;
  selectedSignatures: number;
  loadedTransactions: number;
  historyPoints: number;
  refreshedAt: string;
}

function activityStatus(input: PortfolioCoverageInput): PortfolioActivityStatus {
  if (!input.activityEnabled) return "locked";
  if (input.activityFailed) {
    return input.storedActivityCount > 0 ? "cached" : "unavailable";
  }
  return input.activityPartial ? "partial" : "live";
}

function activityMessage(
  status: PortfolioActivityStatus,
  input: PortfolioCoverageInput
): string {
  if (status === "locked") {
    return "Recent activity unlocks at the Basic K9 access tier.";
  }
  if (status === "cached") {
    return "The live activity window was unavailable, so previously stored events remain visible.";
  }
  if (status === "unavailable") {
    return "Balances are live, but recent activity could not be loaded from the public RPC.";
  }
  if (status === "partial") {
    return `${input.loadedTransactions}/${input.selectedSignatures} recent transactions loaded; completed evidence remains visible.`;
  }
  if (input.selectedSignatures === 0) {
    return "The live wallet window contains no recent transaction signatures.";
  }
  return `${input.loadedTransactions}/${input.selectedSignatures} recent transactions loaded from Solana.`;
}

export function buildPortfolioCoverage(
  input: PortfolioCoverageInput
): PortfolioDataCoverage {
  const status = activityStatus(input);
  return {
    balanceStatus: "live",
    activityStatus: status,
    activityMessage: activityMessage(status, input),
    selectedSignatures: input.selectedSignatures,
    loadedTransactions: input.loadedTransactions,
    historyPoints: input.historyPoints,
    refreshedAt: input.refreshedAt,
  };
}
