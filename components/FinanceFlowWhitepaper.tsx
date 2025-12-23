import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRocket, FaHandshake, FaChartLine, FaGlobe } from "react-icons/fa";

const FinanceFlowWhitepaper = () => {
  const features = [
    {
      icon: <FaRocket className="text-4xl text-blue-400" />,
      title: "List your assets",
      description:
        "Bring transparency to the community and showcase your real-world assets",
    },
    {
      icon: <FaHandshake className="text-4xl text-green-400" />,
      title: "Gain full support",
      description: "Strengthen your real world strategy with community backing",
    },
    {
      icon: <FaChartLine className="text-4xl text-purple-400" />,
      title: "Partner with us",
      description:
        "Enter DeFi thanks to IOTA technology and innovative solutions",
    },
    {
      icon: <FaGlobe className="text-4xl text-pink-400" />,
      title: "Global expansion",
      description:
        "World wide expansion of open source business real world assets",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Finance Flow
          </CardTitle>
          <p className="text-xl text-gray-300 mt-2">
            Real World Assets powered by IOTA
          </p>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Looking for funding your business finance flow it&apos;s a capital
              funding foundation where we all win win, list your assets bring
              transparency to the community and gain full support on your real
              world strategy by partnering with us you get In to DeFi thanks to
              iota where you gain support on your real world business on a
              synergy throw iota technology, threshold company best performance
              income all in treasury. Following the IOTA real world assets
              philosophy.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Fuel the decentralisation, by a founder of new era is business
              opportunity, give birth to your dreams with world wide expansion
              of open source business real world assets with flexible grow and
              borderlines fees respected, provide liquidity with out
              interruptions on sovereign rules of with country foundation you
              work on. Supply earn delegate.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800/50 border-gray-700 h-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
        <CardContent className="p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Supply · Earn · Delegate · Grow
          </h3>
          <p className="text-gray-300 text-lg">
            Join the future of decentralized finance with Flow Finance
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FinanceFlowWhitepaper;
