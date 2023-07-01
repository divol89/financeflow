import React, { useState } from 'react';
import Image from 'next/legacy/image';

const items = [
  {
    title: 'FlowSwap',
    description: 'FlowSwap: Empowering Users with LI.FI and Beyond. Be part of the groundbreaking evolution from LI.FI widget to a fully functional autonomous DEX.',
    image: '/img/swap.png',
  },
  {
    title: 'Vote Funding',
    description: 'Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.',
    image: '/img/vote.png',
  },
  {
    title: 'Project Listing',
    description: 'Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.',
    image: '/img/listing.png',
  },
  {
    title: 'Charting Studio',
    description: 'Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.',
    image: '/img/charting.png',
  },
];

const Discover = () => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="text-white font-bold p-4 grid">
      <h2 className="text-center pb-6 text-2xl font-bold lg:text-4xl">Discover</h2>
      <p className="text-center italic">The Future or Near</p>
      <div className="inline-flex overflow-auto lg:justify-center">
        {items.map((item, index) => (
          <button
            key={index}
            className={`whitespace-nowrap m-2 ${
              item.title === selectedItem.title ? 'bg-yellow-300' : 'bg-yellow-500'
            } text-white font-bold lg:text-2xl px-6 py-0.4 rounded`}
            onClick={() => handleItemClick(item)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid lg:flex lg:justify-center lg:items-center lg:pt-40">
        <div className="relative align-middle h-64  w-full lg:w-1/4 lg:h-full ">
        <div className=" mt-4 relative h-full w-32 mx-auto lg:w-2/4 lg:h-full"> {/* Ajusta el tamaño y centra la imagen */}

            <Image src={selectedItem.image} alt={selectedItem.title} layout="fill" objectFit="contain" />
          </div>
        </div>
        <div className="mb-6 justify-start md:mb-54 lg:w-1/2 lg:mt-0">
          <h2 className="text-white text-2xl pb-2 text-center md:text-4xl lg:text-5xl mb-0 lg:text-center">{selectedItem.title}</h2>
          <p className="text-white pl-4 mb-18 sm:text-sm md:text-2xl lg:text-2xl lg:mb-38 lg:mt-20 lg:text-center lg:mr-8">{selectedItem.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Discover;








