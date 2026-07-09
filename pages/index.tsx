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

      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center pt-24"
        style={{ backgroundImage: "url('/levi-ban-system.png')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.76),rgba(0,0,0,0.46))]" />
        <LeviEntranceImage />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              Token-gated Solana risk intelligence
            </div>
            <h1 className="mt-6 text-5xl font-black leading-none text-white sm:text-7xl">
              LEVI Sentinel
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Scan creator wallets, surface suspected rug-pattern signals, and
              gate deeper intelligence by real LEVI holdings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/scanner"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Open Scanner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/games"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/25 bg-black/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Dice5 className="h-4 w-4" />
                Crazy Dice
              </Link>
            </div>
          </div>

          <AgenticDevelopmentNotice />

          <BullChargeProposal />

          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Basic Gate"
              value="3,000 LEVI"
              icon={<Lock className="h-4 w-4" />}
              tone="amber"
            />
            <MetricCard
              label="Full Gate"
              value="50,000 LEVI"
              icon={<Radar className="h-4 w-4" />}
              tone="green"
            />
            <MetricCard
              label="Signal Mode"
              value="Heuristic"
              icon={<Volume2 className="h-4 w-4" />}
              tone="cyan"
            />
          </div>

          <ScannerPanel />
        </div>
      </section>
    </LeviShell>
  );
}
