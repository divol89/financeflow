import { useCallback, useEffect, useState } from "react";
import { BULLISH_MULE_MINT } from "@/lib/fairLaunch/constants";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import type {
  FairLaunchAccessResponse,
  FairLaunchMutationResponse,
} from "@/types/fairLaunch";

const SIGNED_OUT_STATE: FairLaunchAccessResponse = {
  authenticated: false,
  wallet: null,
  holderEligible: false,
  accessGranted: false,
  accessCheckAvailable: true,
  isAdmin: false,
  holderMint: BULLISH_MULE_MINT,
  balance: null,
  balanceRaw: null,
  decimals: null,
  checkedAt: null,
  launches: [],
  catalogAvailable: true,
};

export function useFairLaunchCatalog(sessionWallet?: string) {
  const [data, setData] =
    useState<FairLaunchAccessResponse>(SIGNED_OUT_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionWallet) {
      setData(SIGNED_OUT_STATE);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/fair-launches", {
        headers: { Accept: "application/json" },
      });
      const payload = await readJsonResponse<FairLaunchAccessResponse>(
        response,
        "The Bullish Mule launch board is temporarily unavailable."
      );
      setData(payload);
      setError(
        response.ok
          ? payload.error || null
          : payload.error ||
              "The Bullish Mule launch board is temporarily unavailable."
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The Bullish Mule launch board is temporarily unavailable."
      );
    } finally {
      setIsLoading(false);
    }
  }, [sessionWallet]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const mutate = useCallback(
    async (
      method: "POST" | "PATCH" | "DELETE",
      input: Record<string, unknown>
    ) => {
      const response = await fetch("/api/fair-launches/admin", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const payload = await readJsonResponse<FairLaunchMutationResponse>(
        response,
        "Unable to update the launch catalog."
      );
      if (!response.ok) {
        throw new Error(payload.error || "Unable to update the launch catalog.");
      }
      await refresh();
      return payload;
    },
    [refresh]
  );

  return {
    data,
    isLoading,
    error,
    refresh,
    createLaunch: (input: Record<string, unknown>) => mutate("POST", input),
    updateLaunch: (input: Record<string, unknown>) => mutate("PATCH", input),
    deleteLaunch: (mint: string) => mutate("DELETE", { mint }),
  };
}
