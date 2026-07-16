import Head from "next/head";
import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  FileText,
  Gamepad2,
  Globe2,
  LockKeyhole,
  Megaphone,
  Radar,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { BullChargeProposal } from "@/components/levi/BullChargeProposal";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { WhitepaperFlow } from "@/components/levi/WhitepaperFlow";
import {
  AGENT_K9_IMAGE_PATH,
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_NAME,
  AGENT_K9_SYMBOL,
  AGENT_K9_TELEGRAM_URL,
  AGENT_K9_WEBSITE_URL,
  AGENT_K9_X_HANDLE,
  AGENT_K9_X_URL,
} from "@/lib/agentK9/brand";

const productCards = [
  {
    title: "Scanner",
    icon: Radar,
    label: "Available surface",
    body: "Review recent wallet activity, token movement, creator-side sell signals and risk patterns that still require human judgment.",
  },
  {
    title: "Holder Access",
    icon: LockKeyhole,
    label: "Holder access",
    body: "K9 holders can prove wallet ownership with a message signature and unlock deeper Scanner and Portfolio limits without transferring tokens or granting approvals.",
  },
  {
    title: "K9 Social",
    icon: Megaphone,
    label: "Community campaign",
    body: "Eligible K9 holders can submit X posts through a manual-review campaign with holding tiers and a later surprise reveal.",
  },
  {
    title: "K9 Dice",
    icon: Gamepad2,
    label: "Solana preview",
    body: "A separate K9 game experience in development as part of the wider utility layer around the ecosystem.",
  },
];

const missionItems = [
  "Analyze on-chain wallet activity.",
  "Monitor blockchain trends and public signals.",
  "Surface unusual transaction patterns for review.",
  "Make complex blockchain data easier to understand.",
  "Support a safer and more informed Solana ecosystem.",
];

const roadmap = [
  { phase: "01", title: "Foundation", items: ["Launch the K9 identity", "Launch the X account", "Build the Telegram community", "Grow the first user base"] },
  { phase: "02", title: "Clarity", items: ["Expand Agent K9 branding", "Improve the website", "Publish educational content", "Increase community engagement"] },
  { phase: "03", title: "Intelligence", items: ["Enhance K9 capabilities", "Add more blockchain analysis features", "Develop Solana ecosystem partnerships"] },
  { phase: "04", title: "Long-term growth", items: ["Continue platform development", "Expand AI-assisted tools", "Build durable ecosystem utility"] },
];

export default function DocsPage() {
  return (
    <LeviShell>
      <Head>
        <title>Docs | Agent K9</title>
        <meta
          name="description"
          content="Agent K9 is an AI-assisted intelligence platform for understanding public Solana activity."
        />
        <meta property="og:title" content="Docs | Agent K9" />
        <meta property="og:description" content="Community-led intelligence for the Solana ecosystem." />
        <meta property="og:image" content={AGENT_K9_IMAGE_PATH} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="levi-docs-page">
        <div className="levi-docs-grid" aria-hidden="true" />
        <div className="levi-docs-glow" aria-hidden="true" />

        <section className="levi-container levi-docs-hero">
          <LeviReveal>
            <div className="levi-docs-hero-copy">
              <p className="levi-eyebrow"><Bot className="h-3.5 w-3.5" /> Agent K9 / Docs v1.0</p>
              <h1>Where community ideas become <span>real Web3 products.</span></h1>
              <p className="levi-docs-hero-lede">
                Agent K9 is an AI-assisted intelligence platform built for the Solana ecosystem. It helps traders, investors and communities understand public blockchain activity with more context and less noise.
              </p>
              <div className="levi-docs-hero-actions">
                <a className="levi-primary-button" href="#introduction">Read the docs <ArrowUpRight className="h-4 w-4" /></a>
                <a className="levi-secondary-button" href="#token">View token identity</a>
              </div>
              <p className="levi-docs-hero-note">Data-assisted education and intelligence. Not financial advice or a promise of results.</p>
            </div>
          </LeviReveal>

          <LeviReveal>
            <div className="levi-docs-hero-mark" aria-label="Agent K9 identity">
              <Image
                src={AGENT_K9_IMAGE_PATH}
                alt="Agent K9"
                width={520}
                height={520}
                sizes="(max-width: 767px) 224px, 400px"
              />
              <div><span>Powered by</span><strong>K9</strong></div>
            </div>
          </LeviReveal>
        </section>

        <section id="introduction" className="levi-container levi-docs-section">
          <LeviReveal>
            <div className="levi-docs-section-heading">
              <div>
                <p className="levi-section-label"><FileText className="h-3.5 w-3.5" /> Introduction</p>
                <h2>Make blockchain data easier to understand.</h2>
                <p>
                  The crypto market moves quickly and on-chain information can be difficult to interpret. Agent K9 turns public Solana activity into structured signals and AI-assisted context so people can review what is happening more efficiently.
                </p>
              </div>
              <div className="levi-docs-side-note"><Sparkles className="h-5 w-5" /><span>Less hype. More context.</span></div>
            </div>
          </LeviReveal>

          <LeviReveal><WhitepaperFlow /></LeviReveal>
        </section>

        <section className="levi-container levi-docs-section levi-docs-section-dark">
          <div className="levi-docs-two-column">
            <LeviReveal>
              <article className="levi-docs-copy-block">
                <p className="levi-section-label"><Globe2 className="h-3.5 w-3.5" /> Our vision</p>
                <h2>One of the clearest intelligence layers for Solana.</h2>
                <p>Our vision is to make blockchain intelligence accessible to everyone, from experienced on-chain researchers to communities discovering how public data can support better decisions.</p>
              </article>
            </LeviReveal>
            <LeviReveal>
              <article className="levi-docs-copy-block">
                <p className="levi-section-label"><WalletCards className="h-3.5 w-3.5" /> Our mission</p>
                <h2>Useful signals, responsible interpretation.</h2>
                <ul className="levi-docs-mission-list">
                  {missionItems.map((item) => <li key={item}><ShieldCheck className="h-4 w-4" /> <span>{item}</span></li>)}
                </ul>
              </article>
            </LeviReveal>
          </div>
        </section>

        <section className="levi-container levi-docs-section">
          <LeviReveal>
            <div className="levi-docs-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><Bot className="h-3.5 w-3.5" /> Agent K9 intelligence</p>
                <h2>An intelligence engine designed to grow with the ecosystem.</h2>
                <p>Agent K9 processes public blockchain data and supports automated, AI-assisted analysis. As development continues, the intelligence layer will expand with additional analytical capabilities and tools.</p>
              </div>
            </div>
          </LeviReveal>
          <div className="levi-docs-ai-grid">
            <article><span>Current direction</span><strong>Structured on-chain review</strong><p>Wallet activity, transactions and token movement are organized into signals that deserve human review.</p></article>
            <article><span>Future direction</span><strong>Broader AI-assisted analysis</strong><p>Additional context, pattern recognition and tools can be added as the platform and data models mature.</p></article>
            <article><span>Operating principle</span><strong>Human judgment stays central</strong><p>Insights inform research; they do not replace independent verification or personal responsibility.</p></article>
          </div>
        </section>

        <section className="levi-container levi-docs-section levi-docs-section-dark">
          <LeviReveal>
            <div className="levi-docs-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><BadgeCheck className="h-3.5 w-3.5" /> Product surface</p>
                <h2>From intelligence to useful community tools.</h2>
                <p>These are the real surfaces currently connected to the project. Future ideas remain proposals until they are built, tested and released.</p>
              </div>
            </div>
          </LeviReveal>
          <div className="levi-docs-product-grid">
            {productCards.map((card) => {
              const Icon = card.icon;
              return <article key={card.title}><div className="levi-docs-card-icon"><Icon className="h-5 w-5" /></div><span>{card.label}</span><h3>{card.title}</h3><p>{card.body}</p></article>;
            })}
          </div>
        </section>

        <section id="token" className="levi-container levi-docs-section">
          <LeviReveal>
            <div className="levi-docs-section-heading compact-heading">
              <div>
                <p className="levi-section-label"><WalletCards className="h-3.5 w-3.5" /> Token information</p>
                <h2>The public identity behind Agent K9.</h2>
              </div>
            </div>
          </LeviReveal>
          <LeviReveal>
            <div className="levi-docs-token-panel">
              <div className="levi-docs-token-facts"><span>Project</span><strong>{AGENT_K9_NAME}</strong><span>Intelligence layer</span><strong>Agent K9</strong><span>Ticker</span><strong>${AGENT_K9_SYMBOL}</strong><span>Blockchain</span><strong>Solana</strong></div>
              <div className="levi-docs-contract"><span>Contract address</span><code>{AGENT_K9_MINT_ADDRESS}</code><a href={`https://solscan.io/token/${AGENT_K9_MINT_ADDRESS}`} target="_blank" rel="noreferrer">View on Solscan <ArrowUpRight className="h-4 w-4" /></a></div>
            </div>
          </LeviReveal>
        </section>

        <section className="levi-container levi-docs-section levi-docs-section-dark">
          <LeviReveal>
            <div className="levi-docs-section-heading compact-heading"><div><p className="levi-section-label"><Sparkles className="h-3.5 w-3.5" /> Roadmap</p><h2>Build clearly. Grow patiently.</h2><p>The roadmap is directional. Timelines and features can change as the community, resources and technical reality evolve.</p></div></div>
          </LeviReveal>
          <div className="levi-docs-roadmap">
            {roadmap.map((item) => <article key={item.phase}><span>{item.phase}</span><h3>{item.title}</h3><ul>{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul></article>)}
          </div>
        </section>

        <section className="levi-container levi-docs-section">
          <LeviReveal>
            <div className="levi-docs-community-heading"><p className="levi-section-label"><Megaphone className="h-3.5 w-3.5" /> Community</p><h2>Community ideas become real Web3 products.</h2><p>Follow the project, share proposals and help decide what the agent should explore next.</p><div className="levi-docs-links"><a href={AGENT_K9_WEBSITE_URL} target="_blank" rel="noreferrer">Website <ArrowUpRight className="h-4 w-4" /></a><a href={AGENT_K9_TELEGRAM_URL} target="_blank" rel="noreferrer">Telegram <ArrowUpRight className="h-4 w-4" /></a><a href={AGENT_K9_X_URL} target="_blank" rel="noreferrer">X / {AGENT_K9_X_HANDLE} <ArrowUpRight className="h-4 w-4" /></a></div></div>
          </LeviReveal>
          <div className="mt-8"><AgenticDevelopmentNotice /></div>
          <div className="mt-8"><BullChargeProposal /></div>
        </section>

        <section className="levi-container levi-docs-disclaimer"><p className="levi-section-label"><ShieldCheck className="h-3.5 w-3.5" /> Disclaimer</p><h2>Insights support research. They do not make decisions for you.</h2><p>Agent K9 provides AI-assisted blockchain insights for informational purposes only. Nothing in this project is financial or investment advice. Solana assets can be highly volatile and may lose some or all of their value. Users remain responsible for their own research and decisions.</p></section>
      </div>
    </LeviShell>
  );
}
