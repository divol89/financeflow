import type {
  TokenSnifferReport,
  TokenSnifferRisk,
  TokenSnifferRiskTone,
  TokenSnifferVerdict,
} from "@/types/tokenSniffer";

interface ProviderRisk {
  name?: unknown;
  value?: unknown;
  description?: unknown;
  score?: unknown;
  level?: unknown;
}

interface ProviderSummary {
  tokenProgram?: unknown;
  risks?: unknown;
  score?: unknown;
  score_normalised?: unknown;
  lpLockedPct?: unknown;
}

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function riskTone(level: unknown): TokenSnifferRiskTone {
  const normalized = String(level || "").toLowerCase();
  if (["danger", "critical", "error"].includes(normalized)) return "danger";
  if (["warn", "warning"].includes(normalized)) return "warn";
  return "info";
}

function normalizeRisk(risk: ProviderRisk, index: number): TokenSnifferRisk {
  const name = typeof risk.name === "string" && risk.name.trim()
    ? risk.name.trim()
    : `Risk signal ${index + 1}`;
  return {
    id: `${index}:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    value:
      typeof risk.value === "string" && risk.value.trim()
        ? risk.value.trim()
        : null,
    description:
      typeof risk.description === "string" && risk.description.trim()
        ? risk.description.trim()
        : "The provider flagged this item for manual review.",
    score: Math.max(0, Math.round(finiteNumber(risk.score))),
    tone: riskTone(risk.level),
  };
}

export function tokenProgramLabel(program: string): string {
  if (program === "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") {
    return "Token-2022";
  }
  if (program === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
    return "SPL Token";
  }
  return "Unknown token program";
}

export function getTokenSnifferVerdict(
  scoreNormalized: number,
  risks: TokenSnifferRisk[]
): TokenSnifferVerdict {
  const score = clamp(Math.round(scoreNormalized), 0, 100);
  const hasDanger = risks.some((risk) => risk.tone === "danger");

  if (hasDanger || score >= 70) {
    return {
      tone: "high",
      label: "High warning signals",
      summary: "Several signals need careful verification before any trade.",
    };
  }
  if (score >= 45) {
    return {
      tone: "elevated",
      label: "Elevated warning signals",
      summary: "The report contains meaningful risks that deserve deeper review.",
    };
  }
  if (score >= 20 || risks.length > 0) {
    return {
      tone: "review",
      label: "Review before trading",
      summary: "Some warning signals were found. Read each one before deciding.",
    };
  }
  return {
    tone: "lower",
    label: "Fewer warning signals",
    summary: "No major warning was returned, but this does not make the token safe.",
  };
}

export function normalizeTokenSnifferReport(
  mint: string,
  value: unknown,
  now = new Date(),
  ttlMs = 10 * 60_000
): TokenSnifferReport {
  if (!value || typeof value !== "object") {
    throw new Error("Token intelligence provider returned an invalid response.");
  }
  const summary = value as ProviderSummary;
  const tokenProgram = typeof summary.tokenProgram === "string"
    ? summary.tokenProgram
    : "";
  const risks = Array.isArray(summary.risks)
    ? summary.risks.map((risk, index) =>
        normalizeRisk((risk || {}) as ProviderRisk, index)
      )
    : [];
  const scoreNormalized = clamp(
    Math.round(finiteNumber(summary.score_normalised)),
    0,
    100
  );

  return {
    mint,
    tokenProgram,
    tokenProgramLabel: tokenProgramLabel(tokenProgram),
    score: Math.max(0, Math.round(finiteNumber(summary.score))),
    scoreNormalized,
    lpLockedPercent: clamp(finiteNumber(summary.lpLockedPct), 0, 100),
    verdict: getTokenSnifferVerdict(scoreNormalized, risks),
    risks,
    fetchedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
    cached: false,
    stale: false,
    source: "RugCheck via FluxRPC",
  };
}
