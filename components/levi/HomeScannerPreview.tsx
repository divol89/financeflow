import Link from "next/link";
import { ArrowRight, Eye, Repeat2, ShieldCheck } from "lucide-react";

const steps = [
  { icon: Eye, label: "Current position", detail: "Holdings and supply share" },
  { icon: Repeat2, label: "Classified activity", detail: "Swaps separated from transfers" },
  { icon: ShieldCheck, label: "Visible evidence", detail: "Pressure, confidence and coverage" },
];

export function HomeScannerPreview() {
  return (
    <section className="levi-home-scanner-preview" aria-labelledby="home-scanner-title">
      <div>
        <p className="levi-section-label"><Eye className="h-4 w-4" /> LEVI Sentinel Scanner</p>
        <h2 id="home-scanner-title">Inspect behavior without calling every outflow a sale.</h2>
        <p>Review one wallet and token through exact balances, classified movements and an explicit evidence window.</p>
        <Link href="/scanner" className="levi-primary-button">Run evidence scan <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="levi-home-scanner-steps">
        {steps.map(({ icon: Icon, label, detail }, index) => (
          <article key={label}><span>0{index + 1}</span><Icon className="h-5 w-5" /><strong>{label}</strong><small>{detail}</small></article>
        ))}
      </div>
    </section>
  );
}
