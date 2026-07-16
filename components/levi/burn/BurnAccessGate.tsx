import { Flame, KeyRound, Loader2 } from "lucide-react";
import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import type { BurnTokenOption, BurnWalletInventory } from "@/types/leviBurn";

interface BurnAccessGateProps {
  inventory: BurnWalletInventory;
  selectedToken: BurnTokenOption;
  hasExternalAccessSession: boolean;
  isSigningAccess: boolean;
  onSignAccess: () => void;
}

export function BurnAccessGate({
  inventory,
  selectedToken,
  hasExternalAccessSession,
  isSigningAccess,
  onSignAccess,
}: BurnAccessGateProps) {
  if (selectedToken.isLeviAi) {
    return (
      <div className="levi-burn-access-gate is-unlocked">
        <div>
          <Flame className="h-4 w-4" />
          <div>
            <span>K9 burn</span>
            <strong>No holder-access minimum</strong>
          </div>
        </div>
        <p>You only need the amount being burned and enough SOL for the network fee.</p>
      </div>
    );
  }

  const isUnlocked = inventory.externalBurnEligible && hasExternalAccessSession;
  return (
    <div className={`levi-burn-access-gate${isUnlocked ? " is-unlocked" : ""}`}>
      <div>
        <KeyRound className="h-4 w-4" />
        <div>
          <span>External token access</span>
          <strong>
            {formatRawTokenAmount(
              inventory.leviAiBalanceRaw,
              inventory.leviAiDecimals,
              2
            )}{" "}
            K9 held
          </strong>
        </div>
      </div>
      {!inventory.externalBurnEligible ? (
        <p>Hold 1,000,000 K9 in this wallet to unlock external burns.</p>
      ) : hasExternalAccessSession ? (
        <p>Holding verified. This token is unlocked for holder-signed burning.</p>
      ) : (
        <button type="button" onClick={onSignAccess} disabled={isSigningAccess}>
          {isSigningAccess ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <KeyRound className="h-3.5 w-3.5" />
          )}
          {isSigningAccess ? "Signing" : "Sign access"}
        </button>
      )}
    </div>
  );
}
