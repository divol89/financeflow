import { readJsonResponse } from "@/lib/levi/fetchJson";
import { isBurnTrackerPublicSnapshot } from "@/lib/levi/burnTracker/validation";
import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";
import type {
  LeviBurnSigningContext,
  LeviBurnTransactionState,
  LeviBurnTransactionStatus,
} from "@/types/leviBurn";

interface BurnSigningContextResponse extends Partial<LeviBurnSigningContext> {
  error?: string;
}

interface BurnTransactionStatusResponse extends Partial<LeviBurnTransactionStatus> {
  error?: string;
}

interface BurnTrackerResponse extends Partial<BurnTrackerPublicSnapshot> {
  error?: string;
}

interface BurnTrackerSynchronizationResult {
  state: LeviBurnTransactionState;
  snapshot: BurnTrackerPublicSnapshot | null;
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
  attempts = 8,
  delayMs = 1_000
): Promise<LeviBurnTransactionStatus> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const status = await requestLeviBurnTransactionStatus(signature);
    if (status.state !== "pending") return status;
    if (attempt < attempts - 1) await pause(delayMs);
  }

  return { signature, state: "pending" };
}

export async function waitForLeviBurnFinalization(
  signature: string,
  attempts = 40,
  delayMs = 1_000
): Promise<LeviBurnTransactionStatus> {
  let latest: LeviBurnTransactionStatus = { signature, state: "pending" };

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    latest = await requestLeviBurnTransactionStatus(signature);
    if (latest.state === "finalized" || latest.state === "failed") return latest;
    if (attempt < attempts - 1) await pause(delayMs);
  }

  return latest;
}

export async function refreshBurnTrackerAfterBurn(
  signature: string
): Promise<BurnTrackerPublicSnapshot> {
  const response = await fetch("/api/burn-tracker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signature }),
  });
  const data = await readJsonResponse<BurnTrackerResponse>(
    response,
    "Unable to refresh the burn tracker right now."
  );
  if (!response.ok || !isBurnTrackerPublicSnapshot(data)) {
    throw new Error(data.error || "Unable to refresh the burn tracker right now.");
  }

  return data;
}

export async function synchronizeBurnTrackerAfterBurn(
  signature: string,
  options: {
    initialState?: LeviBurnTransactionState;
    finalizationAttempts?: number;
    delayMs?: number;
    refreshAttempts?: number;
  } = {}
): Promise<BurnTrackerSynchronizationResult> {
  const finalStatus =
    options.initialState === "finalized"
      ? { signature, state: "finalized" as const }
      : await waitForLeviBurnFinalization(
          signature,
          options.finalizationAttempts,
          options.delayMs
        );

  if (finalStatus.state !== "finalized") {
    return { state: finalStatus.state, snapshot: null };
  }

  const refreshAttempts = options.refreshAttempts || 2;
  let latestError: unknown = null;
  for (let attempt = 0; attempt < refreshAttempts; attempt += 1) {
    try {
      return {
        state: "finalized",
        snapshot: await refreshBurnTrackerAfterBurn(signature),
      };
    } catch (error) {
      latestError = error;
      if (attempt < refreshAttempts - 1) await pause(options.delayMs ?? 1_500);
    }
  }

  throw latestError instanceof Error
    ? latestError
    : new Error("Unable to refresh the burn tracker right now.");
}
