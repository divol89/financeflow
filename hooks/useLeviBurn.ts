import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitPreparedBurn } from "@/lib/levi/burn/client";
import {
  synchronizeBurnTrackerAfterBurn,
  waitForLeviBurnConfirmation,
} from "@/lib/levi/burn/gateway";
import { publishBurnTrackerSnapshot } from "@/lib/levi/burnTracker/clientEvents";
import { parseBurnAmount } from "@/lib/levi/burn/validation";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { useInjectedSolanaWallet } from "@/hooks/useInjectedSolanaWallet";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import type {
  BurnPreparation,
  BurnTokenOption,
  BurnWalletInventory,
  LeviBurnSubmission,
  LeviBurnTrackerSyncState,
  LeviBurnTransactionState,
} from "@/types/leviBurn";

interface BurnInventoryResponse extends Partial<BurnWalletInventory> {
  error?: string;
}

interface BurnPreparationResponse extends Partial<BurnPreparation> {
  error?: string;
}

function preferredToken(
  tokens: BurnTokenOption[],
  currentMint: string | null
): BurnTokenOption | null {
  return (
    tokens.find((token) => token.mint === currentMint) ||
    tokens.find((token) => token.isLeviAi && token.burnable) ||
    tokens.find((token) => token.burnable) ||
    tokens[0] ||
    null
  );
}

export function useUniversalBurn() {
  const wallet = useInjectedSolanaWallet();
  const auth = useLeviAuth();
  const [inventory, setInventory] = useState<BurnWalletInventory | null>(null);
  const [selectedMint, setSelectedMint] = useState<string | null>(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<LeviBurnSubmission | null>(null);
  const [trackerSyncState, setTrackerSyncState] =
    useState<LeviBurnTrackerSyncState>("idle");
  const activeTrackerSignatureRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);

  const selectedToken = useMemo(
    () => inventory?.tokens.find((token) => token.mint === selectedMint) || null,
    [inventory, selectedMint]
  );
  const hasExternalAccessSession = Boolean(
    wallet.address && auth.session?.wallet === wallet.address
  );

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
        updateTrackerSyncState(signature, "updated");
        return result.snapshot;
      } catch {
        updateTrackerSyncState(signature, "deferred");
        return null;
      }
    },
    [updateTrackerSyncState]
  );

  const refreshInventory = useCallback(
    async (walletAddress = wallet.address) => {
      if (!walletAddress) {
        setInventory(null);
        setSelectedMint(null);
        return null;
      }

      setIsLoadingInventory(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/burn/quote?wallet=${encodeURIComponent(walletAddress)}`
        );
        const data = await readJsonResponse<BurnInventoryResponse>(
          response,
          "Unable to read your Solana token balances right now."
        );
        if (!response.ok || !data.wallet || !Array.isArray(data.tokens)) {
          throw new Error(
            data.error || "Unable to read your Solana token balances right now."
          );
        }

        const nextInventory = data as BurnWalletInventory;
        setInventory(nextInventory);
        setSelectedMint((current) =>
          preferredToken(nextInventory.tokens, current)?.mint || null
        );
        return nextInventory;
      } catch (reason) {
        setInventory(null);
        setSelectedMint(null);
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to read your Solana token balances right now."
        );
        return null;
      } finally {
        setIsLoadingInventory(false);
      }
    },
    [wallet.address]
  );

  useEffect(() => {
    if (!wallet.address) {
      setInventory(null);
      setSelectedMint(null);
      setSubmission(null);
      setTrackerSyncState("idle");
      activeTrackerSignatureRef.current = null;
      return;
    }

    void refreshInventory(wallet.address);
  }, [refreshInventory, wallet.address]);

  const connectWallet = useCallback(async () => {
    setError(null);
    try {
      const connected = await wallet.connect();
      if (!connected) return null;
      await refreshInventory(connected.address);
      return connected.address;
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Solana wallet connection failed."
      );
      throw reason;
    }
  }, [refreshInventory, wallet]);

  const selectToken = useCallback((mint: string) => {
    setSelectedMint(mint);
    setSubmission(null);
    setTrackerSyncState("idle");
    activeTrackerSignatureRef.current = null;
    setError(null);
  }, []);

  const signExternalAccess = useCallback(async () => {
    await auth.signIn();
  }, [auth]);

  const burn = useCallback(
    async (amount: string) => {
      if (!wallet.provider || !wallet.address || !inventory || !selectedToken) {
        const message = "Connect your Solana wallet and select a token first.";
        setError(message);
        throw new Error(message);
      }
      if (!selectedToken.burnable) {
        const message = selectedToken.blockedReason || "This token cannot be burned.";
        setError(message);
        throw new Error(message);
      }
      if (!selectedToken.isLeviAi && !hasExternalAccessSession) {
        const message =
          "Sign access to verify the 1,000,000 K9 holder requirement.";
        setError(message);
        throw new Error(message);
      }
      if (!selectedToken.isLeviAi && !inventory.externalBurnEligible) {
        const message = "Hold at least 1,000,000 K9 to burn another token.";
        setError(message);
        throw new Error(message);
      }

      try {
        const displaySymbol = selectedToken.symbol || "selected token";
        const amountRaw = parseBurnAmount(
          amount,
          selectedToken.decimals,
          displaySymbol
        );
        if (amountRaw > BigInt(selectedToken.availableRaw)) {
          throw new Error(
            "The requested burn amount exceeds the selected token balance."
          );
        }

        setIsBurning(true);
        setError(null);
        setSubmission(null);
        setTrackerSyncState("idle");
        activeTrackerSignatureRef.current = null;
        const response = await fetch("/api/burn/prepare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: wallet.address,
            mint: selectedToken.mint,
            amountRaw: amountRaw.toString(),
          }),
        });
        const data = await readJsonResponse<BurnPreparationResponse>(
          response,
          "Unable to prepare the burn transaction right now."
        );
        if (!response.ok || !data.transactionBase64 || !data.mint) {
          throw new Error(
            data.error || "Unable to prepare the burn transaction right now."
          );
        }

        const result = await submitPreparedBurn({
          provider: wallet.provider,
          preparation: data as BurnPreparation,
        });
        const status = await waitForLeviBurnConfirmation(result.signature);
        if (status.state === "failed") {
          throw new Error("The burn transaction failed on Solana.");
        }

        const completedResult: LeviBurnSubmission = {
          ...result,
          state:
            status.state === "confirmed" || status.state === "finalized"
              ? "confirmed"
              : "submitted",
        };
        setSubmission(completedResult);
        if (result.isLeviAi) {
          activeTrackerSignatureRef.current = result.signature;
          if (status.state === "finalized") {
            await synchronizeTracker(result.signature, status.state);
          } else {
            void synchronizeTracker(result.signature, status.state);
          }
        }
        await refreshInventory(wallet.address);
        return completedResult;
      } catch (reason) {
        const message =
          reason instanceof Error
            ? reason.message
            : "The burn transaction could not be completed.";
        setError(message);
        throw reason;
      } finally {
        setIsBurning(false);
      }
    },
    [
      hasExternalAccessSession,
      inventory,
      refreshInventory,
      selectedToken,
      synchronizeTracker,
      wallet.address,
      wallet.provider,
    ]
  );

  const retryTrackerSync = useCallback(async () => {
    if (!submission?.isLeviAi) return null;
    activeTrackerSignatureRef.current = submission.signature;
    return synchronizeTracker(
      submission.signature,
      submission.state === "confirmed" ? "confirmed" : "pending"
    );
  }, [submission, synchronizeTracker]);

  return {
    ...wallet,
    inventory,
    selectedToken,
    selectedMint,
    hasExternalAccessSession,
    isLoadingInventory,
    isBurning,
    isSigningAccess: auth.isSigning,
    error: error || auth.error,
    submission,
    trackerSyncState,
    connectWallet,
    refreshInventory,
    retryTrackerSync,
    selectToken,
    signExternalAccess,
    burn,
  };
}
