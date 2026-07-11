import Head from "next/head";
import { LeviShell } from "@/components/levi/LeviShell";
import { ScannerPanel } from "@/components/levi/ScannerPanel";

export default function ScannerPage() {
  return (
    <LeviShell>
      <Head>
        <title>Scanner | LEVI Sentinel</title>
      </Head>
      <section className="min-h-screen bg-[#050705] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto mb-8 max-w-6xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">
            Scanner
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Wallet and token evidence scan
          </h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Compare current holdings with classified swaps, transfers and the exact coverage of the observed window.
          </p>
        </div>
        <ScannerPanel />
      </section>
    </LeviShell>
  );
}
