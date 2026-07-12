import { useEffect } from "react";
import {
  Bot,
  Coins,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import { usePortfolio } from "@/hooks/usePortfolio";
import { AccessBadge } from "./AccessBadge";
import { LeviAuthPanel } from "./LeviAuthPanel";
import { PortfolioBalanceChart } from "./PortfolioBalanceChart";
import { PortfolioActivityFeed } from "./PortfolioActivityFeed";
import { PortfolioWatchlist } from "./PortfolioWatchlist";
import { DecisionJournal } from "./DecisionJournal";
import { PortfolioDataCoverage } from "./PortfolioDataCoverage";

function groupDigits(value: string): string {
  const [whole, fraction] = value.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${grouped}${fraction ? `.${fraction}` : ""}`;
}

export function PortfolioDashboard() {
  const auth = useLeviAuth();
  const portfolio = usePortfolio();
  const refreshPortfolio = portfolio.refresh;

  useEffect(() => {
    if (auth.session?.wallet) void refreshPortfolio();
  }, [auth.session?.wallet, refreshPortfolio]);

  if (auth.isLoading) {
    return <div className="levi-portfolio-loading"><RefreshCw className="h-5 w-5 animate-spin" /> Reading signed session</div>;
  }

  if (!auth.session) {
    return (
      <div className="levi-portfolio-access">
        <div>
          <p className="levi-section-label"><LockKeyhole className="h-4 w-4" /> Private workspace</p>
          <h2>Sign in to open your Portfolio.</h2>
          <p>Wallet ownership is proven with a message signature. No transaction, token approval or custody is requested.</p>
        </div>
        <LeviAuthPanel />
      </div>
    );
  }

  if (!portfolio.data) {
    return (
      <div className="levi-portfolio-loading is-error">
        {portfolio.isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <WalletCards className="h-5 w-5" />}
        <span>{portfolio.error || "Loading current on-chain balances"}</span>
        {!portfolio.isLoading ? <button type="button" className="levi-inline-action" onClick={() => void portfolio.refresh()}>Retry</button> : null}
      </div>
    );
  }

  const { data } = portfolio;
  const iconById = {
    sol: <WalletCards className="h-5 w-5" />,
    levi: <ShieldCheck className="h-5 w-5" />,
    "levi-ai": <Bot className="h-5 w-5" />,
  };

  return (
    <div className="levi-portfolio-dashboard">
      <header className="levi-portfolio-overview">
        <div>
          <p className="levi-section-label"><Coins className="h-4 w-4" /> Signed wallet overview</p>
          <h2>Your project balances, without price fiction.</h2>
          <p>Quantity history begins when this Portfolio first observes a change.</p>
        </div>
        <div className="levi-portfolio-overview-actions">
          <AccessBadge tier={data.access.tier} />
          <button type="button" className="levi-inline-action" onClick={() => void portfolio.refresh()} disabled={portfolio.isLoading}>
            <RefreshCw className={`h-4 w-4${portfolio.isLoading ? " animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {data.persistenceMessage ? <p className="levi-persistence-warning">{data.persistenceMessage}</p> : null}

      <div className="levi-portfolio-balance-grid">
        {data.current.assets.map((asset) => (
          <article key={asset.id}>
            <span className="levi-portfolio-asset-icon">{iconById[asset.id]}</span>
            <div><span>{asset.name}</span><strong>{groupDigits(asset.formatted)}</strong><small>{asset.symbol}</small></div>
          </article>
        ))}
      </div>

      <PortfolioDataCoverage coverage={data.coverage} />

      <PortfolioBalanceChart current={data.current} history={data.history} allowedHistoryDays={data.access.limits.portfolioHistoryDays} />

      <div className="levi-portfolio-columns">
        <PortfolioActivityFeed activity={data.activity} coverage={data.coverage} />
        <PortfolioWatchlist items={data.watchlist} limit={data.access.limits.watchlistLimit} onRemove={portfolio.removeWatchItem} />
      </div>

      <DecisionJournal entries={data.journal} limit={data.access.limits.journalLimit} onSave={portfolio.saveJournalEntry} onDelete={portfolio.removeJournalEntry} />
    </div>
  );
}
