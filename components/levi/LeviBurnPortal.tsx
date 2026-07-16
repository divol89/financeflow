import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Flame,
  Loader2,
  RefreshCw,
  WalletCards,
} from "lucide-react";
import { BurnAccessGate } from "@/components/levi/burn/BurnAccessGate";
import { BurnAmountControls } from "@/components/levi/burn/BurnAmountControls";
import { BurnPortalIntro } from "@/components/levi/burn/BurnPortalIntro";
import { BurnSubmissionResult } from "@/components/levi/burn/BurnSubmissionResult";
import { BurnTokenSelector } from "@/components/levi/burn/BurnTokenSelector";
import { useUniversalBurn } from "@/hooks/useLeviBurn";
import { getBurnTokenUnit } from "@/lib/levi/burn/presentation";
import { formatBurnAmount, parseBurnAmount } from "@/lib/levi/burn/validation";
import { truncateSolanaAddress } from "@/lib/levi/wallet";

export function LeviBurnPortal() {
  const {
    address,
    isConnected,
    isConnecting,
    inventory,
    selectedToken,
    selectedMint,
    hasExternalAccessSession,
    isLoadingInventory,
    isBurning,
    isSigningAccess,
    error,
    submission,
    trackerSyncState,
    connectWallet,
    refreshInventory,
    retryTrackerSync,
    selectToken,
    signExternalAccess,
    burn,
  } = useUniversalBurn();
  const [amount, setAmount] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    setAmount("");
    setAcknowledged(false);
  }, [selectedMint]);

  const amountState = useMemo(() => {
    if (!amount.trim() || !selectedToken) return { amountRaw: null, error: null };

    try {
      return {
        amountRaw: parseBurnAmount(
          amount,
          selectedToken.decimals,
          getBurnTokenUnit(selectedToken)
        ),
        error: null,
      };
    } catch (reason) {
      return {
        amountRaw: null,
        error: reason instanceof Error ? reason.message : "Enter a valid amount.",
      };
    }
  }, [amount, selectedToken]);

  const exceedsBalance = Boolean(
    amountState.amountRaw &&
      selectedToken &&
      amountState.amountRaw > BigInt(selectedToken.availableRaw)
  );
  const amountError = exceedsBalance
    ? "The requested burn amount exceeds the selected token balance."
    : amountState.error;
  const externalGateSatisfied = Boolean(
    selectedToken?.isLeviAi ||
      (inventory?.externalBurnEligible && hasExternalAccessSession)
  );
  const canBurn = Boolean(
    selectedToken?.burnable &&
      amountState.amountRaw &&
      !amountError &&
      acknowledged &&
      externalGateSatisfied &&
      !isBurning &&
      !isLoadingInventory
  );

  async function handleConnect() {
    try {
      await connectWallet();
    } catch {
      // The hook exposes the actionable wallet error below the form.
    }
  }

  async function handleSignAccess() {
    try {
      await signExternalAccess();
    } catch {
      // The authentication hook exposes the signing error below the form.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canBurn) return;

    try {
      const result = await burn(amount);
      if (result) {
        setAmount("");
        setAcknowledged(false);
      }
    } catch {
      // The hook exposes the transaction error below the form.
    }
  }

  function useMaximumBalance() {
    if (!selectedToken) return;
    setAmount(formatBurnAmount(selectedToken.availableRaw, selectedToken.decimals));
  }

  return (
    <section className="levi-burn-portal" aria-labelledby="levi-burn-title">
      <BurnPortalIntro />

      <form className="levi-burn-tool" onSubmit={handleSubmit}>
        <div className="levi-burn-tool-heading">
          <div>
            <span>Burn from your wallet</span>
            <h2>Select, review, then confirm in your wallet.</h2>
          </div>
          <Flame className="h-5 w-5" />
        </div>

        {!isConnected ? (
          <div className="levi-burn-connect-state">
            <p>Connect a Solana wallet to load the supported tokens you control.</p>
            <button
              type="button"
              className="levi-primary-button"
              onClick={() => void handleConnect()}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <WalletCards className="h-4 w-4" />
              )}
              {isConnecting ? "Connecting" : "Connect wallet"}
            </button>
          </div>
        ) : (
          <>
            <div className="levi-burn-wallet-row">
              <div>
                <span>Connected wallet</span>
                <strong>{address ? truncateSolanaAddress(address, 6) : "Loading"}</strong>
              </div>
              <button
                type="button"
                className="levi-burn-refresh"
                onClick={() => void refreshInventory()}
                disabled={isLoadingInventory}
              >
                <RefreshCw
                  className={`h-3.5 w-3.5${isLoadingInventory ? " animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {isLoadingInventory && !inventory ? (
              <div className="levi-burn-loading" role="status">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading SPL and Token-2022 balances.
              </div>
            ) : inventory && inventory.tokens.length > 0 ? (
              <>
                <BurnTokenSelector
                  inventory={inventory}
                  selectedMint={selectedMint}
                  selectedToken={selectedToken}
                  disabled={isBurning}
                  onSelect={selectToken}
                />

                {selectedToken ? (
                  <>
                    <BurnAccessGate
                      inventory={inventory}
                      selectedToken={selectedToken}
                      hasExternalAccessSession={hasExternalAccessSession}
                      isSigningAccess={isSigningAccess}
                      onSignAccess={() => void handleSignAccess()}
                    />
                    <BurnAmountControls
                      selectedToken={selectedToken}
                      solBalanceLamports={inventory.solBalanceLamports}
                      amount={amount}
                      amountError={amountError}
                      acknowledged={acknowledged}
                      canBurn={canBurn}
                      isBurning={isBurning}
                      trackerSyncState={trackerSyncState}
                      onAmountChange={setAmount}
                      onUseMaximum={useMaximumBalance}
                      onAcknowledgedChange={setAcknowledged}
                    />
                  </>
                ) : null}
              </>
            ) : (
              <div className="levi-burn-connect-state">
                <p>No positive SPL or Token-2022 balances were found in this wallet.</p>
                <button
                  type="button"
                  className="levi-secondary-button"
                  onClick={() => void refreshInventory()}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh tokens
                </button>
              </div>
            )}
          </>
        )}

        {error ? (
          <p className="levi-burn-error" role="alert">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        ) : null}

        {submission ? (
          <BurnSubmissionResult
            submission={submission}
            trackerSyncState={trackerSyncState}
            onRetryTrackerSync={() => void retryTrackerSync()}
          />
        ) : null}

        <p className="levi-burn-tool-footnote">
          Only K9 burns update the public Live Burn Tracker. External-token burns remain
          verifiable through their Solscan transaction and the selected mint supply.
        </p>
      </form>
    </section>
  );
}
