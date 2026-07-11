import { useCallback, useEffect, useRef, useState } from "react";
import { submitLeviBurn } from "@/lib/levi/burn/client";
import {
  requestLeviBurnSigningContext,
  synchronizeBurnTrackerAfterBurn,
  waitForLeviBurnConfirmation,
} from "@/lib/levi/burn/gateway";
import { publishBurnTrackerSnapshot } from "@/lib/levi/burnTracker/clientEvents";
import { parseLeviBurnAmount } from "@/lib/levi/burn/validation";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { useInjectedSolanaWallet } from "@/hooks/useInjectedSolanaWallet";
import type {
  LeviBurnQuote,
  LeviBurnSubmission,
  LeviBurnTrackerSyncState,
  LeviBurnTransactionState,
} from "@/types/leviBurn";

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
  const [trackerSyncState, setTrackerSyncState] =
    useState<LeviBurnTrackerSyncState>("idle");
  const activeTrackerSignatureRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateTrackerSyncState = useCallback(
    (signature: string, nextState: LeviBurnTrackerSyncState) => {
      if (
        isMountedRef.current &&
        activeTrackerSignatureRef.current === signature
      ) {
        setTrackerSyncState(nextState);
      }
    },
    []
  );

  const synchronizeTracker = useCallback(
    async (signature: string, initialState: LeviBurnTransactionState) => {
      updateTrackerSyncState(
        signature,
        initialState === "finalized" ? "refreshing" : "waiting"
      );

      try {
        const result = await synchronizeBurnTrackerAfterBurn(signature, {
          initialState,
        });
        if (!result.snapshot) {
          updateTrackerSyncState(signature, "deferred");
          return null;
        }

        updateTrackerSyncState(signature, "refreshing");
        publishBurnTrackerSnapshot(result.snapshot);
        if (
          isMountedRef.current &&
          activeTrackerSignatureRef.current === signature
        ) {
          setSubmission((current) =>
            current?.signature === signature
              ? { ...current, state: "confirmed" }
              : current
          );
        }
        updateTrackerSyncState(signature, "updated");
        return result.snapshot;
      } catch {
        updateTrackerSyncState(signature, "deferred");
        return null;
      }
    },
    [updateTrackerSyncState]
  );

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
      setTrackerSyncState("idle");
      activeTrackerSignatureRef.current = null;
      return;
    }

    void refreshQuote(wallet.address);
  }, [refreshQuote, wallet.address]);

  const connectWallet = useCallback(async () => {
    setError(null);
    try {
      const connected = await wallet.connect();
      if (!connected) return null;
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
        setTrackerSyncState("idle");
        activeTrackerSignatureRef.current = null;
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

        activeTrackerSignatureRef.current = result.signature;
        const completedResult: LeviBurnSubmission = {
          ...result,
          state:
            status.state === "confirmed" || status.state === "finalized"
              ? "confirmed"
              : "submitted",
        };
        setSubmission(completedResult);
        if (status.state === "finalized") {
          await synchronizeTracker(result.signature, status.state);
        } else {
          void synchronizeTracker(result.signature, status.state);
        }
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
    [quote, refreshQuote, synchronizeTracker, wallet.address, wallet.provider]
  );

  const retryTrackerSync = useCallback(async () => {
    if (!submission) return null;
    activeTrackerSignatureRef.current = submission.signature;
    return synchronizeTracker(
      submission.signature,
      submission.state === "confirmed" ? "confirmed" : "pending"
    );
  }, [submission, synchronizeTracker]);

  return {
    ...wallet,
    quote,
    isLoadingQuote,
    isBurning,
    error,
    submission,
    trackerSyncState,
    connectWallet,
    refreshQuote,
    retryTrackerSync,
    burn,
  };
}
