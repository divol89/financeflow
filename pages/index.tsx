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
import { HomeNarrativeFlow } from "@/components/levi/HomeNarrativeFlow";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { LiveBurnTracker } from "@/components/levi/LiveBurnTracker";
import { MetricCard } from "@/components/levi/MetricCard";
import { HomeScannerPreview } from "@/components/levi/HomeScannerPreview";

export default function Home() {
  return (
    <LeviShell>
      <Head>
        <title>White Bull Agent | LEVI Sentinel</title>
        <meta
          name="description"
          content="White Bull Agent and LEVI AI turn Solana activity into clearer signals and community-built Web3 products."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <section className="levi-home">
        <div className="levi-home-grid" aria-hidden="true" />
        <div className="levi-home-light" aria-hidden="true" />

        <div className="levi-container">
          <div className="levi-hero">
            <div className="levi-hero-copy">
              <div className="levi-eyebrow">
                <ShieldCheck className="h-4 w-4" />
                White Bull Agent / Solana-native intelligence
              </div>
              <h1 className="levi-display">
                Read the chain.
                <span>Build what matters.</span>
              </h1>
              <p className="levi-hero-lede">
                White Bull Agent turns public Solana activity into AI-assisted
                context, while community ideas become real Web3 products. LEVI
                Sentinel is the intelligence surface for reviewing the signal.
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
            <span>WHITE BULL AGENT / LEVI AI</span>
            <span>FROM PUBLIC SIGNALS TO USEFUL PRODUCTS</span>
            <span className="levi-hero-rail-line" />
            <ArrowRight className="h-4 w-4" />
          </div>

          <LeviReveal>
            <section className="levi-home-narrative" aria-labelledby="home-narrative-title">
              <div className="levi-home-narrative-copy">
                <div className="levi-section-label"><Sparkles className="h-4 w-4" /> The White Bull Agent idea</div>
                <h2 id="home-narrative-title">Community ideas become real Web3 products.</h2>
                <p>
                  LEVI AI helps make Solana activity easier to read. The community
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
                  value="3,000 LEVI AI"
                  icon={<Lock className="h-4 w-4" />}
                  tone="amber"
                />
                <MetricCard
                  label="Full access"
                  value="50,000 LEVI AI"
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
