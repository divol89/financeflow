import React, { useState } from "react";
import Image from "next/legacy/image";

const items = [
  // {
  //   title: "FlowSwap",
  //   description:
  //     "FlowSwap: Empowering Users with LI.FI and Beyond. Be part of the groundbreaking evolution from LI.FI widget to a fully functional autonomous DEX.",
  //   image: "/img/swap.png",
  // },
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
];

const Discover = () => {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [showMagicPumpInfo, setShowMagicPumpInfo] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleMagicPumpClick = () => {
    setShowMagicPumpInfo(!showMagicPumpInfo);
  };

  return (
    <div className="text-white font-bold p-4 grid mt-20 lg:mt-44">
      {/* <h2 className="text-center pb-6 text-2xl font-bold lg:text-4xl text-flow-gradient">
        Discover
      </h2>
      <p className="text-center italic text-gold mb-6">The Future or Near</p> */}
      <div className="inline-flex lg:text-2xl overflow-auto lg:justify-center">
        {items.map((item, index) => (
          <button
            key={index}
            className={`whitespace-nowrap m-2 ${item.title === selectedItem.title
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
              : "bg-gradient-to-r from-cyan-400 to-blue-500 text-white opacity-70 hover:opacity-100"
              } font-bold px-6 py-2 rounded transition-all duration-300`}
            onClick={() => handleItemClick(item)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid lg:flex lg:justify-center lg:items-center lg:pt-20">
        <div className="relative align-middle h-64 w-full lg:w-1/4 lg:h-full">
          <div className="mt-4 relative h-full w-32 mx-auto lg:w-2/4 lg:h-full">
            <Image
              src={selectedItem.image}
              alt={selectedItem.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="mb-6 justify-start md:mb-54 lg:w-1/2 lg:mt-0">
          <h2 className="text-flow-gradient text-2xl pb-2 text-center md:text-2xl  mb-4 lg:text-center">
            {selectedItem.title}
          </h2>
          <p className=" pl-4 mb-18 sm:text-sm md:text-xl lg:text-sm lg:mb-38 lg:mt-10 lg:text-center lg:mr-8">
            {selectedItem.description}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleMagicPumpClick}
          className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-2 px-4 rounded hover:from-purple-500 hover:to-pink-600 transition-all duration-300"
        >
          {showMagicPumpInfo ? "Hide MagicPump Info" : "Learn About MagicPump"}
        </button>
        {showMagicPumpInfo && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-flow-gradient">MagicPump Functionality</h3>
            <p className="text-description-gradient">
              MagicPump is an innovative feature designed to optimize token liquidity and price stability.
              It uses advanced algorithms to automatically adjust buy and sell pressure, helping to maintain
              a healthy token ecosystem. With MagicPump, traders can enjoy smoother price action and reduced volatility,
              while project owners benefit from improved token performance and increased investor confidence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
