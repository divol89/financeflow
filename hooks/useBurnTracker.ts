import { useCallback, useEffect, useState } from "react";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { subscribeToBurnTrackerSnapshots } from "@/lib/levi/burnTracker/clientEvents";
import { isBurnTrackerPublicSnapshot } from "@/lib/levi/burnTracker/validation";
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

function isNewerSnapshot(
  current: BurnTrackerPublicSnapshot | null,
  next: BurnTrackerPublicSnapshot
): boolean {
  if (!current) return true;
  const currentTime = Date.parse(current.refreshedAt);
  const nextTime = Date.parse(next.refreshedAt);
  if (!Number.isFinite(currentTime) || !Number.isFinite(nextTime)) return true;
  return nextTime >= currentTime;
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

      if (!response.ok || !isBurnTrackerPublicSnapshot(data)) {
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
    return subscribeToBurnTrackerSnapshots((snapshot) => {
      setState((current) =>
        isNewerSnapshot(current.snapshot, snapshot)
          ? { snapshot, isLoading: false, error: null }
          : current
      );
    });
  }, []);

  useEffect(() => {
    let lastVisibilityRefreshAt = 0;
    const refreshWhenVisible = () => {
      const now = Date.now();
      if (
        document.visibilityState !== "visible" ||
        now - lastVisibilityRefreshAt < 1_000
      ) {
        return;
      }

      lastVisibilityRefreshAt = now;
      void refresh();
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, getRefreshDelay(state.snapshot));

    return () => window.clearTimeout(timer);
  }, [refresh, state.snapshot]);

  return { ...state, refresh };
}
