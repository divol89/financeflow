import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Flame,
  Gamepad2,
  Layers3,
  Lightbulb,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import {
  FLOW_FINANCE_IMAGE_PATH,
  FLOW_FINANCE_NAME,
  FLOW_FINANCE_TAGLINE,
} from "@/lib/flowFinance/brand";
import {
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_NAME,
  AGENT_K9_SYMBOL,
} from "@/lib/agentK9/brand";

const tools = [
  { icon: Radar, title: "Scanner", status: "Live", body: "Inspect a public wallet and token through classified on-chain activity, balances and visible evidence coverage." },
  { icon: Search, title: "Token Sniffer", status: "Live", body: "Turn token risk data into a beginner-friendly review before connecting a wallet or making a trade." },
  { icon: Flame, title: "Burn Studio", status: "Live", body: "Permanently burn a supported SPL or Token-2022 balance and publish the verified event under that mint." },
  { icon: WalletCards, title: "Portfolio", status: "Evolving", body: "Keep wallet observations, investigations and decision notes together in a private signed session." },
];

const principles = [
  { icon: Layers3, title: "Platform before token", body: "The shared tools keep one stable identity. Individual memecoins can add their own campaigns, games and economic rules as hosted adventures." },
  { icon: ShieldCheck, title: "Evidence before claims", body: "Public blockchain data is shown with coverage and limitations. A signal supports research; it does not prove intent or guarantee an outcome." },
  { icon: Compass, title: "Noncustodial by default", body: "Wallet actions remain visible and user-approved. The platform does not receive seed phrases or silently move assets." },
];

const roadmap = [
  ["01", "Open toolkit", "Keep Scanner, Token Sniffer, education and the universal Burn Studio clear and accessible."],
  ["02", "Adventure registry", "Give each community memecoin a distinct profile without turning it into the identity of the whole platform."],
  ["03", "Shared evidence", "Expand verified multi-token activity, burn history and explainable wallet intelligence."],
  ["04", "Community products", "Turn reviewed proposals into games, campaigns and utilities with transparent scope and status."],
];

export default function DocsPage() {
  return (
    <LeviShell>
      <Head>
        <title>{`Docs | ${FLOW_FINANCE_NAME}`}</title>
        <meta name="description" content={`How ${FLOW_FINANCE_NAME} supports many Solana memecoin projects through shared, verifiable tools.`} />
        <meta property="og:title" content={`Docs | ${FLOW_FINANCE_NAME}`} />
        <meta property="og:description" content={FLOW_FINANCE_TAGLINE} />
        <meta property="og:image" content={FLOW_FINANCE_IMAGE_PATH} />
      </Head>

      <div className="flow-docs-page">
        <section className="levi-container flow-docs-hero">
          <LeviReveal>
            <div>
              <p className="flow-kicker"><BookOpen className="h-4 w-4" /> Platform docs / v2.0</p>
              <h1>One toolkit for many <span>memecoin adventures.</span></h1>
              <p>{FLOW_FINANCE_TAGLINE} The platform is not defined by a single mascot, ticker or launch.</p>
              <div className="flow-hero-actions">
                <a href="#model" className="flow-primary-button">Understand the model <ArrowRight className="h-4 w-4" /></a>
                <Link href="/burn" className="flow-secondary-button"><Flame className="h-4 w-4" /> Open Burn Studio</Link>
              </div>
            </div>
          </LeviReveal>
          <LeviReveal>
            <div className="flow-docs-mark">
              <Image src={FLOW_FINANCE_IMAGE_PATH} alt="Flow-Finance Adventures logo" width={520} height={520} sizes="(max-width: 767px) 80vw, 400px" />
              <span>Explore / verify / build</span>
            </div>
          </LeviReveal>
        </section>

        <section id="model" className="levi-container flow-docs-section">
          <LeviReveal>
            <header className="flow-section-heading">
              <div><p className="flow-kicker"><Compass className="h-4 w-4" /> Platform model</p><h2>A stable home for changing token stories.</h2><p>Flow-Finance Adventures provides the shared navigation, education, wallet connection and evidence tools. A hosted adventure can then add token-specific identity and utility without rewriting the platform.</p></div>
            </header>
          </LeviReveal>
          <div className="flow-docs-principles">
            {principles.map(({ icon: Icon, title, body }) => <article key={title}><Icon className="h-5 w-5" /><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <div className="flow-docs-flow" aria-label="Flow-Finance Adventures product flow">
            <span>Public Solana data</span><ArrowRight className="h-4 w-4" /><span>Explainable tools</span><ArrowRight className="h-4 w-4" /><span>Community proposal</span><ArrowRight className="h-4 w-4" /><span>Token adventure</span>
          </div>
        </section>

        <section className="flow-docs-band">
          <div className="levi-container flow-docs-section">
            <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Sparkles className="h-4 w-4" /> Shared toolkit</p><h2>Useful before any narrative begins.</h2><p>These surfaces are platform tools. Their purpose remains consistent even when the community explores a different token.</p></div></header></LeviReveal>
            <div className="flow-docs-tools">
              {tools.map(({ icon: Icon, title, status, body }) => <article key={title}><div><Icon className="h-5 w-5" /><span>{status}</span></div><h3>{title}</h3><p>{body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="levi-container flow-docs-section">
          <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Gamepad2 className="h-4 w-4" /> Hosted adventures</p><h2>Token identity belongs inside the adventure.</h2><p>Agent K9 remains one current project module, not the name or visual identity of Flow-Finance Adventures.</p></div></header></LeviReveal>
          <div className="flow-docs-adventure">
            <div><span>Current example</span><h3>{AGENT_K9_NAME}</h3><p>Social and game experiments can continue under their own token identity while shared tools remain token-neutral.</p></div>
            <dl><div><dt>Ticker</dt><dd>${AGENT_K9_SYMBOL}</dd></div><div><dt>Network</dt><dd>Solana</dd></div><div><dt>Mint</dt><dd><code>{AGENT_K9_MINT_ADDRESS}</code></dd></div></dl>
            <a href={`https://solscan.io/token/${AGENT_K9_MINT_ADDRESS}`} target="_blank" rel="noreferrer">Verify on Solscan <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>

        <section className="flow-docs-band">
          <div className="levi-container flow-docs-section">
            <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Lightbulb className="h-4 w-4" /> Direction</p><h2>Build the platform, then expand the map.</h2><p>The roadmap is directional and does not promise dates, prices or financial returns.</p></div></header></LeviReveal>
            <div className="flow-docs-roadmap">{roadmap.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className="levi-container flow-docs-section flow-docs-community">
          <div><p className="flow-kicker"><Sparkles className="h-4 w-4" /> Community</p><h2>Help choose the next adventure.</h2><p>Follow releases, propose a token experiment and review what is actually live before participating.</p></div>
          <LeviCommunityLinks />
        </section>

        <section className="levi-container flow-docs-agent"><AgenticDevelopmentNotice /></section>

        <section className="levi-container flow-docs-disclaimer">
          <ShieldCheck className="h-5 w-5" />
          <div><h2>Research support, not financial advice.</h2><p>Flow-Finance Adventures provides educational material, public blockchain context and user-directed tools. Memecoins are volatile and may lose all value. Verify every mint and transaction independently.</p></div>
        </section>
      </div>
    </LeviShell>
  );
}
