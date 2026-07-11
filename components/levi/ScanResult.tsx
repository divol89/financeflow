import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  BookmarkPlus,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Gauge,
  History,
  Loader2,
  Radar,
  ShieldAlert,
  WalletCards,
} from "lucide-react";
import type {
  ClassifiedTokenActivity,
  DistributionPressureLevel,
  LeviScanReport,
} from "@/types/levi";
import { CLASSIFICATION_LABELS, PRESSURE_FACTOR_MAXIMUMS } from "@/lib/levi/scanner/methodology";

interface ScanResultProps {
  report: LeviScanReport;
  canExtend?: boolean;
  isExtending?: boolean;
  onExtend?(): void;
}

const pressureTone: Record<DistributionPressureLevel, string> = {
  lower: "is-lower",
  watch: "is-watch",
  elevated: "is-elevated",
  high: "is-high",
  insufficient: "is-insufficient",
};

function groupDigits(value: string): string {
  const [whole, fraction] = value.split(".");
  const sign = whole.startsWith("-") ? "-" : "";
  const digits = sign ? whole.slice(1) : whole;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${grouped}${fraction ? `.${fraction}` : ""}`;
}

function compactAddress(value: string): string {
  return value.length > 16 ? `${value.slice(0, 7)}...${value.slice(-6)}` : value;
}

function formatTime(value: number | null): string {
  return value ? new Date(value * 1000).toLocaleString() : "Time unavailable";
}

function EventIcon({ event }: { event: ClassifiedTokenActivity }) {
  if (event.classification === "sell" || event.classification === "transfer_out") {
    return <ArrowUpRight className="h-4 w-4" />;
  }
  if (event.classification === "buy" || event.classification === "transfer_in") {
    return <ArrowDownLeft className="h-4 w-4" />;
  }
  return <Radar className="h-4 w-4" />;
}

function ActivityRow({
  event,
  report,
}: {
  event: ClassifiedTokenActivity;
  report: LeviScanReport;
}) {
  const definition = CLASSIFICATION_LABELS[event.classification];
  return (
    <article className="levi-activity-row">
      <div className={`levi-activity-kind is-${event.classification}`}>
        <EventIcon event={event} />
        <span>{definition.label}</span>
      </div>
      <div className="levi-activity-amount">
        <strong>{groupDigits(event.targetAmount.formatted)}</strong>
        <span>{report.snapshot?.symbol || "tokens"}</span>
      </div>
      <div className="levi-activity-context">
        <span>{event.venue || "Direct token movement"}</span>
        <small>{formatTime(event.blockTime)}</small>
      </div>
      <div className="levi-activity-quote">
        {event.quoteAsset ? (
          <>
            <strong>{groupDigits(event.quoteAsset.delta.formatted)}</strong>
            <span>{event.quoteAsset.symbol}</span>
          </>
        ) : (
          <>
            <strong>{groupDigits(event.netSol)}</strong>
            <span>net SOL</span>
          </>
        )}
      </div>
      <div className="levi-activity-actions">
        <span className={`levi-confidence is-${event.confidence}`}>{event.confidence}</span>
        <a
          href={`https://solscan.io/tx/${event.signature}`}
          target="_blank"
          rel="noreferrer"
          title="Open transaction on Solscan"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open on Solscan</span>
        </a>
      </div>
    </article>
  );
}

export function ScanResult({
  report,
  canExtend = false,
  isExtending = false,
  onExtend,
}: ScanResultProps) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const pressure = report.distributionPressure;
  const snapshot = report.snapshot;
  const summary = report.tokenActivitySummaryV2;

  const saveInvestigation = async () => {
    if (!report.targetMint) return;
    setSaveState("saving");
    try {
      const response = await fetch("/api/portfolio/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWallet: report.wallet,
          tokenMint: report.targetMint,
          scanId: report.scanId,
        }),
      });
      if (!response.ok) throw new Error("Unable to save investigation");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  if (!snapshot || !summary || !pressure) {
    return (
      <section className="levi-scan-result mt-6">
        <div className="levi-scan-result-header">
          <div>
            <p className="levi-section-label"><ShieldAlert className="h-4 w-4" /> Creator history</p>
            <h2>{report.summary}</h2>
            <p>{report.createdTokenCount} mint signal(s) and {report.sellSignalCount} possible sell pattern(s) appeared in the observed window.</p>
          </div>
          <span className="levi-legacy-score">Legacy score {report.score}/100</span>
        </div>
        <div className="levi-creator-list">
          {report.createdTokens.length ? report.createdTokens.map((token) => (
            <a key={`${token.signature}:${token.mint}`} href={`https://solscan.io/tx/${token.signature}`} target="_blank" rel="noreferrer">
              <BadgeCheck className="h-4 w-4" />
              <span>{compactAddress(token.mint)}</span>
              <small>{token.instructionType}</small>
              <ChevronRight className="h-4 w-4" />
            </a>
          )) : <p>No mint initialization was found in the loaded window.</p>}
        </div>
      </section>
    );
  }

  const factors = [
    ["Authority control", pressure.factors.authorities, PRESSURE_FACTOR_MAXIMUMS.authorities],
    ["Wallet concentration", pressure.factors.concentration, PRESSURE_FACTOR_MAXIMUMS.concentration],
    ["Observed selling", pressure.factors.observedSelling, PRESSURE_FACTOR_MAXIMUMS.observedSelling],
    ["Repeated pattern", pressure.factors.repeatedPattern, PRESSURE_FACTOR_MAXIMUMS.repeatedPattern],
    ["Unknown outflow", pressure.factors.unknownOutflow, PRESSURE_FACTOR_MAXIMUMS.unknownOutflow],
  ] as const;

  return (
    <section className="levi-scan-result mt-6">
      <header className="levi-scan-result-header">
        <div>
          <div className={`levi-pressure-badge ${pressureTone[pressure.level]}`}>
            <ShieldAlert className="h-4 w-4" />
            {pressure.level === "insufficient" ? "Insufficient data" : `${pressure.level} pressure`}
          </div>
          <h2>{pressure.score === null ? "Evidence needs a larger window" : `${pressure.score}/100 distribution pressure`}</h2>
          <p>{pressure.summary}</p>
        </div>
        <div className="levi-scan-subject">
          <span>{snapshot.name || snapshot.symbol || "Inspected token"}</span>
          <code>{compactAddress(snapshot.mint)}</code>
          <small>{compactAddress(report.wallet)} / {pressure.confidence} confidence</small>
        </div>
      </header>

      <div className="levi-snapshot-grid">
        <div><WalletCards className="h-4 w-4" /><span>Current holding</span><strong>{groupDigits(snapshot.walletBalance.formatted)}</strong><small>{snapshot.symbol || "tokens"}</small></div>
        <div><Gauge className="h-4 w-4" /><span>Current supply share</span><strong>{snapshot.walletSharePercent === null ? "Unknown" : `${snapshot.walletSharePercent.toFixed(4)}%`}</strong><small>{snapshot.authoritiesRevoked ? "Authorities revoked" : "Authority review required"}</small></div>
        <div><ArrowUpRight className="h-4 w-4" /><span>Observed sold</span><strong>{groupDigits(summary.totalSold.formatted)}</strong><small>{summary.observedSellCount} high-confidence swap(s)</small></div>
        <div><Clock3 className="h-4 w-4" /><span>Latest observed sell</span><strong>{summary.latestSellAt ? new Date(summary.latestSellAt * 1000).toLocaleDateString() : "None found"}</strong><small>{snapshot.walletSol ? `${groupDigits(snapshot.walletSol)} SOL in wallet` : "SOL balance unavailable"}</small></div>
      </div>

      <div className="levi-pressure-layout">
        <section className="levi-pressure-factors" aria-labelledby="pressure-factors-title">
          <div className="levi-result-section-heading">
            <div><p className="levi-section-label">Transparent scoring</p><h3 id="pressure-factors-title">Pressure factors</h3></div>
            <span>{pressure.confidence} confidence</span>
          </div>
          {factors.map(([label, value, maximum]) => (
            <div key={label} className="levi-factor-row">
              <div><span>{label}</span><strong>{value}/{maximum}</strong></div>
              <div className="levi-factor-track"><span style={{ width: `${maximum > 0 ? (value / maximum) * 100 : 0}%` }} /></div>
            </div>
          ))}
        </section>
        <section className="levi-evidence-panel" aria-labelledby="evidence-title">
          <div className="levi-result-section-heading"><div><p className="levi-section-label">Human review</p><h3 id="evidence-title">What the evidence says</h3></div></div>
          <ul>
            {pressure.reasons.map((reason) => <li key={reason}><CheckCircle2 className="h-4 w-4" />{reason}</li>)}
            {pressure.unknowns.map((unknown) => <li key={unknown} className="is-unknown"><AlertTriangle className="h-4 w-4" />{unknown}</li>)}
          </ul>
        </section>
      </div>

      <section className="levi-activity-section" aria-labelledby="activity-title">
        <div className="levi-result-section-heading">
          <div><p className="levi-section-label">Observed window</p><h3 id="activity-title">Classified token activity</h3></div>
          <button type="button" className="levi-inline-action" onClick={saveInvestigation} disabled={saveState === "saving" || saveState === "saved"}>
            {saveState === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookmarkPlus className="h-4 w-4" />}
            {saveState === "saved" ? "Saved" : saveState === "error" ? "Retry save" : "Save to Portfolio"}
          </button>
        </div>
        <div className="levi-activity-list">
          {report.activityEvents?.length ? report.activityEvents.map((event) => (
            <ActivityRow key={event.id} event={event} report={report} />
          )) : <p className="levi-empty-state">No balance-changing transaction for this token was found in the loaded window.</p>}
        </div>
      </section>

      <footer className="levi-coverage-footer">
        <div>
          <Radar className="h-4 w-4" />
          <span>{report.scanCoverage.loadedTransactions}/{report.scanCoverage.selectedSignatures} transactions loaded</span>
          <span>{Math.round((report.scanCoverage.loadedRatio || 0) * 100)}% coverage</span>
          <span>{report.scanCoverage.rateLimited ? "RPC rate limited" : "No rate limit observed"}</span>
        </div>
        {canExtend && report.scanCoverage.nextCursor && onExtend ? (
          <button type="button" className="levi-inline-action" onClick={onExtend} disabled={isExtending}>
            {isExtending ? <Loader2 className="h-4 w-4 animate-spin" /> : <History className="h-4 w-4" />}
            {isExtending ? "Loading older window" : "Extend history"}
          </button>
        ) : null}
      </footer>
    </section>
  );
}
