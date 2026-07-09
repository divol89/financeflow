import React from "react";
import { Users, Vote, Coins, TrendingUp, Sparkles } from "lucide-react";

const items = [
  {
    icon: Users,
    title: "Join the Community",
    description: "Become part of a vibrant, decision-making community that shapes the future of DeFi.",
  },
  {
    icon: Vote,
    title: "Vote on Projects",
    description: "Have your say in which projects get funded, directly influencing the platform's direction.",
  },
  {
    icon: Coins,
    title: "Benefit from Acquisitions",
    description: "Enjoy the rewards as Flow Finance acquires tokens based on community decisions.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Assets",
    description: "Participate in dynamic staking and earn rewards from successful acquisitions.",
  },
  {
    icon: Sparkles,
    title: "Experience MagicPump",
    description: "Benefit from optimized token liquidity and price stability with our innovative feature.",
  },
];

export default function ParticipationFunnel() {
  return (
    <section className="py-16 text-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-center text-3xl font-bold text-transparent">
          Why Participate in Flow Finance?
        </h2>
        <div className="mx-auto max-w-4xl">
          {items.map(({ icon: Icon, title, description }) => (
            <article key={title} className="mb-8 overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 shadow-xl">
              <header className="flex flex-row items-center gap-4 bg-gradient-to-r from-purple-600/50 to-blue-600/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 text-purple-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
              </header>
              <div className="p-6 text-gray-300">{description}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
