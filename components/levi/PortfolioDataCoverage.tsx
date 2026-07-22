import { Activity, Clock3, Database, History } from "lucide-react";
import type { PortfolioDataCoverage as Coverage } from "@/types/portfolio";

const activityLabels = {
  live: "Live",
  partial: "Partial",
  cached: "Stored",
  unavailable: "Unavailable",
  locked: "Locked",
} as const;

function refreshedLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function PortfolioDataCoverage({ coverage }: { coverage: Coverage }) {
  return (
    <section className="levi-portfolio-coverage" aria-labelledby="portfolio-coverage-title">
      <header>
        <div>
          <p className="levi-section-label"><Database className="h-4 w-4" /> Data delivery</p>
          <h3 id="portfolio-coverage-title">What reached this Portfolio</h3>
        </div>
        <span className={`is-${coverage.activityStatus}`}>
          Activity {activityLabels[coverage.activityStatus]}
        </span>
      </header>
      <div>
        <article>
          <Database className="h-4 w-4" />
          <span>Balances</span>
          <strong>Live</strong>
          <small>SOL and configured Solana tokens</small>
        </article>
        <article>
          <Activity className="h-4 w-4" />
          <span>Activity window</span>
          <strong>{coverage.loadedTransactions}/{coverage.selectedSignatures}</strong>
          <small>transactions loaded</small>
        </article>
        <article>
          <History className="h-4 w-4" />
          <span>Balance history</span>
          <strong>{coverage.historyPoints}</strong>
          <small>stored snapshot{coverage.historyPoints === 1 ? "" : "s"}</small>
        </article>
        <article>
          <Clock3 className="h-4 w-4" />
          <span>Refreshed</span>
          <strong>{refreshedLabel(coverage.refreshedAt)}</strong>
          <small>signed wallet session</small>
        </article>
      </div>
      <p>{coverage.activityMessage}</p>
    </section>
  );
}
