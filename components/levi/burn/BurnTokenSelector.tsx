import { AlertTriangle, Coins, ExternalLink } from "lucide-react";
import {
  formatBurnTokenBalance,
  getBurnTokenDisplayName,
} from "@/lib/levi/burn/presentation";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type { BurnTokenOption, BurnWalletInventory } from "@/types/leviBurn";

interface BurnTokenSelectorProps {
  inventory: BurnWalletInventory;
  selectedMint: string | null;
  selectedToken: BurnTokenOption | null;
  disabled: boolean;
  onSelect: (mint: string) => void;
}

export function BurnTokenSelector({
  inventory,
  selectedMint,
  selectedToken,
  disabled,
  onSelect,
}: BurnTokenSelectorProps) {
  return (
    <>
      <label className="levi-burn-token-selector">
        <span>Token to burn</span>
        <select
          value={selectedMint || ""}
          onChange={(event) => onSelect(event.target.value)}
          disabled={disabled}
        >
          {inventory.tokens.map((token) => (
            <option key={`${token.programId}:${token.mint}`} value={token.mint}>
              {getBurnTokenDisplayName(token)} · {formatBurnTokenBalance(token)} ·{" "}
              {truncateSolanaAddress(token.mint, 4)}
            </option>
          ))}
        </select>
        <small>
          {inventory.truncated
            ? `Showing the first ${inventory.tokens.length} of ${inventory.totalTokenCount} positive token balances.`
            : `${inventory.totalTokenCount} positive token balance${inventory.totalTokenCount === 1 ? "" : "s"} found.`}{" "}
          Names are on-chain labels and can be duplicated. Verify the complete mint before burning.
        </small>
      </label>

      {selectedToken ? (
        <div className="levi-burn-token-review">
          <div className="levi-burn-token-review-topline">
            <div>
              <Coins className="h-4 w-4" />
              <span>{getBurnTokenDisplayName(selectedToken)}</span>
            </div>
            <strong>
              {selectedToken.program === "token-2022" ? "Token-2022" : "SPL Token"}
            </strong>
          </div>
          <code>{selectedToken.mint}</code>
          <a
            href={`https://solscan.io/token/${selectedToken.mint}`}
            target="_blank"
            rel="noreferrer"
          >
            Verify mint on Solscan <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {selectedToken.warning ? (
            <p className="levi-burn-token-warning">
              <AlertTriangle className="h-3.5 w-3.5" />
              {selectedToken.warning}
            </p>
          ) : null}
          {!selectedToken.burnable ? (
            <p className="levi-burn-token-warning is-blocked">
              <AlertTriangle className="h-3.5 w-3.5" />
              {selectedToken.blockedReason}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
