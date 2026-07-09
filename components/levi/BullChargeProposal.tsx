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
    <section className="levi-panel">
      <div className="levi-bull-grid">
        <div>
          <div className="levi-section-label text-yellow-200">
            <Gamepad2 className="h-4 w-4" />
            Proposed game
          </div>
          <h2 className="levi-panel-title">Bull Charge</h2>
          <p className="levi-panel-copy">
            A viral LEVI mini-game concept where holders charge through market
            obstacles, collect green candles, and compete for daily rewards.
          </p>
        </div>

        <div className="levi-list-columns">
          <div className="levi-list-column">
            <div className="levi-list-heading">
              <CandlestickChart className="h-5 w-5 text-emerald-300" />
              Gameplay
            </div>
            <ul className="levi-list">
              {gameLoop.map((item) => (
                <li key={item}>
                  <ShieldCheck className="mt-1 h-4 w-4 flex-none text-emerald-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="levi-list-column">
            <div className="levi-list-heading">
              <Trophy className="h-5 w-5 text-yellow-300" />
              Rewards and utility
            </div>
            <ul className="levi-list">
              {rewards.map((item) => (
                <li key={item}>
                  <Flame className="mt-1 h-4 w-4 flex-none text-orange-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="levi-proposal-note">
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
