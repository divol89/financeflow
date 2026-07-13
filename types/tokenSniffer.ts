export type TokenSnifferRiskTone = "info" | "warn" | "danger";
export type TokenSnifferVerdictTone = "lower" | "review" | "elevated" | "high";

export interface TokenSnifferRisk {
  id: string;
  name: string;
  value: string | null;
  description: string;
  score: number;
  tone: TokenSnifferRiskTone;
}

export interface TokenSnifferVerdict {
  tone: TokenSnifferVerdictTone;
  label: string;
  summary: string;
}

export interface TokenSnifferReport {
  mint: string;
  tokenProgram: string;
  tokenProgramLabel: string;
  score: number;
  scoreNormalized: number;
  lpLockedPercent: number;
  verdict: TokenSnifferVerdict;
  risks: TokenSnifferRisk[];
  fetchedAt: string;
  expiresAt: string;
  cached: boolean;
  stale: boolean;
  source: "RugCheck via FluxRPC";
}

export interface TokenSnifferApiResponse {
  report?: TokenSnifferReport;
  error?: string;
  retryAfterSeconds?: number;
}
