import Head from "next/head";
import { CheckCircle2, LockKeyhole, Shield } from "lucide-react";
import { LeviShell } from "@/components/levi/LeviShell";
import { LeviAuthPanel } from "@/components/levi/LeviAuthPanel";

const tiers = [
  {
    title: "Locked",
    amount: "< 3,000 LEVI",
    detail: "Landing, wallet connect, methodology and hold CTA.",
  },
  {
    title: "Basic",
    amount: "3,000+ LEVI",
    detail: "Scanner access with summary output and limited detail rows.",
  },
  {
    title: "Full",
    amount: "50,000+ LEVI",
    detail: "Full report details, expanded scan window and dashboard access.",
  },
];

export default function TokenGatePage() {
  return (
    <LeviShell>
      <Head>
        <title>Token Gate | LEVI Sentinel</title>
      </Head>
      <section className="min-h-screen bg-[#050705] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Token Gate
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Existing LEVI mint, real balance checks
          </h1>
          <p className="mt-4 max-w-3xl text-slate-400">
            The app reads the Token-2022 LEVI mint from Solana mainnet and gates access on server-side API calls.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.title} className="rounded-lg border border-white/10 bg-black/65 p-5">
                <div className="flex items-center gap-3">
                  {tier.title === "Locked" ? (
                    <LockKeyhole className="h-5 w-5 text-red-300" />
                  ) : tier.title === "Basic" ? (
                    <Shield className="h-5 w-5 text-amber-300" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  )}
                  <h2 className="text-lg font-semibold text-white">{tier.title}</h2>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">{tier.amount}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{tier.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <LeviAuthPanel />
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
