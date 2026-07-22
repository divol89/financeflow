import { useCallback, useEffect, useState } from "react";
import { fetchBurnLedger } from "@/lib/burnLedger/client";
import { BURN_LEDGER_EVENT_NAME } from "@/lib/burnLedger/constants";
import type { BurnLedgerPayload } from "@/types/burnLedger";

export function useBurnLedger() {
  const [data, setData] = useState<BurnLedgerPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setData(await fetchBurnLedger());
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Burn ledger unavailable.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    function handleUpdate(event: Event) {
      const payload = (event as CustomEvent<BurnLedgerPayload>).detail;
      if (payload) {
        setData(payload);
        setError(null);
        setIsLoading(false);
      }
    }
    window.addEventListener(BURN_LEDGER_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(BURN_LEDGER_EVENT_NAME, handleUpdate);
  }, []);

  return { data, isLoading, error, refresh };
}
