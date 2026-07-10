import { Activity, ArrowRight, Radar, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  { label: "Solana activity", detail: "Wallets, transfers and public transactions", icon: Activity },
  { label: "Signal processing", detail: "Structured on-chain data and patterns", icon: Radar },
  { label: "AI-assisted insights", detail: "Context that is easier to review", icon: Sparkles },
  { label: "Human decision", detail: "Research, judgment and responsibility", icon: ShieldCheck },
];

export function WhitepaperFlow() {
  return (
    <div className="levi-docs-flow" role="img" aria-label="Solana activity flows through signal processing and AI-assisted insights before a human decision">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div className="levi-docs-flow-step" key={step.label}>
            <div className="levi-docs-flow-icon"><Icon className="h-4 w-4" /></div>
            <span>0{index + 1}</span>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
            {index < steps.length - 1 ? <ArrowRight className="levi-docs-flow-arrow" aria-hidden="true" /> : null}
          </div>
        );
      })}
    </div>
  );
}
