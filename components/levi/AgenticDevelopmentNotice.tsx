import { Bot, HeartHandshake, MessageCircle, Wallet } from "lucide-react";
import { AGENT_K9_DEVELOPMENT_WALLET } from "@/lib/levi/community";

export function AgenticDevelopmentNotice() {
  return (
    <section className="levi-panel">
      <div className="levi-panel-header flex-col lg:flex-row">
        <div className="max-w-3xl">
          <div className="levi-section-label">
            <Bot className="h-4 w-4" />
            Agentic page
          </div>
          <h2 className="levi-panel-title">
            Community proposals can become agent-built features.
          </h2>
          <p className="levi-panel-copy">
            Agent K9 is an agentic development surface. Propose tools,
            games, dashboards, scanner ideas, or token-growth work in the K9
            chat. Community-backed ideas can be turned into scoped development
            tasks for the autonomous agent, supervised by developer Magneto.
            When the agent wallet reaches the SOL needed for approved
            deployment or development work, the agent can continue with Fable
            and GPT-5.6 Sol, or the strongest authorized GPT runtime available.
          </p>
        </div>

        <div className="levi-wallet-panel">
          <div className="levi-section-label text-white">
            <HeartHandshake className="h-4 w-4 text-amber-300" />
            Fund the agent wallet
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This is the agent wallet for K9 development funding. SOL sent here
            is intended for approved contract deployments and development tasks
            around the token. Funding is voluntary and does not guarantee a
            specific delivery date or scope until it is reviewed.
          </p>
          <div className="mt-4 border-t border-amber-400/20 pt-3">
            <div className="levi-section-label">
              <Wallet className="h-4 w-4" />
              Agent wallet
            </div>
            <p className="levi-wallet-address">
              {AGENT_K9_DEVELOPMENT_WALLET}
            </p>
          </div>
          <p className="levi-panel-note">
            <MessageCircle className="h-4 w-4" />
            Use the K9 chat to describe what the agent wallet funding should
            support.
          </p>
        </div>
      </div>
    </section>
  );
}
