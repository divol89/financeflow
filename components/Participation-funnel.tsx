import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaVoteYea,
  FaCoins,
  FaChartLine,
  FaRocket,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const funnelSteps = [
  {
    icon: <FaUsers />,
    title: "Join the Community",
    description:
      "Become part of a vibrant, decision-making community that shapes the future of DeFi.",
  },
  {
    icon: <FaVoteYea />,
    title: "Vote on Projects",
    description:
      "Have your say in which projects get funded, directly influencing the platform's direction.",
  },
  {
    icon: <FaCoins />,
    title: "Benefit from Acquisitions",
    description:
      "Enjoy the rewards as Flow Finance acquires tokens based on community decisions.",
  },
  {
    icon: <FaChartLine />,
    title: "Grow Your Assets",
    description:
      "Participate in dynamic staking and earn rewards from successful acquisitions.",
  },
  {
    icon: <FaRocket />,
    title: "Experience MagicPump",
    description:
      "Benefit from optimized token liquidity and price stability with our innovative feature.",
  },
];

export default function ParticipationFunnel() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Why Participate in Flow Finance?
        </h2>
        <div className="max-w-4xl mx-auto">
          {funnelSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="mb-8 bg-gray-800/50 border-gray-700 overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-purple-600/50 to-blue-600/50 p-4">
                  <div className="rounded-full bg-white p-2 w-12 h-12 flex items-center justify-center">
                    {React.cloneElement(step.icon, {
                      className: "text-2xl text-purple-600",
                    })}
                  </div>
                  <CardTitle className="text-1xl font-bold text-white">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <CardDescription className="text-gray-300 text-lg">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
