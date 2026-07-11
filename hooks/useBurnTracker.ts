import { useCallback, useEffect, useState } from "react";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";

interface BurnTrackerResponse extends Partial<BurnTrackerPublicSnapshot> {
  error?: string;
}

interface BurnTrackerState {
  snapshot: BurnTrackerPublicSnapshot | null;
  isLoading: boolean;
  error: string | null;
}

const RETRY_DELAY_MS = 60_000;
const MIN_REFRESH_DELAY_MS = 30_000;

function getRefreshDelay(snapshot: BurnTrackerPublicSnapshot | null): number {
  if (!snapshot) return RETRY_DELAY_MS;
  const nextRefreshAt = Date.parse(snapshot.nextRefreshAt);
  if (!Number.isFinite(nextRefreshAt)) return RETRY_DELAY_MS;
  return Math.max(MIN_REFRESH_DELAY_MS, nextRefreshAt - Date.now() + 1_500);
}

function isSnapshot(data: BurnTrackerResponse): data is BurnTrackerPublicSnapshot {
  return (
    typeof data.mint === "string" &&
    typeof data.currentSupplyRaw === "string" &&
    typeof data.totalBurnedRaw === "string" &&
    typeof data.nextRefreshAt === "string"
  );
}

export function useBurnTracker() {
  const [state, setState] = useState<BurnTrackerState>({
    snapshot: null,
    isLoading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/burn-tracker");
      const data = await readJsonResponse<BurnTrackerResponse>(
        response,
        "Live burn data is temporarily unavailable."
      );

      if (!response.ok || !isSnapshot(data)) {
        setState((current) => ({
          snapshot: current.snapshot,
          isLoading: false,
          error: data.error || "Live burn data is temporarily unavailable.",
        }));
        return;
      }

      setState({ snapshot: data, isLoading: false, error: null });
    } catch {
      setState((current) => ({
        snapshot: current.snapshot,
        isLoading: false,
        error: "Live burn data is temporarily unavailable.",
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, getRefreshDelay(state.snapshot));

    return () => window.clearTimeout(timer);
  }, [refresh, state.snapshot]);

  return { ...state, refresh };
}
