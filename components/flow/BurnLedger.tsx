import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Coins,
  ExternalLink,
  Flame,
  Layers3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useBurnLedger } from "@/hooks/useBurnLedger";
import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type {
  BurnLedgerEvent,
  BurnLedgerTokenSummary,
} from "@/types/burnLedger";

function tokenLabel(token: Pick<BurnLedgerTokenSummary, "name" | "symbol" | "mint">) {
  if (token.name && token.symbol && token.name.toLowerCase() !== token.symbol.toLowerCase()) {
    return `${token.name} (${token.symbol})`;
  }
  return token.name || token.symbol || truncateSolanaAddress(token.mint, 5);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function BurnTokenRow({ token }: { token: BurnLedgerTokenSummary }) {
  return (
    <article className="flow-burn-token-row">
      <div className="flow-burn-token-identity">
        <span aria-hidden="true"><Flame className="h-4 w-4" /></span>
        <div>
          <strong>{tokenLabel(token)}</strong>
          <code>{truncateSolanaAddress(token.mint, 6)}</code>
        </div>
      </div>
      <div>
        <small>Burned through portal</small>
        <strong>
          {formatRawTokenAmount(token.totalBurnedRaw, token.decimals, 6)}{" "}
          {token.symbol || "tokens"}
        </strong>
      </div>
      <div>
        <small>Verified events</small>
        <strong>{token.burnCount}</strong>
      </div>
      <a href={token.tokenUrl} target="_blank" rel="noreferrer" aria-label={`Open ${tokenLabel(token)} on Solscan`}>
        <ExternalLink className="h-4 w-4" />
      </a>
    </article>
  );
}

function BurnEventRow({ event }: { event: BurnLedgerEvent }) {
  return (
    <article className="flow-burn-event-row">
      <div>
        <strong>{tokenLabel(event)}</strong>
        <span>{formatTime(event.occurredAt)}</span>
      </div>
      <div>
        <strong>
          {formatRawTokenAmount(event.amountRaw, event.decimals, 6)}{" "}
          {event.symbol || "tokens"}
        </strong>
        <span>by {truncateSolanaAddress(event.wallet, 4)}</span>
      </div>
      <a href={event.solscanUrl} target="_blank" rel="noreferrer">
        Solscan <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

export function BurnLedger() {
  const { data, isLoading, error, refresh } = useBurnLedger();
  const latest = data?.events[0] || null;
  const totalEvents = data?.tokens.reduce((total, token) => total + token.burnCount, 0) || 0;

  return (
    <section id="live-burn-ledger" className="flow-burn-ledger" aria-labelledby="flow-burn-ledger-title">
      <header className="flow-section-heading">
        <div>
          <p className="flow-kicker"><Flame className="h-4 w-4" /> Live burn ledger</p>
          <h2 id="flow-burn-ledger-title">Every token keeps its own story.</h2>
          <p>
            Verified burns recorded by Flow-Finance Adventures are grouped
            by mint. Token units are never combined into a misleading global total.
          </p>
        </div>
        <Link href="/burn" className="flow-primary-button">
          Burn a token <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="flow-burn-ledger-metrics">
        <div><ShieldCheck className="h-4 w-4" /><span>Verified burns</span><strong>{totalEvents}</strong></div>
        <div><Layers3 className="h-4 w-4" /><span>Tokens represented</span><strong>{data?.tokens.length || 0}</strong></div>
        <div><Clock3 className="h-4 w-4" /><span>Latest portal burn</span><strong>{latest ? formatTime(latest.occurredAt) : "Awaiting first burn"}</strong></div>
      </div>

      {isLoading && !data ? (
        <div className="flow-burn-ledger-state" role="status">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading verified burns.
        </div>
      ) : error && !data ? (
        <div className="flow-burn-ledger-state is-error">
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()}><RefreshCw className="h-4 w-4" /> Retry</button>
        </div>
      ) : data && data.tokens.length > 0 ? (
        <div className="flow-burn-ledger-layout">
          <div>
            <p className="flow-burn-ledger-label"><Coins className="h-4 w-4" /> Totals by token</p>
            <div className="flow-burn-token-list">
              {data.tokens.map((token) => <BurnTokenRow key={token.mint} token={token} />)}
            </div>
          </div>
          <div>
            <p className="flow-burn-ledger-label"><Clock3 className="h-4 w-4" /> Recent events</p>
            <div className="flow-burn-event-list">
              {data.events.slice(0, 8).map((event) => <BurnEventRow key={`${event.mint}:${event.signature}`} event={event} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flow-burn-ledger-empty">
          <Flame className="h-5 w-5" />
          <div><strong>The ledger is ready.</strong><p>The first finalized portal burn will appear here automatically.</p></div>
        </div>
      )}

      <footer>
        <ShieldCheck className="h-4 w-4" />
        Recorded by this portal since ledger launch. Historical burns are not backfilled or inferred.
      </footer>
    </section>
  );
}
