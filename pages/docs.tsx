import Head from "next/head";
import {
  BadgeCheck,
  Dice5,
  FileText,
  Lock,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { AgenticDevelopmentNotice } from "@/components/levi/AgenticDevelopmentNotice";
import { BullChargeProposal } from "@/components/levi/BullChargeProposal";
import { LeviShell } from "@/components/levi/LeviShell";

const purposeCards = [
  {
    title: "Purpose",
    icon: ShieldCheck,
    body: "LEVI Sentinel helps the LEVI community review creator wallets before trusting a token launch or trading signal.",
  },
  {
    title: "Scanner",
    icon: Radar,
    body: "The scanner highlights recent wallet activity, token movement, creator-side sell pressure, and risk patterns that deserve human review.",
  },
  {
    title: "Token Gate",
    icon: Lock,
    body: "LEVI holders unlock deeper scanner limits and dashboard access by signing wallet ownership without transferring tokens.",
  },
  {
    title: "Crazy Dice",
    icon: Dice5,
    body: "The original IOTA Crazy Dice game remains available, while the LEVI Dice Solana edition is prepared as a separate LEVI experience.",
  },
];

const principles = [
  "Use the existing LEVI mint only; the site does not create a new token.",
  "Show signals as risk indicators, not as final accusations.",
  "Keep wallet access explicit: connect, sign, inspect, disconnect.",
  "Treat scan results as a decision aid that still needs human judgment.",
];

export default function DocsPage() {
  return (
    <LeviShell>
      <Head>
        <title>Docs | LEVI Sentinel</title>
        <meta
          name="description"
          content="Project purpose and usage notes for LEVI Sentinel."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <section className="min-h-screen bg-[#050705] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-emerald-300">
              Project Docs
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              LEVI Sentinel protects attention before capital moves.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              This project is a token-gated intelligence layer for the LEVI
              community. It brings wallet scanning, holder access, practical
              risk review, and the Crazy Dice game surface into one public
              experience.
            </p>
          </div>

          <div className="mt-8">
            <AgenticDevelopmentNotice />
          </div>

          <div className="mt-8">
            <BullChargeProposal />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {purposeCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="rounded-lg border border-white/10 bg-black/65 p-5"
                >
                  <div className="flex items-center gap-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-lg font-semibold">{card.title}</h2>
                  </div>
                  <p className="mt-4 leading-7 text-slate-300">{card.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-5">
            <div className="flex items-center gap-3 text-white">
              <BadgeCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="font-semibold">Operating Principles</h2>
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-200 md:grid-cols-2">
              {principles.map((principle) => (
                <li key={principle} className="flex gap-3">
                  <FileText className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
