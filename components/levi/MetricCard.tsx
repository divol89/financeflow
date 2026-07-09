import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: "green" | "red" | "cyan" | "amber" | "neutral";
}

const toneClasses = {
  green: "border-emerald-400/25 text-emerald-200",
  red: "border-red-400/25 text-red-200",
  cyan: "border-cyan-400/25 text-cyan-200",
  amber: "border-amber-400/25 text-amber-200",
  neutral: "border-white/10 text-slate-100",
};

export function MetricCard({
  label,
  value,
  icon,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <div className={`rounded-lg border bg-black/55 p-4 ${toneClasses[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase text-slate-400">{label}</p>
        {icon ? <div className="text-current">{icon}</div> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
