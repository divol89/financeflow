import { ArrowDownLeft, ArrowUpRight, ExternalLink, Radar } from "lucide-react";
import type { PortfolioActivity } from "@/types/portfolio";
import { CLASSIFICATION_LABELS } from "@/lib/levi/scanner/methodology";

function labelFor(event: PortfolioActivity): string {
  if (event.classification === "sol_in") return "SOL in";
  if (event.classification === "sol_out") return "SOL out";
  return CLASSIFICATION_LABELS[event.classification].label;
}

export function PortfolioActivityFeed({ activity }: { activity: PortfolioActivity[] }) {
  return (
    <section className="levi-portfolio-section" aria-labelledby="portfolio-activity-title">
      <div className="levi-result-section-heading">
        <div><p className="levi-section-label">On-chain movements</p><h2 id="portfolio-activity-title">Recent project activity</h2></div>
        <span>{activity.length} tracked event{activity.length === 1 ? "" : "s"}</span>
      </div>
      <div className="levi-portfolio-activity-list">
        {activity.length ? activity.map((event) => {
          const incoming = event.classification === "buy" || event.classification === "transfer_in" || event.classification === "mint" || event.classification === "sol_in";
          return (
            <article key={event.id}>
              <span className={`levi-portfolio-activity-icon ${incoming ? "is-in" : "is-out"}`}>
                {incoming ? <ArrowDownLeft className="h-4 w-4" /> : event.classification === "liquidity" ? <Radar className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
              <div><strong>{labelFor(event)}</strong><small>{event.venue || "Direct movement"}</small></div>
              <div className="levi-portfolio-activity-value"><strong>{event.amountFormatted}</strong><small>{event.assetSymbol}</small></div>
              <time>{event.blockTime ? new Date(event.blockTime * 1000).toLocaleString() : "Unknown time"}</time>
              <a href={event.solscanUrl} target="_blank" rel="noreferrer" title="Open on Solscan"><ExternalLink className="h-4 w-4" /></a>
            </article>
          );
        }) : <div className="levi-empty-state">No LEVI, LEVI AI or material SOL movement has been tracked yet.</div>}
      </div>
    </section>
  );
}
