import type { RiskScoreResult } from "@/types/levi";

interface ScoreInput {
  createdTokenCount: number;
  sellSignalCount: number;
  quickSellSignalCount: number;
  inspectedTransactions: number;
}

export function scoreCreatorRisk(input: ScoreInput): RiskScoreResult {
  const activityWeight = Math.min(input.createdTokenCount * 8, 32);
  const sellWeight = Math.min(input.sellSignalCount * 12, 36);
  const quickSellWeight = Math.min(input.quickSellSignalCount * 18, 36);
  const lowSamplePenalty = input.inspectedTransactions < 10 ? 6 : 0;
  const score = Math.min(
    100,
    Math.round(activityWeight + sellWeight + quickSellWeight + lowSamplePenalty)
  );

  if (score >= 80) {
    return {
      score,
      tier: "critical",
      summary:
        "Critical heuristic risk: repeated mint activity and creator-side sell patterns were detected.",
    };
  }

  if (score >= 55) {
    return {
      score,
      tier: "high",
      summary:
        "High heuristic risk: multiple signals match behavior often associated with fast token exits.",
    };
  }

  if (score >= 30) {
    return {
      score,
      tier: "medium",
      summary:
        "Medium heuristic risk: some suspicious signals were found, but more context is needed.",
    };
  }

  return {
    score,
    tier: "low",
    summary:
      "Low heuristic risk in the inspected window. This is not a guarantee of safety.",
  };
}
