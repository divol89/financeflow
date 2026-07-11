import { readJsonResponse } from "@/lib/levi/fetchJson";
import type {
  LeviBurnSigningContext,
  LeviBurnTransactionStatus,
} from "@/types/leviBurn";

interface BurnSigningContextResponse extends Partial<LeviBurnSigningContext> {
  error?: string;
}

interface BurnTransactionStatusResponse extends Partial<LeviBurnTransactionStatus> {
  error?: string;
}

function pause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function requestLeviBurnSigningContext(): Promise<LeviBurnSigningContext> {
  const response = await fetch("/api/burn/context");
  const data = await readJsonResponse<BurnSigningContextResponse>(
    response,
    "Unable to prepare the burn transaction right now."
  );
  if (!response.ok || !data.blockhash) {
    throw new Error(data.error || "Unable to prepare the burn transaction right now.");
  }

  return { blockhash: data.blockhash };
}

async function requestLeviBurnTransactionStatus(
  signature: string
): Promise<LeviBurnTransactionStatus> {
  const response = await fetch(
    `/api/burn/transaction?signature=${encodeURIComponent(signature)}`
  );
  const data = await readJsonResponse<BurnTransactionStatusResponse>(
    response,
    "Unable to verify the submitted transaction right now."
  );
  if (!response.ok || !data.state) {
    throw new Error(data.error || "Unable to verify the submitted transaction right now.");
  }

  return {
    signature,
    state: data.state,
  };
}

export async function waitForLeviBurnConfirmation(
  signature: string,
  attempts = 8
): Promise<LeviBurnTransactionStatus> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const status = await requestLeviBurnTransactionStatus(signature);
    if (status.state !== "pending") return status;
    if (attempt < attempts - 1) await pause(1_000);
  }

  return { signature, state: "pending" };
}

export async function refreshBurnTrackerAfterBurn(signature: string): Promise<void> {
  const response = await fetch("/api/burn-tracker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signature }),
  });
  const data = await readJsonResponse<{ error?: string }>(
    response,
    "Unable to refresh the burn tracker right now."
  );
  if (!response.ok) {
    throw new Error(data.error || "Unable to refresh the burn tracker right now.");
  }
}
