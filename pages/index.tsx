import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  Coins,
  Compass,
  Flame,
  Layers3,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { HomeNarrativeFlow } from "@/components/levi/HomeNarrativeFlow";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { MetricCard } from "@/components/levi/MetricCard";
import { HomeScannerPreview } from "@/components/levi/HomeScannerPreview";
import { BurnLedger } from "@/components/flow/BurnLedger";
import { FlowAdventureVisual } from "@/components/flow/FlowAdventureVisual";
import {
  FLOW_FINANCE_IMAGE_PATH,
  FLOW_FINANCE_NAME,
  FLOW_FINANCE_TAGLINE,
} from "@/lib/flowFinance/brand";

export default function Home() {
  return (
    <LeviShell>
      <Head>
        <title>{`${FLOW_FINANCE_NAME} | Solana Memecoin Toolkit`}</title>
        <meta name="description" content={FLOW_FINANCE_TAGLINE} />
        <meta property="og:title" content={`${FLOW_FINANCE_NAME} | Solana Memecoin Toolkit`} />
        <meta property="og:description" content={FLOW_FINANCE_TAGLINE} />
        <meta property="og:image" content={FLOW_FINANCE_IMAGE_PATH} />
      </Head>

      <section className="flow-home">
        <div className="flow-home-grid" aria-hidden="true" />
        <div className="levi-container">
          <div className="flow-hero">
            <div className="flow-hero-copy">
              <p className="flow-kicker"><Compass className="h-4 w-4" /> Open Solana memecoin lab</p>
              <h1>
                Flow-Finance Adventures
                <span>Explore every token without losing the thread.</span>
              </h1>
              <p className="flow-hero-lede">
                Inspect wallets, understand token behavior, burn supported assets and
                launch new community experiments from one calm, verifiable workspace.
                Each memecoin can become its own adventure without redefining the platform.
              </p>
              <div className="flow-hero-actions">
                <Link href="/scanner" className="flow-primary-button">
                  Explore Scanner <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/burn" className="flow-secondary-button">
                  <Flame className="h-4 w-4" /> Burn a token
                </Link>
              </div>
              <div className="flow-hero-proof">
                <span><Radar className="h-4 w-4" /> Public on-chain evidence</span>
                <span><ShieldCheck className="h-4 w-4" /> Noncustodial actions</span>
                <span><Layers3 className="h-4 w-4" /> Multi-token by design</span>
              </div>
            </div>
            <FlowAdventureVisual />
          </div>

          <div className="flow-hero-rail" aria-hidden="true">
            <span>DISCOVER</span><span>UNDERSTAND</span><span>BURN</span><span>BUILD</span>
          </div>

          <LeviReveal>
            <section className="flow-community-invite" aria-labelledby="flow-community-title">
              <div>
                <p className="flow-kicker"><Sparkles className="h-4 w-4" /> Follow the next adventure</p>
                <h2 id="flow-community-title">Ideas and launches move in public.</h2>
                <p>Join the official channels for new token experiments, product releases and community proposals.</p>
              </div>
              <LeviCommunityLinks />
            </section>
          </LeviReveal>

          <LeviReveal>
            <section className="flow-narrative" aria-labelledby="flow-narrative-title">
              <div>
                <p className="flow-kicker"><Compass className="h-4 w-4" /> The adventure loop</p>
                <h2 id="flow-narrative-title">One platform. Many memecoin stories.</h2>
                <p>
                  Start with public evidence, turn it into useful context, test a community
                  idea and ship the next utility. The platform stays consistent while each
                  token gets its own identity, campaign and product path.
                </p>
              </div>
              <HomeNarrativeFlow />
            </section>
          </LeviReveal>

          <div className="flow-home-sections">
            <LeviReveal>
              <div className="levi-metric-grid">
                <MetricCard label="Network" value="Solana" icon={<Compass className="h-4 w-4" />} tone="cyan" />
                <MetricCard label="Token support" value="SPL + Token-2022" icon={<Coins className="h-4 w-4" />} tone="green" />
                <MetricCard label="Burn records" value="Verified by mint" icon={<Flame className="h-4 w-4" />} tone="amber" />
              </div>
            </LeviReveal>

            <LeviReveal><BurnLedger /></LeviReveal>
            <LeviReveal><AgenticDevelopmentNotice /></LeviReveal>
            <LeviReveal><HomeScannerPreview /></LeviReveal>
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
