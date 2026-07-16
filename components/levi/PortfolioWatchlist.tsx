import Link from "next/link";
import { ArrowRight, Eye, Trash2 } from "lucide-react";
import type { PortfolioWatchItem } from "@/types/portfolio";

function compact(value: string): string {
  return `${value.slice(0, 6)}...${value.slice(-5)}`;
}

export function PortfolioWatchlist({
  items,
  limit,
  onRemove,
}: {
  items: PortfolioWatchItem[];
  limit: number;
  onRemove(item: PortfolioWatchItem): Promise<void>;
}) {
  return (
    <section className="levi-portfolio-section" aria-labelledby="watchlist-title">
      <div className="levi-result-section-heading">
        <div><p className="levi-section-label">Saved research</p><h2 id="watchlist-title">Investigation watchlist</h2></div>
        <span>{items.length}/{limit}</span>
      </div>
      {limit <= 0 ? (
        <div className="levi-empty-state">Hold 3,000 K9 to save token investigations.</div>
      ) : items.length ? (
        <div className="levi-watchlist-grid">
          {items.map((item) => (
            <article key={item.id}>
              <div className="levi-watchlist-heading">
                <span><Eye className="h-4 w-4" /></span>
                <div><strong>{item.snapshot?.symbol || "Tracked token"}</strong><small>{compact(item.tokenMint)}</small></div>
                <span className={`levi-watch-pressure is-${item.pressure?.level || "insufficient"}`}>{item.pressure?.level || "unscored"}</span>
              </div>
              <dl>
                <div><dt>Wallet</dt><dd>{compact(item.targetWallet)}</dd></div>
                <div><dt>Holding</dt><dd>{item.snapshot?.walletBalance.formatted || "Unknown"}</dd></div>
                <div><dt>Pressure</dt><dd>{item.pressure?.score === null || item.pressure?.score === undefined ? "Insufficient" : `${item.pressure.score}/100`}</dd></div>
              </dl>
              <div className="levi-watchlist-actions">
                <Link href={`/scanner?wallet=${encodeURIComponent(item.targetWallet)}&token=${encodeURIComponent(item.tokenMint)}`}>Rescan <ArrowRight className="h-4 w-4" /></Link>
                <button type="button" onClick={() => void onRemove(item)} title="Remove investigation"><Trash2 className="h-4 w-4" /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="levi-empty-state">Save a wallet and token from Scanner to compare it here later.</div>
      )}
    </section>
  );
}
