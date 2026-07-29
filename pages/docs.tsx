import Head from "next/head";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Compass,
  Flame,
  Layers3,
  Lightbulb,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { FairLaunchSignal } from "@/components/flow/FairLaunchSignal";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import {
  FLOW_FINANCE_IMAGE_PATH,
  FLOW_FINANCE_NAME,
  FLOW_FINANCE_TAGLINE,
} from "@/lib/flowFinance/brand";
import {
  BULLISH_MULE_MINT_ADDRESS,
  BULLISH_MULE_MOON_IMAGE_PATH,
  BULLISH_MULE_NAME,
  BULLISH_MULE_SOLSCAN_URL,
  BULLISH_MULE_SYMBOL,
} from "@/lib/bullishMule/brand";

const tools = [
  { icon: Radar, title: "Scanner", status: "Live", body: "Inspect a public wallet and token through classified on-chain activity, balances and visible evidence coverage." },
  { icon: Search, title: "Token Sniffer", status: "Live", body: "Turn token risk data into a beginner-friendly review before connecting a wallet or making a trade." },
  { icon: Flame, title: "Burn Studio", status: "Live", body: "Permanently burn a supported SPL or Token-2022 balance and publish the verified event under that mint." },
  { icon: WalletCards, title: "Portfolio", status: "Evolving", body: "Keep wallet observations, investigations and decision notes together in a private signed session." },
];

const principles = [
  { icon: Layers3, title: "Discipline before emotion", body: "MULE tools are designed to slow down the decision: inspect evidence, verify the mint, understand limitations and choose independently." },
  { icon: ShieldCheck, title: "Evidence before claims", body: "Public blockchain data is shown with coverage and limitations. A signal supports research; it does not prove intent or guarantee an outcome." },
  { icon: Compass, title: "Your wallet stays yours", body: "Wallet actions remain visible and user-approved. Bullish Mule never receives seed phrases or silently moves assets." },
];

const roadmap = [
  ["01", "MULE foundation", "Maintain the token identity, official channels, educational layer and transparent project documentation."],
  ["02", "Holder launch board", "Expand the live MULE-gated board for supported fair launches without embedding a purchase or promising allocation."],
  ["03", "Stronger intelligence", "Improve explainable wallet and token evidence while respecting public-RPC limits and data coverage."],
  ["04", "Community utility", "Turn reviewed community proposals into useful tools, games and transparent on-chain experiments."],
];

export default function DocsPage() {
  return (
    <LeviShell>
      <Head>
        <title>{`Docs | ${FLOW_FINANCE_NAME}`}</title>
        <meta name="description" content={`How ${FLOW_FINANCE_NAME} combines Solana research, disciplined participation and holder-first fair-launch discovery.`} />
        <meta property="og:title" content={`Docs | ${FLOW_FINANCE_NAME}`} />
        <meta property="og:description" content={FLOW_FINANCE_TAGLINE} />
        <meta property="og:image" content={FLOW_FINANCE_IMAGE_PATH} />
      </Head>

      <div className="flow-docs-page">
        <section className="levi-container flow-docs-hero">
          <LeviReveal>
            <div>
              <p className="flow-kicker"><BookOpen className="h-4 w-4" /> Bullish Mule docs / v3.0</p>
              <h1>Strong mind. <span>Bullish moves.</span></h1>
              <p>{FLOW_FINANCE_TAGLINE} Every tool is built to support research and independent judgment, never to replace it.</p>
              <div className="flow-hero-actions">
                <a href="#model" className="flow-primary-button">Understand the model <ArrowRight className="h-4 w-4" /></a>
                <a href="#fair-launch-signal" className="flow-secondary-button"><Sparkles className="h-4 w-4" /> Launch Signal</a>
              </div>
            </div>
          </LeviReveal>
          <LeviReveal>
            <div className="flow-docs-mark">
              <Image src={BULLISH_MULE_MOON_IMAGE_PATH} alt="Bullish Mule under the moon" width={520} height={520} sizes="(max-width: 767px) 80vw, 400px" />
              <span>Focus / verify / execute</span>
            </div>
          </LeviReveal>
        </section>

        <section id="model" className="levi-container flow-docs-section">
          <LeviReveal>
            <header className="flow-section-heading">
              <div><p className="flow-kicker"><Compass className="h-4 w-4" /> MULE model</p><h2>Culture, evidence and utility in one place.</h2><p>Bullish Mule combines a clear community identity with wallet research, token checks, education, universal burns and a holder-first fair-launch board.</p></div>
            </header>
          </LeviReveal>
          <div className="flow-docs-principles">
            {principles.map(({ icon: Icon, title, body }) => <article key={title}><Icon className="h-5 w-5" /><h3>{title}</h3><p>{body}</p></article>)}
          </div>
          <div className="flow-docs-flow" aria-label="Bullish Mule product flow">
            <span>Public Solana data</span><ArrowRight className="h-4 w-4" /><span>Explainable tools</span><ArrowRight className="h-4 w-4" /><span>Holder discovery</span><ArrowRight className="h-4 w-4" /><span>Independent decision</span>
          </div>
        </section>

        <section className="flow-docs-band">
          <div className="levi-container flow-docs-section">
            <LeviReveal><FairLaunchSignal variant="docs" /></LeviReveal>
          </div>
        </section>

        <section>
          <div className="levi-container flow-docs-section">
            <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Sparkles className="h-4 w-4" /> MULE toolkit</p><h2>Useful tools before any trade begins.</h2><p>These surfaces turn public Solana data into clearer context while keeping uncertainty, coverage and wallet control visible.</p></div></header></LeviReveal>
            <div className="flow-docs-tools">
              {tools.map(({ icon: Icon, title, status, body }) => <article key={title}><div><Icon className="h-5 w-5" /><span>{status}</span></div><h3>{title}</h3><p>{body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="levi-container flow-docs-section">
          <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Layers3 className="h-4 w-4" /> Canonical token</p><h2>Verify Bullish Mule by mint, not by image.</h2><p>Names, tickers and artwork can be copied. The Solana mint below is the authoritative identity used for MULE holder access.</p></div></header></LeviReveal>
          <div className="flow-docs-adventure">
            <div><span>Official project token</span><h3>{BULLISH_MULE_NAME}</h3><p>MULE is the community token used to unlock the holder-first launch board. General research and burn tools remain available without a MULE balance.</p></div>
            <dl><div><dt>Ticker</dt><dd>${BULLISH_MULE_SYMBOL}</dd></div><div><dt>Network</dt><dd>Solana</dd></div><div><dt>Mint</dt><dd><code>{BULLISH_MULE_MINT_ADDRESS}</code></dd></div></dl>
            <a href={BULLISH_MULE_SOLSCAN_URL} target="_blank" rel="noreferrer">Verify on Solscan <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </section>

        <section className="flow-docs-band">
          <div className="levi-container flow-docs-section">
            <LeviReveal><header className="flow-section-heading"><div><p className="flow-kicker"><Lightbulb className="h-4 w-4" /> Direction</p><h2>Build MULE utility in public.</h2><p>The roadmap is directional and does not promise dates, prices or financial returns.</p></div></header></LeviReveal>
            <div className="flow-docs-roadmap">{roadmap.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className="levi-container flow-docs-section flow-docs-community">
          <div><p className="flow-kicker"><Sparkles className="h-4 w-4" /> Community</p><h2>Help shape the next MULE utility.</h2><p>Follow releases, propose a useful experiment and review what is actually live before participating.</p></div>
          <LeviCommunityLinks />
        </section>

        <section className="levi-container flow-docs-agent"><AgenticDevelopmentNotice /></section>

        <section className="levi-container flow-docs-disclaimer">
          <ShieldCheck className="h-5 w-5" />
          <div><h2>Research support, not financial advice.</h2><p>Bullish Mule provides educational material, public blockchain context and user-directed tools. Memecoins are volatile and may lose all value. Verify every mint and transaction independently.</p></div>
        </section>
      </div>
    </LeviShell>
  );
}
