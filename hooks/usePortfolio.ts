import { useCallback, useState } from "react";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import type {
  PortfolioJournalEntry,
  PortfolioPayload,
  PortfolioWatchItem,
} from "@/types/portfolio";

interface ApiError {
  error?: string;
}

export function usePortfolio() {
  const [data, setData] = useState<PortfolioPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/portfolio/refresh", { method: "POST" });
      const payload = await readJsonResponse<PortfolioPayload & ApiError>(
        response,
        "Portfolio is temporarily unavailable."
      );
      if (!response.ok || !payload.current) {
        throw new Error(payload.error || "Unable to refresh Portfolio");
      }
      setData(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to refresh Portfolio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeWatchItem = useCallback(async (item: PortfolioWatchItem) => {
    const response = await fetch(`/api/portfolio/watchlist?id=${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Unable to remove investigation");
    setData((current) =>
      current
        ? { ...current, watchlist: current.watchlist.filter((candidate) => candidate.id !== item.id) }
        : current
    );
  }, []);

  const saveJournalEntry = useCallback(
    async (
      entry: Omit<PortfolioJournalEntry, "id" | "createdAt" | "updatedAt"> & {
        id?: string;
      }
    ) => {
      const response = await fetch("/api/portfolio/journal", {
        method: entry.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...entry,
          targetWallet: entry.targetWallet || null,
        }),
      });
      const payload = await readJsonResponse<{ entry?: PortfolioJournalEntry; error?: string }>(
        response,
        "Unable to save journal entry"
      );
      if (!response.ok || !payload.entry) {
        throw new Error(payload.error || "Unable to save journal entry");
      }
      setData((current) => {
        if (!current) return current;
        const withoutEntry = current.journal.filter(
          (candidate) => candidate.id !== payload.entry?.id
        );
        return { ...current, journal: [payload.entry!, ...withoutEntry] };
      });
      return payload.entry;
    },
    []
  );

  const removeJournalEntry = useCallback(async (entry: PortfolioJournalEntry) => {
    const response = await fetch(`/api/portfolio/journal?id=${encodeURIComponent(entry.id)}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Unable to delete journal entry");
    setData((current) =>
      current
        ? { ...current, journal: current.journal.filter((candidate) => candidate.id !== entry.id) }
        : current
    );
  }, []);

  return {
    data,
    error,
    isLoading,
    refresh,
    removeWatchItem,
    saveJournalEntry,
    removeJournalEntry,
  };
}
