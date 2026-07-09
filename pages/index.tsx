import Head from "next/head";
import Link from "next/link";
import {
  ArrowRight,
  Dice5,
  Lock,
  Radar,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { BullChargeProposal } from "@/components/levi/BullChargeProposal";
import { LeviEntranceImage } from "@/components/levi/LeviEntranceImage";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { MetricCard } from "@/components/levi/MetricCard";
import { ScannerPanel } from "@/components/levi/ScannerPanel";

export default function Home() {
  return (
    <LeviShell>
      <Head>
        <title>LEVI Sentinel | Flow Finance</title>
        <meta
          name="description"
          content="LEVI Sentinel scans Solana creator wallets for heuristic token-risk signals."
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
                Solana-native risk intelligence
              </div>
              <h1 className="levi-display">
                See the signal.
                <span>Protect the flow.</span>
              </h1>
              <p className="levi-hero-lede">
                LEVI Sentinel inspects creator wallets, surfaces suspicious
                patterns, and unlocks deeper intelligence for real LEVI holders.
              </p>
              <div className="levi-hero-actions">
              <Link
                href="/scanner"
                  className="levi-primary-button"
              >
                  Open Scanner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/games"
                  className="levi-secondary-button"
              >
                <Dice5 className="h-4 w-4" />
                Crazy Dice
              </Link>
              </div>
              <div className="levi-hero-proof">
                <span><ShieldCheck className="h-4 w-4" /> Token-gated</span>
                <span><Radar className="h-4 w-4" /> Human-reviewed</span>
                <span><Lock className="h-4 w-4" /> Read-only by design</span>
              </div>
            </div>

            <LeviEntranceImage />
          </div>

          <div className="levi-hero-rail" aria-hidden="true">
            <span>LEVI / SENTINEL</span>
            <span>ON-CHAIN VISIBILITY FOR THE COMMUNITY</span>
            <span className="levi-hero-rail-line" />
            <ArrowRight className="h-4 w-4" />
          </div>

          <div className="levi-flow">
            <LeviReveal>
              <div className="levi-metric-grid">
                <MetricCard
                  label="Basic gate"
                  value="3,000 LEVI"
                  icon={<Lock className="h-4 w-4" />}
                  tone="amber"
                />
                <MetricCard
                  label="Full gate"
                  value="50,000 LEVI"
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
              <AgenticDevelopmentNotice />
            </LeviReveal>

            <LeviReveal>
              <BullChargeProposal />
            </LeviReveal>

            <LeviReveal>
              <ScannerPanel />
            </LeviReveal>
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
