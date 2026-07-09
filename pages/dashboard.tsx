import Head from "next/head";
import { Activity, Lock, Radar, ShieldCheck } from "lucide-react";
import { LeviShell } from "@/components/levi/LeviShell";
import { LeviAuthPanel } from "@/components/levi/LeviAuthPanel";
import { MetricCard } from "@/components/levi/MetricCard";

export default function DashboardPage() {
  return (
    <LeviShell>
      <Head>
        <title>Dashboard | LEVI Sentinel</title>
      </Head>
      <section className="min-h-screen bg-[#050705] px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              LEVI-gated intelligence
            </h1>
            <p className="mt-4 text-slate-400">
              Full access unlocks detailed creator signals, sell-event rows, and expanded scan windows.
            </p>
            <div className="mt-6">
              <LeviAuthPanel />
            </div>
          </div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            <MetricCard
              label="Access Floor"
              value="3,000"
              icon={<Lock className="h-4 w-4" />}
              tone="amber"
            />
            <MetricCard
              label="Full Dashboard"
              value="50,000"
              icon={<ShieldCheck className="h-4 w-4" />}
              tone="green"
            />
            <MetricCard
              label="Full Scan Window"
              value="200 tx"
              icon={<Radar className="h-4 w-4" />}
              tone="cyan"
            />
            <MetricCard
              label="Mode"
              value="Live RPC"
              icon={<Activity className="h-4 w-4" />}
              tone="neutral"
            />
          </div>
        </div>
      </section>
    </LeviShell>
  );
}
