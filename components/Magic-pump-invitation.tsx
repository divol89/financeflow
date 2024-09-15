import React from "react";
import { motion } from "framer-motion";
import { FaVoteYea, FaCoins, FaChartLine, FaLock } from "react-icons/fa";

const features = [
  {
    icon: <FaVoteYea />,
    title: "Community Voting",
    description:
      "Users vote on tokens by contributing IOTA. Minimum vote cost is 0.001 IOTA.",
  },
  {
    icon: <FaCoins />,
    title: "Token Acquisition",
    description: (
      <>
        When the threshold is reached, the winning token is automatically
        purchased through Magicsea. For more details, visit:{" "}
        <a
          href="https://app.magicsea.finance/liquidityv3"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline"
        >
          Magicsea
        </a>
        .
      </>
    ),
  },
  {
    icon: <FaChartLine />,
    title: "Reward Distribution",
    description:
      "50% of acquired tokens are distributed to voters based on their contribution.",
  },
  {
    icon: <FaLock />,
    title: "Security Measures",
    description:
      "Implements ReentrancyGuard and Pausable for enhanced security.",
  },
];

export default function MagicPumpInvitation() {
  return (
    <div className=" text-white   md:py-0 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="bg-gradient-to-r from-blue-400 to-purple-500  text-3xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          MagicPump: Community-Driven Token Acquisition
        </motion.h2>
        {/* <div className="flex  justify-center mb-8">
          <Image
            src="/img/magicpump.jpg"
            alt="MagicPump"
            className="rounded-lg w-1/4 shadow-lg"
            width={110}
            height={32}
            onClick={() => router.push("/MagicPump")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.cursor = "pointer";
              e.currentTarget.style.transition = "transform 0.3s ease-in-out";
              e.currentTarget.style.border = "2px solid #6347FA";
              e.currentTarget.style.boxShadow =
                "0 0 10px 0 rgba(99, 71, 250, 0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-gray-800 p-6 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl text-cyan-400 mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.p
          className="mt-8 text-center text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          MagicPump allows for dynamic staking and includes additional features
          like reward claiming and contract state debugging,in the next coming
          features the contract will be renounced and will be able to work
          autonomously after the staking contract get deployed.the staking
          contract will play a major role in the project.
        </motion.p>
      </div>
    </div>
  );
}
