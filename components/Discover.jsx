"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  {
    title: "Vote Funding",
    description:
      "Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.",
    image: "/img/vote.png",
  },
  {
    title: "Project Listing",
    description:
      "Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.",
    image: "/img/listing.png",
  },
  {
    title: "Charting Studio",
    description:
      "Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.",
    image: "/img/charting.png",
  },
]

export default function Discover() {
  const [showMagicPumpInfo, setShowMagicPumpInfo] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
              <CardHeader className="py-2">
                <CardTitle className="text-lg md:text-xl text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between p-2">
                <div className="relative h-20 mb-2">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <CardDescription className="text-gray-300 text-xs">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={() => setShowMagicPumpInfo(!showMagicPumpInfo)}
          className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white"
        >
          {showMagicPumpInfo ? "Hide MagicPump Info" : "Learn About MagicPump"}
        </Button>
        {showMagicPumpInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-4 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  MagicPump Functionality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  MagicPump is an innovative feature designed to optimize token liquidity and price stability.
                  It uses advanced algorithms to automatically adjust buy and sell pressure, helping to maintain
                  a healthy token ecosystem. With MagicPump, traders can enjoy smoother price action and reduced volatility,
                  while project owners benefit from improved token performance and increased investor confidence.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}