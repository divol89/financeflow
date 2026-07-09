import {
  CandlestickChart,
  Flame,
  Gamepad2,
  HeartHandshake,
  ShieldCheck,
  Trophy,
} from "lucide-react";

const gameLoop = [
  "Connect a Solana wallet.",
  "Hold the required LEVI balance to play.",
  "Tap or click to charge through obstacles.",
  "Collect green candles and avoid red bears.",
  "Compete on a daily leaderboard.",
];

const rewards = [
  "Top 10 players split the daily LEVI prize pool.",
  "One random holder can receive a Lucky Bull reward.",
  "Holding more LEVI can unlock extra lives, skins, or perks.",
  "A tiny LEVI burn can be used as the entry mechanic after contracts are ready.",
];

export function BullChargeProposal() {
  return (
    <section className="rounded-lg border border-yellow-300/20 bg-black/70 p-5 shadow-2xl shadow-yellow-950/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="lg:w-1/3">
          <div className="inline-flex items-center gap-2 rounded-md border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-semibold uppercase text-yellow-200">
            <Gamepad2 className="h-4 w-4" />
            Proposed game
          </div>
          <h2 className="mt-4 text-3xl font-black text-white">Bull Charge</h2>
          <p className="mt-3 leading-7 text-slate-300">
            A viral LEVI mini-game concept where holders charge through market
            obstacles, collect green candles, and compete for daily rewards.
          </p>
        </div>

        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 font-semibold text-white">
              <CandlestickChart className="h-5 w-5 text-emerald-300" />
              Gameplay
            </div>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300">
              {gameLoop.map((item) => (
                <li key={item} className="flex gap-2">
                  <ShieldCheck className="mt-1 h-4 w-4 flex-none text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Trophy className="h-5 w-5 text-yellow-300" />
              Rewards and utility
            </div>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300">
              {rewards.map((item) => (
                <li key={item} className="flex gap-2">
                  <Flame className="mt-1 h-4 w-4 flex-none text-orange-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
        <HeartHandshake className="mt-0.5 h-5 w-5 flex-none text-emerald-300" />
        <p>
          This is a proposal stage feature. The community can fund the agent
          wallet with SOL for contract deployment and request next steps in the
          LEVI chat; once the approved funding threshold is reached, the
          autonomous agent can continue implementation with Fable and GPT-5.6
          Sol under Magneto supervision.
        </p>
      </div>
    </section>
  );
}
