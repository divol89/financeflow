import {
  AlertTriangle,
  BadgeCheck,
  Gauge,
  Radar,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { LeviScanReport } from "@/types/levi";
import { MetricCard } from "./MetricCard";

const tierTone = {
  low: "text-emerald-300 border-emerald-400/40 bg-emerald-950/50",
  medium: "text-amber-200 border-amber-400/40 bg-amber-950/50",
  high: "text-red-200 border-red-400/40 bg-red-950/50",
  critical: "text-red-100 border-red-500/60 bg-red-950/80",
};

function formatAmount(value: number, maximumFractionDigits = 4): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

function formatSignedAmount(value: number, maximumFractionDigits = 4): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits,
    signDisplay: "exceptZero",
  });
}

export function ScanResult({ report }: { report: LeviScanReport }) {
  const hasTargetMint = Boolean(report.targetMint);
  const tokenSummary = report.tokenActivitySummary;

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-black/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold uppercase ${tierTone[report.tier]}`}
          >
            <ShieldAlert className="h-4 w-4" />
            {report.tier} risk
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Score {report.score}/100
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {report.summary}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-mono text-xs text-slate-500">{report.wallet}</p>
          <p className="mt-2">Generated {new Date(report.generatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hasTargetMint ? (
          <>
            <MetricCard
              label="Token Moves"
              value={String(tokenSummary?.movementCount || 0)}
              icon={<Radar className="h-4 w-4" />}
              tone="cyan"
            />
            <MetricCard
              label="Largest Out"
              value={formatAmount(tokenSummary?.largestOut || 0)}
              icon={<TrendingDown className="h-4 w-4" />}
              tone="red"
            />
            <MetricCard
              label="Largest In"
              value={formatAmount(tokenSummary?.largestIn || 0)}
              icon={<TrendingUp className="h-4 w-4" />}
              tone="green"
            />
            <MetricCard
              label="Net Token Flow"
              value={formatSignedAmount(tokenSummary?.netTokenDelta || 0)}
              icon={<Gauge className="h-4 w-4" />}
              tone={(tokenSummary?.netTokenDelta || 0) < 0 ? "red" : "green"}
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Created Mints"
              value={String(report.createdTokenCount)}
              icon={<BadgeCheck className="h-4 w-4" />}
              tone="amber"
            />
            <MetricCard
              label="Sell Signals"
              value={String(report.sellSignalCount)}
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="red"
            />
            <MetricCard
              label="Risk Score"
              value={String(report.score)}
              icon={<ShieldAlert className="h-4 w-4" />}
              tone={report.score >= 50 ? "red" : "green"}
            />
            <MetricCard
              label="Loaded Tx"
              value={String(report.scanCoverage.loadedTransactions)}
              icon={<Gauge className="h-4 w-4" />}
              tone="neutral"
            />
          </>
        )}
      </div>

      {report.createdTokens.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
            Created Mint Signals
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black/60 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mint</th>
                  <th className="px-4 py-3">Instruction</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {report.createdTokens.map((signal) => (
                  <tr key={`${signal.signature}:${signal.mint}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {signal.mint}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {signal.instructionType}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{signal.slot}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {signal.signature}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {report.targetMint ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">
              Specific Token Activity
            </p>
            <p className="mt-1 break-all font-mono text-xs text-slate-500">
              {report.targetMint}
            </p>
          </div>
          {report.tokenActivitySignals?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/60 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Direction</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Token Delta</th>
                    <th className="px-4 py-3">SOL Delta</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {report.tokenActivitySignals.map((signal) => (
                    <tr key={`${signal.signature}:${signal.direction}`}>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold uppercase ${
                            signal.direction === "in"
                              ? "border-emerald-400/30 bg-emerald-950/50 text-emerald-200"
                              : "border-red-400/30 bg-red-950/50 text-red-200"
                          }`}
                        >
                          {signal.direction === "in" ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {signal.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">
                        {formatAmount(signal.tokenAmountAbs)}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          signal.tokenDelta >= 0
                            ? "text-emerald-200"
                            : "text-red-200"
                        }`}
                      >
                        {formatSignedAmount(signal.tokenDelta)}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          signal.solDelta >= 0
                            ? "text-emerald-200"
                            : "text-red-200"
                        }`}
                      >
                        {formatSignedAmount(signal.solDelta, 6)}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {signal.blockTime
                          ? new Date(signal.blockTime * 1000).toLocaleString()
                          : "Unknown"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {signal.signature}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-5 text-sm text-slate-400">
              No balance-changing transactions for this mint were found in the scanned window.
            </p>
          )}
        </div>
      ) : null}

      {report.sellSignals.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          <div className="border-b border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
            Possible Creator Sell Signals
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-black/60 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mint</th>
                  <th className="px-4 py-3">Token Delta</th>
                  <th className="px-4 py-3">SOL Delta</th>
                  <th className="px-4 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {report.sellSignals.map((signal) => (
                  <tr key={`${signal.signature}:${signal.mint}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {signal.mint}
                    </td>
                    <td className="px-4 py-3 text-red-200">
                      {signal.tokenDelta.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-emerald-200">
                      +{signal.solDelta.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {signal.confidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Scan Coverage</p>
        <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-slate-500">Source</p>
            <p className="mt-1 font-medium">
              {report.scanCoverage.source === "wallet-and-token-accounts"
                ? "Wallet + token accounts"
                : "Wallet only"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Token Accounts</p>
            <p className="mt-1 font-medium">{report.scanCoverage.tokenAccounts}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Selected / Loaded</p>
            <p className="mt-1 font-medium">
              {report.scanCoverage.selectedSignatures} /{" "}
              {report.scanCoverage.loadedTransactions}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Rate Limited</p>
            <p className="mt-1 font-medium">
              {report.scanCoverage.rateLimited ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Limitations</p>
        <ul className="mt-3 grid gap-2 text-sm text-slate-400">
          {report.limitations.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
