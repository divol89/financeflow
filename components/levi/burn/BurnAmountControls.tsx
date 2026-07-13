import { AlertTriangle, Flame, Loader2 } from "lucide-react";
import {
  formatBurnSolBalance,
  formatBurnTokenBalance,
  getBurnTokenUnit,
} from "@/lib/levi/burn/presentation";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type { BurnTokenOption, LeviBurnTrackerSyncState } from "@/types/leviBurn";

interface BurnAmountControlsProps {
  selectedToken: BurnTokenOption;
  solBalanceLamports: string;
  amount: string;
  amountError: string | null;
  acknowledged: boolean;
  canBurn: boolean;
  isBurning: boolean;
  trackerSyncState: LeviBurnTrackerSyncState;
  onAmountChange: (amount: string) => void;
  onUseMaximum: () => void;
  onAcknowledgedChange: (acknowledged: boolean) => void;
}

export function BurnAmountControls({
  selectedToken,
  solBalanceLamports,
  amount,
  amountError,
  acknowledged,
  canBurn,
  isBurning,
  trackerSyncState,
  onAmountChange,
  onUseMaximum,
  onAcknowledgedChange,
}: BurnAmountControlsProps) {
  const selectedLabel = getBurnTokenUnit(selectedToken);

  return (
    <>
      <div className="levi-burn-balance-row">
        <div>
          <span>Available to burn</span>
          <strong>
            {formatBurnTokenBalance(selectedToken)} {selectedLabel}
          </strong>
        </div>
        <span>{formatBurnSolBalance(solBalanceLamports)} SOL for network fees</span>
      </div>

      <label className="levi-burn-amount-field">
        <span>{selectedLabel} amount</span>
        <div>
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="0.00"
            aria-describedby="levi-burn-amount-help"
            aria-invalid={Boolean(amountError)}
          />
          <button
            type="button"
            onClick={onUseMaximum}
            disabled={selectedToken.availableRaw === "0"}
          >
            Max
          </button>
        </div>
        <small id="levi-burn-amount-help">
          Your wallet displays the final transaction before submission.
        </small>
      </label>

      {amountError ? (
        <p className="levi-burn-inline-error" role="alert">
          <AlertTriangle className="h-4 w-4" />
          {amountError}
        </p>
      ) : null}

      <label className="levi-burn-acknowledgement">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => onAcknowledgedChange(event.target.checked)}
        />
        <span>
          I verified mint <code>{truncateSolanaAddress(selectedToken.mint, 6)}</code>{" "}
          and understand that this permanently reduces my {selectedLabel} balance and
          the selected mint supply.
        </span>
      </label>

      <button type="submit" className="levi-burn-submit" disabled={!canBurn}>
        {isBurning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Flame className="h-4 w-4" />
        )}
        {isBurning
          ? trackerSyncState === "refreshing"
            ? "Updating LEVI AI tracker"
            : "Waiting for confirmation"
          : `Burn ${selectedLabel}`}
      </button>
    </>
  );
}
