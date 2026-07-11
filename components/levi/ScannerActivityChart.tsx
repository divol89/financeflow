import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowDownLeft, ArrowUpRight, MoveRight, Repeat2 } from "lucide-react";
import type { ClassifiedTokenActivity, ScanCoverage, TokenActivitySummaryV2 } from "@/types/levi";
import { buildScannerActivityChart } from "@/lib/levi/scanner/activityChart";

function compactNumber(value: number): string {
  return Number(value).toLocaleString(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  });
}

function exactNumber(value: string): string {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function ScannerActivityChart({
  events,
  summary,
  coverage,
  symbol,
}: {
  events: ClassifiedTokenActivity[];
  summary: TokenActivitySummaryV2;
  coverage: ScanCoverage;
  symbol: string;
}) {
  const model = useMemo(() => buildScannerActivityChart(events), [events]);
  const hasTransactionCoverage = coverage.loadedTransactions > 0;
  const hasRoutedFlow = summary.routedCount > 0;

  return (
    <section className="levi-scanner-activity-chart" aria-labelledby="scanner-activity-chart-title">
      <header className="levi-scanner-chart-header">
        <div>
          <p className="levi-section-label"><Activity className="h-4 w-4" /> On-chain behavior timeline</p>
          <h3 id="scanner-activity-chart-title">
            {hasRoutedFlow ? "Routed volume and token flow" : "Buys, sells and token flow"}
          </h3>
          <p>
            {hasRoutedFlow
              ? "Gross route volume is recovered from parsed token instructions even when the account ends the transaction at zero."
              : "Each point comes from the same parsed transactions used by the evidence table below."}
          </p>
        </div>
        <div className={`levi-scanner-posture is-${model.posture.tone}`}>
          <span>Observed posture</span>
          <strong>{model.posture.label}</strong>
          <small>{model.posture.summary}</small>
        </div>
      </header>

      <div className="levi-scanner-chart-stats">
        <div><ArrowDownLeft className="h-4 w-4" /><span>Verified buys</span><strong>{hasTransactionCoverage ? `${exactNumber(summary.totalBought.formatted)} ${symbol}` : "Not established"}</strong><small>{hasTransactionCoverage ? `${summary.buyCount} transaction(s)` : "No transaction coverage"}</small></div>
        <div><ArrowUpRight className="h-4 w-4" /><span>Verified sells</span><strong>{hasTransactionCoverage ? `${exactNumber(summary.totalSold.formatted)} ${symbol}` : "Not established"}</strong><small>{hasTransactionCoverage ? `${summary.observedSellCount} transaction(s)` : "No transaction coverage"}</small></div>
        {hasRoutedFlow ? (
          <div><Repeat2 className="h-4 w-4" /><span>Routed volume</span><strong>{`${exactNumber(summary.totalRouted.formatted)} ${symbol}`}</strong><small>{`${summary.routedCount} balanced route(s)`}</small></div>
        ) : (
          <div><MoveRight className="h-4 w-4" /><span>Unproven outflow</span><strong>{hasTransactionCoverage ? `${exactNumber(summary.possibleOutflow.formatted)} ${symbol}` : "Not established"}</strong><small>{hasTransactionCoverage ? "Transfers remain separate from sales" : "No transaction coverage"}</small></div>
        )}
      </div>

      <div className="levi-scanner-chart-frame">
        {model.points.length === 0 ? (
          <div className="levi-chart-empty">
            <strong>No target-token movement loaded.</strong>
            <span>The RPC returned no balance-changing transaction for this wallet and mint in the observed window.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={model.points} margin={{ top: 18, right: 16, bottom: 8, left: 4 }}>
              <CartesianGrid stroke="rgba(222,246,220,0.08)" vertical={false} />
              <XAxis dataKey="timeLabel" stroke="#718071" tickLine={false} axisLine={false} minTickGap={38} tick={{ fontSize: 10 }} />
              <YAxis width={64} stroke="#718071" tickLine={false} axisLine={false} tickFormatter={compactNumber} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value, name) => [
                  Math.abs(Number(value)).toLocaleString(undefined, { maximumFractionDigits: 6 }),
                  name,
                ]}
                contentStyle={{ background: "#0b0f0a", border: "1px solid rgba(184,243,107,.24)", borderRadius: 6 }}
                labelStyle={{ color: "#dce7d8" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9eaa9b" }} />
              <ReferenceLine y={0} stroke="rgba(222,246,220,0.2)" />
              <Bar dataKey="buy" name="Verified buy" fill="#7ee3b8" maxBarSize={14} />
              <Bar dataKey="sell" name="Verified sell" fill="#ff7569" maxBarSize={14} />
              <Bar dataKey="otherFlow" name="Transfer / other" fill="#7a8791" maxBarSize={10} />
              <Bar dataKey="routed" name="Routed volume" fill="#69d7df" maxBarSize={12} />
              <Bar dataKey="burn" name="Burn" fill="#e9c66c" maxBarSize={10} />
              <Line type="monotone" dataKey="cumulativeNet" name="Cumulative net flow" stroke="#b8f36b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <footer>
        <span>{coverage.loadedTransactions}/{coverage.selectedSignatures} transactions loaded</span>
        <span>{model.buyCount + model.sellCount} verified trade(s)</span>
        {model.routedCount > 0 ? <span>{model.routedCount} routed transaction(s)</span> : null}
        <span>{model.otherMovementCount} other movement(s)</span>
        <span>Cached for up to 10 minutes</span>
      </footer>
    </section>
  );
}
