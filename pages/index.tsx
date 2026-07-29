import Head from "next/head";
import {
  Coins,
  Compass,
  Flame,
  Sparkles,
} from "lucide-react";
import { MuleEditorialStory } from "@/components/bullishMule/MuleEditorialStory";
import { MuleHero } from "@/components/bullishMule/MuleHero";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { HomeNarrativeFlow } from "@/components/levi/HomeNarrativeFlow";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { MetricCard } from "@/components/levi/MetricCard";
import { HomeScannerPreview } from "@/components/levi/HomeScannerPreview";
import { BurnLedger } from "@/components/flow/BurnLedger";
import { FairLaunchSignal } from "@/components/flow/FairLaunchSignal";
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

      <MuleHero />

      <section className="flow-home flow-home-content">
        <div className="flow-home-grid" aria-hidden="true" />
        <div className="levi-container">
          <div className="flow-hero-rail" aria-hidden="true">
            <span>RESEARCH</span><span>DISCIPLINE</span><span>PARTICIPATE</span><span>BUILD</span>
          </div>

          <LeviReveal>
            <section className="flow-community-invite" aria-labelledby="flow-community-title">
              <div>
                <p className="flow-kicker"><Sparkles className="h-4 w-4" /> Official MULE channels</p>
                <h2 id="flow-community-title">Research and launches move in public.</h2>
                <p>Join the Bullish Mule community for supported launch updates, product releases and transparent development proposals.</p>
              </div>
              <LeviCommunityLinks />
            </section>
          </LeviReveal>

          <LeviReveal>
            <FairLaunchSignal />
          </LeviReveal>

          <LeviReveal>
            <MuleEditorialStory />
          </LeviReveal>

          <LeviReveal>
            <section className="flow-narrative" aria-labelledby="flow-narrative-title">
              <div>
                <p className="flow-kicker"><Compass className="h-4 w-4" /> The MULE loop</p>
                <h2 id="flow-narrative-title">Research first. Participate by choice.</h2>
                <p>
                  Bullish Mule connects public Solana evidence, practical education
                  and holder-first launch discovery. Every action remains optional,
                  independently verifiable and controlled by the wallet owner.
                </p>
              </div>
              <HomeNarrativeFlow />
            </section>
          </LeviReveal>

          <div className="flow-home-sections">
            <LeviReveal>
              <div className="levi-metric-grid">
                <MetricCard label="Network" value="Solana" icon={<Compass className="h-4 w-4" />} tone="cyan" />
                <MetricCard label="Community token" value="$MULE" icon={<Coins className="h-4 w-4" />} tone="green" />
                <MetricCard label="Burn Studio" value="SPL + Token-2022" icon={<Flame className="h-4 w-4" />} tone="amber" />
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
