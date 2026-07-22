import type { LeviAccessTier } from "@/types/levi";

const tierClasses: Record<LeviAccessTier, string> = {
  blocked: "border-slate-400/40 bg-slate-900/50 text-slate-100",
  basic: "border-amber-400/50 bg-amber-950/60 text-amber-100",
  full: "border-amber-400/50 bg-amber-950/60 text-amber-100",
};

export function AccessBadge({ tier }: { tier: LeviAccessTier }) {
  const label = tier === "blocked" ? "Sign in required" : "Open Access";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold ${tierClasses[tier]}`}
    >
      {label}
    </span>
  );
}
