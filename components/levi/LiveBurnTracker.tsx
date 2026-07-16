import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Flame,
  LockKeyhole,
  Percent,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { useBurnTracker } from "@/hooks/useBurnTracker";
import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";

function formatTimestamp(value: string): string {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(timestamp) + " UTC";
}

function TrackerPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="levi-burn-tracker-metric levi-burn-tracker-placeholder"
      aria-label={`${label} loading`}
    >
      <span className="levi-burn-tracker-placeholder-line levi-burn-tracker-placeholder-label" />
      <span className="levi-burn-tracker-placeholder-line levi-burn-tracker-placeholder-value" />
      <span className="levi-burn-tracker-placeholder-line levi-burn-tracker-placeholder-copy" />
    </div>
  );
}

export function LiveBurnTracker() {
  const { snapshot, isLoading, error, refresh } = useBurnTracker();
  const latestBurn = snapshot?.latestBurn || null;
  const trackerIsPending = isLoading && !snapshot;
  const trackerIsStale = Boolean(snapshot?.stale || error);
  const latestBurnLabel = latestBurn
    ? formatTimestamp(latestBurn.occurredAt)
    : snapshot?.verificationPending
      ? "Verifying observed supply change"
      : "No verified burn since tracker launch";

  return (
    <section
      className="levi-burn-tracker"
      id="live-burn-tracker"
      aria-labelledby="live-burn-tracker-title"
    >
      <div className="levi-burn-tracker-header">
        <div>
          <div className="levi-section-label">
            <Flame className="h-4 w-4" />
            Live data / K9
          </div>
          <h2 id="live-burn-tracker-title">LIVE BURN TRACKER</h2>
          <p>
            Verified Token-2022 burns reduce K9 supply. Permanent community
            locks are deducted from effective circulating supply, never counted as burns.
          </p>
        </div>
        <div
          className={`levi-burn-tracker-status${trackerIsStale ? " is-stale" : ""}`}
        >
          {trackerIsPending || trackerIsStale ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          <span>
            {trackerIsPending
              ? "Loading verification"
              : trackerIsStale
              ? "Showing the latest cached verification"
              : "Verified on Solana"}
          </span>
          <button
            type="button"
            onClick={() => void refresh()}
            aria-label="Refresh live burn tracker"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <Link href="/burn" className="levi-burn-tracker-action">
          Burn K9 <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {error && !snapshot ? (
        <div className="levi-burn-tracker-unavailable" role="status">
          <RefreshCw className="h-4 w-4" />
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="levi-burn-tracker-grid">
            {isLoading && !snapshot ? (
              <>
                <TrackerPlaceholder label="Total burned" />
                <TrackerPlaceholder label="Current circulating supply" />
                <TrackerPlaceholder label="Percentage burned" />
                <TrackerPlaceholder label="Latest burn" />
              </>
            ) : snapshot ? (
              <>
                <article className="levi-burn-tracker-metric levi-burn-tracker-metric-burned">
                  <div className="levi-burn-tracker-metric-topline">
                    <span>🔥 Total Burned</span>
                    <Flame className="h-4 w-4" />
                  </div>
                  <strong>{formatRawTokenAmount(snapshot.totalBurnedRaw)} K9</strong>
                  <p>Permanently removed from the mint supply.</p>
                </article>

                <article className="levi-burn-tracker-metric">
                  <div className="levi-burn-tracker-metric-topline">
                    <span>📉 Current Circulating Supply</span>
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  <strong>
                    {formatRawTokenAmount(snapshot.effectiveCirculatingSupplyRaw)} K9
                  </strong>
                  <p>Mint supply less permanently locked community tokens.</p>
                </article>

                <article className="levi-burn-tracker-metric">
                  <div className="levi-burn-tracker-metric-topline">
                    <span>📊 Percentage Burned</span>
                    <Percent className="h-4 w-4" />
                  </div>
                  <strong>{snapshot.percentageBurned}%</strong>
                  <p>Of the total 1B K9 baseline.</p>
                </article>

                <article className="levi-burn-tracker-metric levi-burn-tracker-metric-latest">
                  <div className="levi-burn-tracker-metric-topline">
                    <span>🕒 Latest Burn</span>
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <strong>{latestBurnLabel}</strong>
                  <p>
                    {latestBurn?.amountRaw
                      ? `${formatRawTokenAmount(latestBurn.amountRaw)} K9 verified.`
                      : "Transaction monitoring began when this tracker launched."}
                  </p>
                </article>
              </>
            ) : null}
          </div>

          {snapshot ? (
            <div className="levi-burn-tracker-footer">
              <div className="levi-burn-tracker-transaction">
                <div>
                  <span>Latest Burn Transaction</span>
                  <p>
                    {latestBurn
                      ? "Open the verified transaction on Solscan."
                      : "No verified burn transaction since tracker launch."}
                  </p>
                </div>
                {latestBurn ? (
                  <a href={latestBurn.solscanUrl} target="_blank" rel="noreferrer">
                    View on Solscan <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="is-disabled">Awaiting verified burn</span>
                )}
              </div>

              <div className="levi-burn-tracker-lock">
                <LockKeyhole className="h-4 w-4" />
                <div>
                  <span>Community Lock Wallet</span>
                  <strong>
                    {formatRawTokenAmount(snapshot.communityLockRaw)} K9 permanently locked
                  </strong>
                  <code>{snapshot.communityLockWallet}</code>
                  <p>Excluded from Total Burned, deducted from circulating supply.</p>
                </div>
                <a href={snapshot.communityLockUrl} target="_blank" rel="noreferrer">
                  Verify wallet <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ) : null}
        </>
      )}

      <p className="levi-burn-tracker-note">
        Portal burns update this tracker immediately after Solana finalization. A two-hour
        verification remains as fallback for external burns and community locks.
      </p>
    </section>
  );
}
