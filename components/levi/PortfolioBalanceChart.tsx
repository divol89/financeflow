import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  PortfolioAssetId,
  PortfolioSnapshot,
} from "@/types/portfolio";

const assets: Array<{ id: PortfolioAssetId; label: string }> = [
  { id: "sol", label: "SOL" },
  { id: "levi-ai", label: "K9" },
];

const ranges = ["7D", "30D", "ALL"] as const;
type Range = (typeof ranges)[number];

function rangeStart(range: Range): number {
  if (range === "ALL") return 0;
  const days = range === "7D" ? 7 : 30;
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export function PortfolioBalanceChart({
  current,
  history,
  allowedHistoryDays,
}: {
  current: PortfolioSnapshot;
  history: PortfolioSnapshot[];
  allowedHistoryDays: number | null;
}) {
  const [assetId, setAssetId] = useState<PortfolioAssetId>("levi-ai");
  const [range, setRange] = useState<Range>(allowedHistoryDays === 7 ? "7D" : "30D");
  const effectiveRange: Range =
    allowedHistoryDays === 7 && range !== "7D" ? "7D" : range;
  const snapshots = useMemo(() => {
    const merged = [...history];
    if (!merged.some((item) => item.capturedAt === current.capturedAt)) merged.push(current);
    const minimum = rangeStart(effectiveRange);
    return merged
      .filter((snapshot) => new Date(snapshot.capturedAt).getTime() >= minimum)
      .sort((left, right) => left.capturedAt.localeCompare(right.capturedAt))
      .map((snapshot) => {
        const asset = snapshot.assets.find((item) => item.id === assetId);
        return {
          time: new Date(snapshot.capturedAt).getTime(),
          value: Number(asset?.formatted || 0),
        };
      });
  }, [assetId, current, effectiveRange, history]);
  const selectedAsset = assets.find((asset) => asset.id === assetId)!;

  return (
    <section className="levi-portfolio-chart" aria-labelledby="portfolio-chart-title">
      <div className="levi-result-section-heading">
        <div>
          <p className="levi-section-label">Balance history</p>
          <h2 id="portfolio-chart-title">{selectedAsset.label} balance</h2>
        </div>
        <div className="levi-chart-controls">
          <div className="levi-segmented-control is-compact" aria-label="Chart asset">
            {assets.map((asset) => (
              <button key={asset.id} type="button" onClick={() => setAssetId(asset.id)} className={assetId === asset.id ? "is-active" : ""}>{asset.label}</button>
            ))}
          </div>
          <div className="levi-segmented-control is-compact" aria-label="Chart range">
            {ranges.map((item) => (
              <button key={item} type="button" disabled={allowedHistoryDays === 7 && item !== "7D"} onClick={() => setRange(item)} className={effectiveRange === item ? "is-active" : ""}>{item}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="levi-chart-frame">
        {snapshots.length < 2 ? (
          <div className="levi-chart-empty">
            <strong>History starts here.</strong>
            <span>A new point is stored when an on-chain balance changes.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={snapshots} margin={{ top: 12, right: 20, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="leviPortfolioArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb000" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ffb000" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,226,178,0.08)" vertical={false} />
              <XAxis dataKey="time" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })} stroke="#9d8d80" tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis width={72} stroke="#9d8d80" tickLine={false} axisLine={false} tickFormatter={(value) => Number(value).toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 2 })} />
              <Tooltip labelFormatter={(value) => new Date(Number(value)).toLocaleString()} formatter={(value) => [Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 }), selectedAsset.label]} contentStyle={{ background: "#160502", border: "1px solid rgba(255,176,0,.24)", borderRadius: 6 }} />
              <Area type="monotone" dataKey="value" stroke="#ffb000" strokeWidth={2} fill="url(#leviPortfolioArea)" activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
