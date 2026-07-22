import { readJsonResponse } from "@/lib/levi/fetchJson";
import type { BurnLedgerPayload } from "@/types/burnLedger";
import { BURN_LEDGER_EVENT_NAME } from "./constants";
import { isBurnLedgerPayload } from "./validation";

export async function fetchBurnLedger(): Promise<BurnLedgerPayload> {
  const response = await fetch("/api/burn-ledger");
  const data = await readJsonResponse<BurnLedgerPayload & { error?: string }>(
    response,
    "The public burn ledger is temporarily unavailable."
  );
  if (!response.ok || !isBurnLedgerPayload(data)) {
    throw new Error(data.error || "The public burn ledger is temporarily unavailable.");
  }
  return data;
}

export async function recordPortalBurn(input: {
  signature: string;
  mint: string;
  wallet: string;
}): Promise<BurnLedgerPayload> {
  const response = await fetch("/api/burn-ledger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await readJsonResponse<BurnLedgerPayload & { error?: string }>(
    response,
    "The burn is valid, but the public ledger could not update yet."
  );
  if (!response.ok || !isBurnLedgerPayload(data)) {
    throw new Error(
      data.error || "The burn is valid, but the public ledger could not update yet."
    );
  }
  publishBurnLedger(data);
  return data;
}

export function publishBurnLedger(payload: BurnLedgerPayload): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<BurnLedgerPayload>(BURN_LEDGER_EVENT_NAME, { detail: payload })
  );
}
