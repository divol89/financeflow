import { useCallback, useEffect, useState } from "react";
import { submitLeviBurn } from "@/lib/levi/burn/client";
import {
  requestLeviBurnSigningContext,
  waitForLeviBurnConfirmation,
} from "@/lib/levi/burn/gateway";
import { parseLeviBurnAmount } from "@/lib/levi/burn/validation";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { useInjectedSolanaWallet } from "@/hooks/useInjectedSolanaWallet";
import type { LeviBurnQuote, LeviBurnSubmission } from "@/types/leviBurn";

interface BurnQuoteResponse extends Partial<LeviBurnQuote> {
  error?: string;
}

export function useLeviBurn() {
  const wallet = useInjectedSolanaWallet();
  const [quote, setQuote] = useState<LeviBurnQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<LeviBurnSubmission | null>(null);

  const refreshQuote = useCallback(
    async (walletAddress = wallet.address) => {
      if (!walletAddress) {
        setQuote(null);
        return null;
      }

      setIsLoadingQuote(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/burn/quote?wallet=${encodeURIComponent(walletAddress)}`
        );
        const data = await readJsonResponse<BurnQuoteResponse>(
          response,
          "Unable to read your LEVI AI balance right now."
        );
        if (!response.ok || !data.wallet || !data.availableRaw || !data.tokenAccounts) {
          throw new Error(data.error || "Unable to read your LEVI AI balance right now.");
        }

        const nextQuote = data as LeviBurnQuote;
        setQuote(nextQuote);
        return nextQuote;
      } catch (reason) {
        setQuote(null);
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to read your LEVI AI balance right now."
        );
        return null;
      } finally {
        setIsLoadingQuote(false);
      }
    },
    [wallet.address]
  );

  useEffect(() => {
    if (!wallet.address) {
      setQuote(null);
      setSubmission(null);
      return;
    }

    void refreshQuote(wallet.address);
  }, [refreshQuote, wallet.address]);

  const connectWallet = useCallback(async () => {
    setError(null);
    try {
      const connected = await wallet.connect();
      await refreshQuote(connected.address);
      return connected.address;
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Solana wallet connection failed."
      );
      throw reason;
    }
  }, [refreshQuote, wallet]);

  const burn = useCallback(
    async (amount: string) => {
      if (!wallet.provider || !wallet.address || !quote) {
        const message = "Connect your Solana wallet and load your LEVI AI balance first.";
        setError(message);
        throw new Error(message);
      }

      try {
        const amountRaw = parseLeviBurnAmount(amount, quote.decimals);
        if (amountRaw > BigInt(quote.availableRaw)) {
          throw new Error("The requested burn amount exceeds your available LEVI AI balance.");
        }

        setIsBurning(true);
        setError(null);
        setSubmission(null);
        const signingContext = await requestLeviBurnSigningContext();
        const result = await submitLeviBurn({
          provider: wallet.provider,
          wallet: wallet.address,
          tokenAccounts: quote.tokenAccounts,
          amountRaw,
          signingContext,
        });
        const status = await waitForLeviBurnConfirmation(result.signature);
        if (status.state === "failed") {
          throw new Error("The burn transaction failed on Solana.");
        }

        const completedResult: LeviBurnSubmission = {
          ...result,
          state: status.state === "confirmed" ? "confirmed" : "submitted",
        };
        setSubmission(completedResult);
        await refreshQuote(wallet.address);
        return completedResult;
      } catch (reason) {
        const message =
          reason instanceof Error ? reason.message : "The burn transaction could not be completed.";
        setError(message);
        throw reason;
      } finally {
        setIsBurning(false);
      }
    },
    [quote, refreshQuote, wallet.address, wallet.provider]
  );

  return {
    ...wallet,
    quote,
    isLoadingQuote,
    isBurning,
    error,
    submission,
    connectWallet,
    refreshQuote,
    burn,
  };
}
