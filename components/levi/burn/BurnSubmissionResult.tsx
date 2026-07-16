import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type {
  LeviBurnSubmission,
  LeviBurnTrackerSyncState,
} from "@/types/leviBurn";

interface BurnSubmissionResultProps {
  submission: LeviBurnSubmission;
  trackerSyncState: LeviBurnTrackerSyncState;
  onRetryTrackerSync: () => void;
}

export function BurnSubmissionResult({
  submission,
  trackerSyncState,
  onRetryTrackerSync,
}: BurnSubmissionResultProps) {
  return (
    <div className="levi-burn-success" role="status">
      <CheckCircle2 className="h-5 w-5" />
      <div>
        <strong>
          {submission.state === "confirmed"
            ? "Burn transaction confirmed."
            : "Burn transaction submitted."}
        </strong>
        <p>
          {formatRawTokenAmount(
            submission.amountRaw,
            submission.decimals,
            Math.min(submission.decimals, 6)
          )}{" "}
          {submission.symbol || truncateSolanaAddress(submission.mint, 4)} was burned
          from your wallet.
        </p>
        {submission.isLeviAi && trackerSyncState !== "idle" ? (
          <p
            className={`levi-burn-sync-status is-${trackerSyncState}`}
            aria-live="polite"
          >
            {trackerSyncState === "updated"
              ? "Live Burn Tracker updated automatically."
              : trackerSyncState === "refreshing"
                ? "Finalized on Solana. Updating the Live Burn Tracker now."
                : trackerSyncState === "waiting"
                  ? "Waiting for Solana finalization. The tracker will update automatically."
                  : "Automatic tracker sync was delayed. The burn remains valid on-chain."}
          </p>
        ) : null}
        <div>
          <a href={submission.solscanUrl} target="_blank" rel="noreferrer">
            View transaction <ExternalLink className="h-3.5 w-3.5" />
          </a>
          {submission.isLeviAi ? (
            <Link href="/#live-burn-tracker">
              Open K9 tracker <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link href={`/token-sniffer?mint=${encodeURIComponent(submission.mint)}`}>
              Inspect token <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
          {submission.isLeviAi && trackerSyncState === "deferred" ? (
            <button type="button" onClick={onRetryTrackerSync}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry tracker update
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
