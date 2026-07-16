import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Lock,
  Radar,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { BullChargeProposal } from "@/components/levi/BullChargeProposal";
import { LeviEntranceImage } from "@/components/levi/LeviEntranceImage";
import { LeviCommunityLinks } from "@/components/levi/LeviCommunityLinks";
import { HomeNarrativeFlow } from "@/components/levi/HomeNarrativeFlow";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { LiveBurnTracker } from "@/components/levi/LiveBurnTracker";
import { MetricCard } from "@/components/levi/MetricCard";
import { HomeScannerPreview } from "@/components/levi/HomeScannerPreview";
import { AGENT_K9_IMAGE_PATH } from "@/lib/agentK9/brand";

export default function Home() {
  return (
    <LeviShell>
      <Head>
        <title>Agent K9 | Solana Intelligence</title>
        <meta
          name="description"
          content="Agent K9 turns public Solana activity into clearer signals and community-built Web3 products."
        />
        <meta property="og:title" content="Agent K9 | Solana Intelligence" />
        <meta property="og:image" content={AGENT_K9_IMAGE_PATH} />
      </Head>

      <section className="levi-home">
        <div className="levi-home-grid" aria-hidden="true" />
        <div className="levi-home-light" aria-hidden="true" />

        <div className="levi-container">
          <div className="levi-hero">
            <div className="levi-hero-copy">
              <div className="levi-eyebrow">
                <ShieldCheck className="h-4 w-4" />
                Agent K9 / Solana-native intelligence
              </div>
              <h1 className="levi-display">
                Read the chain.
                <span>Build what matters.</span>
              </h1>
              <p className="levi-hero-lede">
                Agent K9 turns public Solana activity into AI-assisted
                context, while community ideas become real Web3 products. The
                Agent K9 scanner is the intelligence surface for reviewing the signal.
              </p>
              <div className="levi-hero-actions">
              <Link
                href="/scanner"
                  className="levi-primary-button"
              >
                  Open Scanner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="levi-secondary-button">
                <FileText className="h-4 w-4" />
                Open Docs
              </Link>
              </div>
              <div className="levi-hero-proof">
                <span><Sparkles className="h-4 w-4" /> AI-assisted</span>
                <span><Radar className="h-4 w-4" /> Human-reviewed</span>
                <span><ShieldCheck className="h-4 w-4" /> Community-built</span>
              </div>
            </div>

            <LeviEntranceImage />
          </div>

          <div className="levi-hero-rail" aria-hidden="true">
            <span>AGENT K9 / SOLANA</span>
            <span>FROM PUBLIC SIGNALS TO USEFUL PRODUCTS</span>
            <span className="levi-hero-rail-line" />
            <ArrowRight className="h-4 w-4" />
          </div>

          <LeviReveal>
            <section className="levi-community-invite" aria-labelledby="levi-community-title">
              <div className="levi-community-invite-copy">
                <div className="levi-section-label"><Sparkles className="h-4 w-4" /> Official channels</div>
                <h2 id="levi-community-title">Join the Agent K9 community.</h2>
                <p>Follow product releases, community proposals and the next utilities built around K9.</p>
              </div>
              <LeviCommunityLinks />
            </section>
          </LeviReveal>

          <LeviReveal>
            <section className="levi-home-narrative" aria-labelledby="home-narrative-title">
              <div className="levi-home-narrative-copy">
                <div className="levi-section-label"><Sparkles className="h-4 w-4" /> Agent K9 idea</div>
                <h2 id="home-narrative-title">Community ideas become real Web3 products.</h2>
                <p>
                  Agent K9 helps make Solana activity easier to read. The community
                  helps decide what gets built next. Together, signals become context,
                  proposals become products, and utility grows in public.
                </p>
              </div>
              <HomeNarrativeFlow />
            </section>
          </LeviReveal>

          <div className="levi-flow">
            <LeviReveal>
              <div className="levi-metric-grid">
                <MetricCard
                  label="Basic access"
                  value="3,000 K9"
                  icon={<Lock className="h-4 w-4" />}
                  tone="amber"
                />
                <MetricCard
                  label="Full access"
                  value="50,000 K9"
                  icon={<Radar className="h-4 w-4" />}
                  tone="green"
                />
                <MetricCard
                  label="Signal mode"
                  value="Heuristic"
                  icon={<Volume2 className="h-4 w-4" />}
                  tone="cyan"
                />
              </div>
            </LeviReveal>

            <LeviReveal>
              <LiveBurnTracker />
            </LeviReveal>

            <LeviReveal>
              <AgenticDevelopmentNotice />
            </LeviReveal>

            <LeviReveal>
              <BullChargeProposal />
            </LeviReveal>

            <LeviReveal>
              <HomeScannerPreview />
            </LeviReveal>
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
