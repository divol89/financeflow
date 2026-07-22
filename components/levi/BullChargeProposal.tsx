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
  "Play without a token holding requirement.",
  "Tap or click to charge through obstacles.",
  "Collect green candles and avoid red bears.",
  "Compete on a daily leaderboard.",
];

const rewards = [
  "Top players can qualify for a community-sponsored prize pool.",
  "One random participant can receive a surprise reward.",
  "Skill, participation and public challenges can unlock cosmetic perks.",
  "Any future reward mechanic will remain separate from platform access.",
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
          <h2 className="levi-panel-title">K9 Pursuit</h2>
          <p className="levi-panel-copy">
            A viral K9 mini-game concept where players charge through market
            obstacles, collect green candles, and compete for daily rewards.
          </p>
        </div>

        <div className="levi-list-columns">
          <div className="levi-list-column">
            <div className="levi-list-heading">
              <CandlestickChart className="h-5 w-5 text-amber-300" />
              Gameplay
            </div>
            <ul className="levi-list">
              {gameLoop.map((item) => (
                <li key={item}>
                  <ShieldCheck className="mt-1 h-4 w-4 flex-none text-amber-300" />
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
        <HeartHandshake className="mt-0.5 h-5 w-5 flex-none text-amber-300" />
        <p>
          This is a proposal stage feature. The community can fund the agent
          wallet with SOL for contract deployment and request next steps in the
          K9 chat; once the approved funding threshold is reached, the
          autonomous agent can continue implementation with Fable and GPT-5.6
          Sol under Magneto supervision.
        </p>
      </div>
    </section>
  );
}
