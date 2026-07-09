import React from "react";
import { ShieldCheck, Vote, Coins, Settings } from "lucide-react";

const features = [
  {
    icon: <Vote className="h-8 w-8" />,
    title: "Community Voting",
    description: "Users vote on tokens by contributing IOTA. Minimum vote cost is 0.001 IOTA.",
  },
  {
    icon: <Coins className="h-8 w-8" />,
    title: "Token Acquisition",
    description: "When the threshold is reached, the winning token is automatically purchased through Magicsea.",
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Reward Distribution",
    description: "50% of acquired tokens are distributed to voters based on their contribution.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Security Measures",
    description: "Implements ReentrancyGuard and Pausable for enhanced security.",
  },
];

export default function MagicPumpInvitation() {
  return (
    <section className="px-4 py-12 text-white md:py-0">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-center text-3xl font-bold text-transparent">
          MagicPump: Community-Driven Token Acquisition
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg bg-gray-800 p-6 shadow-xl shadow-purple-950/20">
              <div className="mb-4 flex items-center">
                <div className="mr-4 text-3xl text-cyan-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300">
                {feature.description} {feature.title === "Token Acquisition" && (
                  <a href="https://app.magicsea.finance/" target="_blank" rel="noreferrer" className="text-cyan-300 underline">For more details, visit Magicsea.</a>
                )}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm leading-relaxed text-gray-300 md:text-base">
          MagicPump allows for dynamic staking and includes additional features like reward claiming and contract state debugging, in the next coming features the contract will be renounced and will be able to work autonomously after the staking contract get deployed. The staking contract will play a major role in the project.
        </p>
      </div>
    </section>
  );
}
