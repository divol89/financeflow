import Head from "next/head";
import { AlertTriangle, ListChecks, Radar } from "lucide-react";
import { LeviShell } from "@/components/levi/LeviShell";

const methods = [
  "Recent signatures are fetched from Solana mainnet for the target wallet.",
  "Parsed transactions are inspected for Token Program initializeMint instructions signed by the wallet.",
  "Token balance decreases paired with native SOL increases are flagged as possible creator-side sell signals.",
  "Scores are heuristic and never label intent, guilt or legal status.",
];

export default function MethodologyPage() {
  return (
    <LeviShell>
      <Head>
        <title>Methodology | LEVI Sentinel</title>
      </Head>
      <section className="min-h-screen bg-[#050705] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Methodology
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Heuristic signals, not accusations
          </h1>
          <div className="mt-8 grid gap-4">
            {methods.map((method) => (
              <div key={method} className="flex gap-4 rounded-lg border border-white/10 bg-black/65 p-5">
                <ListChecks className="mt-1 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-slate-300">{method}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-amber-400/30 bg-amber-950/40 p-5">
            <div className="flex items-center gap-3 text-amber-100">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="font-semibold">Review required</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-amber-100/80">
              A high score means the inspected window contains patterns worth reviewing. It does not prove a scam, rug pull, fraud or malicious intent.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-lg border border-cyan-400/25 bg-cyan-950/30 p-5 text-cyan-100">
            <Radar className="h-5 w-5" />
            <span>Full access expands the transaction window from 50 to 200 signatures.</span>
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
