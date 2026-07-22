import type { BurnLedgerPayload } from "@/types/burnLedger";

export function isBurnLedgerPayload(value: unknown): value is BurnLedgerPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.version === 1 &&
    candidate.scope === "flow-finance-portal" &&
    Array.isArray(candidate.events) &&
    Array.isArray(candidate.tokens) &&
    typeof candidate.updatedAt === "string"
  );
}
