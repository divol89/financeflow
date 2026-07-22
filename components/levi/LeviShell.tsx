import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  Dice5,
  FileText,
  Flame,
  GraduationCap,
  LogOut,
  Megaphone,
  Menu,
  Moon,
  Radar,
  Search,
  ShieldCheck,
  Sun,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import { useFlowTheme } from "@/hooks/useFlowTheme";
import { CommunityBurnBanner } from "@/components/levi/CommunityBurnBanner";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { WalletAccessSheet } from "@/components/levi/WalletAccessSheet";
import {
  FLOW_FINANCE_IMAGE_PATH,
  FLOW_FINANCE_NAME,
} from "@/lib/flowFinance/brand";

const directNavItems = [
  { href: "/scanner", label: "Scanner", icon: Radar },
  { href: "/token-sniffer", label: "Token Sniffer", icon: Search },
  { href: "/burn", label: "Burn Studio", icon: Flame },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
];

const communityItems = [
  { href: "/contest", label: "Social Quests", detail: "Current token campaign", icon: Megaphone },
  { href: "/games/levi-dice", label: "Adventure Arcade", detail: "Explore a live token game", icon: Dice5 },
];

const learningItems = [
  { href: "/learn", label: "Education", detail: "Markets and holder mechanics", icon: GraduationCap },
  { href: "/methodology", label: "Methodology", detail: "How signals are classified", icon: ShieldCheck },
  { href: "/docs", label: "Docs", detail: "Project vision and roadmap", icon: FileText },
];

function pathActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LeviShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const auth = useLeviAuth();
  const { theme, toggleTheme } = useFlowTheme();
  const [open, setOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollRoot = document.getElementById("__next");
    const handleScroll = () => {
      setScrolled(Math.max(window.scrollY, scrollRoot?.scrollTop ?? 0) > 18);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollRoot?.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollRoot?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const closeMenu = () => {
      setOpen(false);
      setAccessOpen(false);
    };
    router.events.on("routeChangeStart", closeMenu);
    router.events.on("hashChangeStart", closeMenu);
    return () => {
      router.events.off("routeChangeStart", closeMenu);
      router.events.off("hashChangeStart", closeMenu);
    };
  }, [router.events]);

  useEffect(() => {
    if (router.isReady && router.query.access === "1") setAccessOpen(true);
  }, [router.isReady, router.query.access]);

  async function handleLogout() {
    setOpen(false);
    await auth.logout();
  }

  const renderMenu = (
    label: string,
    icon: typeof Users,
    items: typeof communityItems | typeof learningItems
  ) => {
    const Icon = icon;
    const active = items.some((item) => pathActive(router.pathname, item.href));
    return (
      <details className={`levi-nav-menu${active ? " is-active" : ""}`}>
        <summary className="levi-nav-item"><Icon className="h-4 w-4" />{label}<ChevronDown className="h-3.5 w-3.5" /></summary>
        <div className="levi-nav-popover">
          {items.map((item) => {
            const ItemIcon = item.icon;
            return <Link key={item.href} href={item.href} className={pathActive(router.pathname, item.href) ? "is-active" : ""}><ItemIcon className="h-4 w-4" /><span><strong>{item.label}</strong><small>{item.detail}</small></span></Link>;
          })}
        </div>
      </details>
    );
  };

  return (
    <div className="levi-site flow-adventures-site min-h-screen">
      <header className={`levi-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="levi-container flex h-[4.75rem] items-center justify-between">
          <Link href="/" className="levi-brand" aria-label={`${FLOW_FINANCE_NAME} home`}>
            <span className="levi-brand-mark"><Image src={FLOW_FINANCE_IMAGE_PATH} alt="" fill sizes="44px" /></span>
            <span><span className="levi-brand-eyebrow">Memecoin exploration lab</span><span className="levi-brand-name">Flow-Finance Adventures</span></span>
          </Link>

          <nav className="levi-nav-shell hidden 2xl:flex" aria-label="Primary navigation">
            {directNavItems.map((item) => {
              const Icon = item.icon;
              return <Link key={item.href} href={item.href} className={`levi-nav-item ${pathActive(router.pathname, item.href) ? "is-active" : ""}`}><Icon className="h-4 w-4" />{item.label}</Link>;
            })}
            {renderMenu("Community", Users, communityItems)}
            {renderMenu("Learn", BookOpen, learningItems)}
          </nav>

          <div className="levi-header-actions">
            <button
              type="button"
              onClick={toggleTheme}
              className="flow-theme-toggle"
              aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"}
              title={theme === "dark" ? "Use light theme" : "Use dark theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {auth.session || auth.walletAddress ? (
              <button type="button" onClick={() => void handleLogout()} className="levi-shell-cta hidden 2xl:inline-flex"><LogOut className="h-4 w-4" />Logout</button>
            ) : (
              <button type="button" onClick={() => setAccessOpen(true)} className="levi-shell-cta hidden 2xl:inline-flex"><WalletCards className="h-4 w-4" />Connect wallet</button>
            )}
            <button type="button" onClick={() => setOpen((value) => !value)} className="levi-menu-button inline-flex 2xl:hidden" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} aria-controls="levi-mobile-navigation">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>

        {open ? (
          <div id="levi-mobile-navigation" className="levi-mobile-panel 2xl:hidden">
            <div className="levi-container py-4">
              <div className="levi-mobile-group"><span>Tools</span>{directNavItems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`levi-mobile-item ${pathActive(router.pathname, item.href) ? "is-active" : ""}`}><Icon className="h-4 w-4" />{item.label}</Link>; })}</div>
              <div className="levi-mobile-group"><span>Community</span>{communityItems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`levi-mobile-item ${pathActive(router.pathname, item.href) ? "is-active" : ""}`}><Icon className="h-4 w-4" />{item.label}</Link>; })}</div>
              <div className="levi-mobile-group"><span>Official channels</span><LeviCommunityLinks variant="mobile" onNavigate={() => setOpen(false)} /></div>
              <div className="levi-mobile-group"><span>Learn</span>{learningItems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`levi-mobile-item ${pathActive(router.pathname, item.href) ? "is-active" : ""}`}><Icon className="h-4 w-4" />{item.label}</Link>; })}</div>
              {auth.session || auth.walletAddress ? <button type="button" onClick={() => void handleLogout()} className="levi-shell-cta mt-3 flex w-full justify-center"><LogOut className="h-4 w-4" />Logout</button> : <button type="button" onClick={() => { setOpen(false); setAccessOpen(true); }} className="levi-shell-cta mt-3 flex w-full justify-center"><WalletCards className="h-4 w-4" />Connect wallet</button>}
            </div>
          </div>
        ) : null}
      </header>

      <main>{children}</main>
      {router.pathname === "/burn" ? null : <CommunityBurnBanner />}
      <footer className="levi-footer">
        <div className="levi-container levi-footer-layout">
          <div className="levi-footer-note">
            <div><BookOpen className="levi-brand-accent h-4 w-4" /><span>Signals are heuristic and require human review.</span></div>
            <Link href="/methodology" className="levi-footer-link">Read the methodology</Link>
          </div>
          <div className="levi-footer-community">
            <span>Official community</span>
            <LeviCommunityLinks variant="compact" />
          </div>
        </div>
      </footer>
      <WalletAccessSheet isOpen={accessOpen} onClose={() => setAccessOpen(false)} />
    </div>
  );
}
