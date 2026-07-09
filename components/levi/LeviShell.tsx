import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Dice5,
  FileText,
  Gauge,
  Menu,
  Radar,
  ShieldCheck,
  X,
} from "lucide-react";

const navItems = [
  { href: "/scanner", label: "Scanner", icon: Radar },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/token-gate", label: "Token Gate", icon: ShieldCheck },
  { href: "/methodology", label: "Methodology", icon: Gauge },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/games", label: "Crazy Dice", icon: Dice5 },
  { href: "/games/levi-dice", label: "LEVI Dice", icon: Dice5 },
];

export function LeviShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050705] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-400/40 bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </span>
            <span className="text-base font-semibold text-white sm:text-lg">
              LEVI Sentinel
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-white text-black"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/token-gate"
            className="hidden rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-300 lg:inline-flex"
          >
            Connect LEVI
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white lg:hidden"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-white/10 bg-black px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/token-gate"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center rounded-md bg-emerald-400 px-4 py-3 text-sm font-semibold text-black"
              >
                Connect LEVI
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black px-4 py-8 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-300" />
            <span>Signals are heuristic and require human review.</span>
          </div>
          <Link href="/games/levi-dice" className="text-emerald-300 hover:text-emerald-200">
            LEVI Dice Solana preview
          </Link>
        </div>
      </footer>
    </div>
  );
}
