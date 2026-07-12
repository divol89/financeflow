import {
  BookOpenCheck,
  CheckCircle2,
  CircleHelp,
  Route,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { buildScannerChartGuide } from "@/lib/levi/scanner/chartGuide";

function GuideIcon({ tone }: { tone: string }) {
  if (tone === "positive") return <TrendingUp className="h-4 w-4" />;
  if (tone === "negative") return <TrendingDown className="h-4 w-4" />;
  if (tone === "cumulative") return <Route className="h-4 w-4" />;
  return <CircleHelp className="h-4 w-4" />;
}

export function ScannerChartGuide({
  routed,
  loadedTransactions,
  selectedSignatures,
}: {
  routed: boolean;
  loadedTransactions: number;
  selectedSignatures: number;
}) {
  const guide = buildScannerChartGuide(routed);
  const coverage =
    selectedSignatures > 0
      ? Math.round((loadedTransactions / selectedSignatures) * 100)
      : 0;

  return (
    <section className="levi-chart-guide" aria-labelledby="scanner-chart-guide-title">
      <header>
        <div>
          <p className="levi-section-label">
            <BookOpenCheck className="h-4 w-4" /> Chart guide
          </p>
          <h4 id="scanner-chart-guide-title">How to read this evidence</h4>
        </div>
        <span>{coverage}% transaction coverage</span>
      </header>

      <div className="levi-chart-guide-definitions">
        {guide.items.map((item) => (
          <article key={item.id} className={`is-${item.tone}`}>
            <GuideIcon tone={item.tone} />
            <div>
              <strong>{item.label}</strong>
              <p>{item.meaning}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="levi-chart-guide-usage">
        <strong>Use it in this order</strong>
        <ol>
          {guide.usage.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <p className="levi-chart-guide-limit">
        <CheckCircle2 className="h-4 w-4" />
        {guide.limitation}
      </p>
    </section>
  );
}
