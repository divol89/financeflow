import type { LeviAccessTier } from "@/types/levi";

const tierClasses: Record<LeviAccessTier, string> = {
  blocked: "border-red-500/50 bg-red-950/60 text-red-100",
  basic: "border-amber-400/50 bg-amber-950/60 text-amber-100",
  full: "border-emerald-400/50 bg-emerald-950/60 text-emerald-100",
};

export function AccessBadge({ tier }: { tier: LeviAccessTier }) {
  const label =
    tier === "full" ? "Full Access" : tier === "basic" ? "Basic Access" : "Locked";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold ${tierClasses[tier]}`}
    >
      {label}
    </span>
  );
}
