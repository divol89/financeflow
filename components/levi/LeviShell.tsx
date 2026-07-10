import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Dice5,
  FileText,
  Gauge,
  GraduationCap,
  Megaphone,
  Menu,
  Radar,
  ShieldCheck,
  X,
} from "lucide-react";

const primaryNavItems = [
  { href: "/scanner", label: "Scanner", icon: Radar },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/token-gate", label: "Token Gate", icon: ShieldCheck },
];

const secondaryNavItems = [
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/methodology", label: "Methodology", icon: Gauge },
  { href: "/docs", label: "Docs", icon: FileText },
  { href: "/contest", label: "LEVI Social", icon: Megaphone },
  { href: "/games/levi-dice", label: "LEVI Dice", icon: Dice5 },
];

const navItems = [...primaryNavItems, ...secondaryNavItems];

export function LeviShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="levi-site min-h-screen text-white">
      <header className={`levi-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="levi-container flex h-[4.75rem] items-center justify-between">
          <Link href="/" className="levi-brand" aria-label="LEVI Sentinel home">
            <span className="levi-brand-mark">
              <img src="/levi-avatar.png" alt="" />
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-300/80">
                Flow Finance
              </span>
              <span className="block text-[0.98rem] font-semibold text-white sm:text-lg">
                LEVI Sentinel
              </span>
            </span>
          </Link>

          <nav className="levi-nav-shell hidden xl:flex" aria-label="Primary navigation">
            <div className="levi-nav-group">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`levi-nav-item ${active ? "is-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <span className="levi-nav-divider" aria-hidden="true" />
            <div className="levi-nav-group is-utility">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`levi-nav-item ${active ? "is-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <Link
            href="/token-gate"
            className="levi-shell-cta hidden xl:inline-flex"
          >
            Connect LEVI
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="levi-menu-button inline-flex xl:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="levi-mobile-panel xl:hidden">
            <div className="levi-container grid gap-1 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`levi-mobile-item ${active ? "is-active" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/token-gate"
                onClick={() => setOpen(false)}
                className="levi-shell-cta mt-3 flex justify-center"
              >
                Connect LEVI
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="levi-footer">
        <div className="levi-container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-300" />
            <span>Signals are heuristic and require human review.</span>
          </div>
          <Link href="/games/levi-dice" className="levi-footer-link">
            LEVI Dice Solana preview
          </Link>
        </div>
      </footer>
    </div>
  );
}
