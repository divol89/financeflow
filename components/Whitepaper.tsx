import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaVoteYea,
  FaProjectDiagram,
  FaChartLine,
  FaUsers,
  FaCoins,
  FaChartBar,
  FaRocket,
  FaInfoCircle,
  FaLayerGroup,
} from "react-icons/fa";

// At the top of the file, add this type definition
type NodeType = {
  x: number;
  y: number;
  icon: JSX.Element;
  title: string;
  description: string;
};

const items = [
  {
    title: "Vote Funding",
    description:
      "Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.",
    image: "/img/vote.png",
    icon: <FaVoteYea className="text-4xl text-cyan-400" />,
  },
  {
    title: "Project Listing",
    description:
      "Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.",
    image: "/img/listing.png",
    icon: <FaProjectDiagram className="text-4xl text-purple-400" />,
  },
  {
    title: "Charting Studio",
    description:
      "Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.",
    image: "/img/charting.png",
    icon: <FaChartLine className="text-4xl text-pink-400" />,
  },
  {
    title: "Dynamic Staking",
    description:
      "Participate in our innovative staking system that rewards community building and active participation. Stake your tokens to earn rewards and help shape the future of Flow Finance.",
    image: "/img/staking.jpg",
    icon: <FaLayerGroup className="text-4xl text-green-400" />,
  },
];

const funnelSteps = [
  {
    title: "Community Participation",
    description:
      "Users join the Flow Finance platform and become part of the decision-making community.",
    icon: <FaUsers className="text-5xl text-blue-400" />,
  },
  {
    title: "Project Voting",
    description:
      "Community members vote on which projects or tokens should be funded or acquired.",
    icon: <FaVoteYea className="text-5xl text-green-400" />,
  },
  {
    title: "Token Acquisition",
    description:
      "Based on voting results, Flow Finance automatically acquires the chosen tokens.",
    icon: <FaCoins className="text-5xl text-yellow-400" />,
  },
  {
    title: "Reward Distribution",
    description:
      "Profits from successful token acquisitions are distributed among participating community members and the staking pool.",
    icon: <FaChartBar className="text-5xl text-red-400" />,
  },
  {
    title: "Dynamic Staking",
    description:
      "50% of generated profits are allocated to the staking pool, fueling technology development and community rewards.",
    icon: <FaLayerGroup className="text-5xl text-green-400" />,
  },
];

const Node = ({
  x,
  y,
  icon,
  title,
  onClick,
}: {
  x: number;
  y: number;
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <g
    transform={`translate(${x},${y})`}
    onClick={onClick}
    className="cursor-pointer"
  >
    <circle
      r="45"
      fill="rgba(59, 130, 246, 0.2)"
      stroke="#3b82f6"
      strokeWidth="3"
    />
    <foreignObject x="-35" y="-35" width="70" height="70">
      <div className="flex items-center justify-center h-full bg-blue-500 rounded-full">
        {React.cloneElement(icon, { className: "text-4xl text-white" })}
      </div>
    </foreignObject>
    <text y="75" textAnchor="middle" fill="white" className="text-sm font-bold">
      {title}
    </text>
  </g>
);

const Arrow = ({
  start,
  end,
  text,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  text: string;
}) => {
  const reductionFactor = 1; // Ajusta este valor entre 0 y 1 para controlar la longitud de la flecha

  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const newEndX = start.x + dx * reductionFactor;
  const newEndY = start.y + dy * reductionFactor;

  return (
    <g>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
        </marker>
      </defs>
      <line
        x1={start.x}
        y1={start.y}
        x2={newEndX}
        y2={newEndY}
        stroke="#8b5cf6"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
      />
      <text
        x={(start.x + newEndX) / 2}
        y={(start.y + newEndY) / 2}
        dy="-10"
        textAnchor="middle"
        fill="white"
        className="text-sm font-bold"
      >
        {text}
      </text>
    </g>
  );
};

export default function Whitepaper() {
  const [showMagicPumpInfo, setShowMagicPumpInfo] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);

  const nodes = [
    {
      x: 300,
      y: 100,
      icon: <FaUsers />,
      title: "Community Participation",
      description:
        "Users join the Flow Finance platform and become part of the decision-making community.",
    },
    {
      x: 150,
      y: 250,
      icon: <FaVoteYea />,
      title: "Project Voting",
      description:
        "Community members vote on which projects or tokens should be funded or acquired.",
    },
    {
      x: 450,
      y: 250,
      icon: <FaCoins />,
      title: "Token Acquisition",
      description:
        "Based on voting results, Flow Finance automatically acquires the chosen tokens.",
    },
    {
      x: 300,
      y: 400,
      icon: <FaChartBar />,
      title: "Reward Distribution",
      description:
        "Profits from successful token acquisitions are distributed among participating community members and the staking pool.",
    },
    {
      x: 600,
      y: 175,
      icon: <FaProjectDiagram />,
      title: "",
      description:
        "Showcase your project by listing it on a platform that connects creators and enthusiasts.",
    },
    {
      x: 600,
      y: 325,
      icon: <FaChartLine />,
      title: "Charting Studio",
      description:
        "Advanced charting tools for cryptocurrency analysis and future-proofing your trading experience.",
    },
    {
      x: 750,
      y: 250,
      icon: <FaRocket />,
      title: "MagicPump",
      description:
        "Innovative feature designed to optimize token liquidity and price stability using advanced algorithms.",
    },
    {
      x: 450,
      y: 400,
      icon: <FaLayerGroup />,
      title: "Dynamic Staking",
      description:
        "50% of generated profits fuel technology development and community rewards through an innovative staking system.",
    },
  ];

  const arrows = [
    { start: nodes[0], end: nodes[1], text: "" },
    { start: nodes[1], end: nodes[2], text: "" },
    { start: nodes[2], end: nodes[3], text: "" },
    { start: nodes[3], end: nodes[0], text: "Reinvest" },
    { start: nodes[2], end: nodes[4], text: "" },
    { start: nodes[2], end: nodes[5], text: "" },
    { start: nodes[2], end: nodes[6], text: "Optimize" },
    { start: nodes[3], end: nodes[7], text: "Stake" },
    { start: nodes[7], end: nodes[0], text: "" },
  ];

  return (
    <div className="min-h-screen text-gray-100 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Flow Finance: Revolutionizing DeFi Voting and Token Acquisition
        </motion.h1>

        <Tabs defaultValue="introduction" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-[6rem] lg:grid-cols-3 rounded-xl p-1">
            <TabsTrigger
              value="introduction"
              className="text-lg  hover:shadow-lg hover:shadow-cyan-500/50 transition-all bg-gray-600/50 duration-300 bg font-semibold"
            >
              Introduction
            </TabsTrigger>
            <TabsTrigger
              value="how-it-works"
              className="text-lg  hover:shadow-lg hover:shadow-cyan-500/50 transition-all bg-gray-600/50 duration-300 font-semibold"
            >
              How It Works
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="text-lg  hover:shadow-lg hover:shadow-cyan-500/50 transition-all bg-gray-600/50 duration-300 font-semibold"
            >
              Features
            </TabsTrigger>
          </TabsList>
          <TabsContent value="introduction">
            <Card className="mt-6 bg-gray-800/50  hover:shadow-lg hover:shadow-cyan-600/50 transition-all duration-300 bg  border-gray-700">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-cyan-300">
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl leading-relaxed text-gray-300 mb-6">
                  Flow Finance is at the forefront of decentralized finance
                  (DeFi) innovation, introducing a groundbreaking approach to
                  community-driven token acquisition and reward distribution. By
                  leveraging smart contract technology and collective
                  decision-making, Flow Finance aims to empower users to
                  participate in exciting token opportunities while fostering
                  community growth through an innovative staking system.
                </p>
                <div
                  className="relative w-full bg-gray-900/50 rounded-lg p-4"
                  style={{ height: "60vh" }}
                >
                  <svg width="90%" height="100%" viewBox="0 0 800 500">
                    {arrows.map((arrow, index) => (
                      <Arrow
                        key={index}
                        start={arrow.start}
                        end={arrow.end}
                        text={arrow.text}
                      />
                    ))}
                    {nodes.map((node, index) => (
                      <Node
                        key={index}
                        x={node.x}
                        y={node.y}
                        icon={node.icon}
                        title={node.title}
                        description={node.description}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                  </svg>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: selectedNode ? 1 : 0,
                    y: selectedNode ? 0 : 20,
                  }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 bg-gray-800/80 p-4 rounded-lg shadow-lg"
                >
                  {selectedNode && (
                    <>
                      <h2 className="text-2xl font-bold mb-2 flex items-center text-cyan-300">
                        {React.cloneElement(selectedNode.icon, {
                          className: "mr-2 text-4xl",
                        })}
                        {selectedNode.title}
                      </h2>
                      <p className="text-gray-300 text-lg">
                        {selectedNode.description}
                      </p>
                    </>
                  )}
                  {!selectedNode && (
                    <div className="flex items-center justify-center text-gray-400">
                      <FaInfoCircle className="mr-2" />
                      <span className="text-lg">
                        Click on a node to view more information
                      </span>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="how-it-works">
            <Card className="mt-6 bg-gray-800/50  border-gray-700">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-cyan-300">
                  How Flow Finance Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-12 flex flex-col lg:w-full items-center text-center">
                  {funnelSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className="flex flex-col lg:flex-row items-center lg:items-start bg-gray-700/30 rounded-lg p-6 w-full"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
                        <div className="bg-blue-500 rounded-full p-4 lg:w-20 lg:h-20 flex items-center justify-center shadow-lg">
                          {React.cloneElement(step.icon, {
                            className: "text-5xl text-white",
                          })}
                        </div>
                      </div>
                      <div className="lg:flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-purple-300">
                          {step.title}
                        </h3>
                        <p className="text-gray-300 text-lg">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card className="mt-6 bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-cyan-300">
                  Our Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-700/50 border-gray-600 h-full flex flex-col hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                        <CardHeader className="py-4 flex items-center justify-center">
                          <div className="bg-blue-500 rounded-full p-4 mb-4">
                            {React.cloneElement(item.icon, {
                              className: "text-4xl text-white",
                            })}
                          </div>
                          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between p-4">
                          <div className="relative h-32 mb-4">
                            <Image
                              src={item.image}
                              alt={item.title}
                              layout="fill"
                              objectFit="contain"
                              className="rounded-lg"
                            />
                          </div>
                          <CardDescription className="text-gray-300 text-base">
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-16">
                  <Button
                    onClick={() => setShowMagicPumpInfo(!showMagicPumpInfo)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-bold px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto mb-8 shadow-lg"
                  >
                    <FaRocket className="mr-2 text-2xl" />
                    {showMagicPumpInfo
                      ? "Hide MagicPump Info"
                      : "Learn About MagicPump"}
                  </Button>
                  <AnimatePresence>
                    {showMagicPumpInfo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="mt-8 bg-gray-700/50 border-gray-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center justify-center">
                              <FaRocket className="mr-2 text-4xl" />
                              MagicPump Functionality
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 text-xl leading-relaxed">
                              MagicPump is an innovative feature designed to
                              optimize token liquidity and price stability. It
                              uses advanced algorithms to automatically adjust
                              buy and sell pressure, helping to maintain a
                              healthy token ecosystem. With MagicPump, traders
                              can enjoy smoother price action and reduced
                              volatility, while project owners benefit from
                              improved token performance and increased investor
                              confidence.
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
