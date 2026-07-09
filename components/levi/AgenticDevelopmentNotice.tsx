import { Bot, HeartHandshake, MessageCircle, Wallet } from "lucide-react";
import { LEVI_DEVELOPMENT_WALLET } from "@/lib/levi/community";

export function AgenticDevelopmentNotice() {
  return (
    <section className="rounded-lg border border-emerald-400/25 bg-black/70 p-5 shadow-2xl shadow-emerald-950/20">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase text-emerald-200">
            <Bot className="h-4 w-4" />
            Agentic page
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            Community proposals can become agent-built features.
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            LEVI Sentinel is an agentic development surface. Propose tools,
            games, dashboards, scanner ideas, or token-growth work in the LEVI
            chat. Community-backed ideas can be turned into scoped development
            tasks for the autonomous agent, supervised by developer Magneto.
            When the agent wallet reaches the SOL needed for approved
            deployment or development work, the agent can continue with Fable
            and GPT-5.6 Sol, or the strongest authorized GPT runtime available.
          </p>
        </div>

        <div className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-4 lg:max-w-md">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <HeartHandshake className="h-4 w-4 text-emerald-300" />
            Fund the agent wallet
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This is the agent wallet for LEVI development funding. SOL sent here
            is intended for approved contract deployments and development tasks
            around the token. Funding is voluntary and does not guarantee a
            specific delivery date or scope until it is reviewed.
          </p>
          <div className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-200">
              <Wallet className="h-4 w-4" />
              Agent wallet
            </div>
            <p className="mt-2 break-all font-mono text-sm text-white">
              {LEVI_DEVELOPMENT_WALLET}
            </p>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <MessageCircle className="h-4 w-4" />
            Use the LEVI chat to describe what the agent wallet funding should
            support.
          </p>
        </div>
      </div>
    </section>
  );
}
