import { useCallback, useState } from "react";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import type {
  TokenSnifferApiResponse,
  TokenSnifferReport,
} from "@/types/tokenSniffer";

export function useTokenSniffer() {
  const [report, setReport] = useState<TokenSnifferReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inspect = useCallback(async (mint: string) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch(
        `/api/token-sniffer?mint=${encodeURIComponent(mint.trim())}`
      );
      const payload = await readJsonResponse<TokenSnifferApiResponse>(
        response,
        "Token intelligence is temporarily unavailable."
      );
      if (!response.ok || !payload.report) {
        throw new Error(payload.error || "Unable to inspect this token.");
      }
      setReport(payload.report);
      return payload.report;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to inspect this token.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { report, isLoading, error, inspect };
}
