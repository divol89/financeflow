import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: "green" | "red" | "cyan" | "amber" | "neutral";
}

const toneClasses = {
  green: "levi-tone-green",
  red: "levi-tone-red",
  cyan: "levi-tone-cyan",
  amber: "levi-tone-amber",
  neutral: "levi-tone-neutral",
};

export function MetricCard({
  label,
  value,
  icon,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <div className={`levi-metric ${toneClasses[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="levi-metric-label">{label}</p>
        {icon ? <div className="text-current">{icon}</div> : null}
      </div>
      <p className="levi-metric-value">{value}</p>
    </div>
  );
}
