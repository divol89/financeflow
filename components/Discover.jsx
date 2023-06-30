// // const Discover = () => {
// //   return (
// //     <section className="flex flex-wrap space-between items-center  text-center justify-center ">
// //       <div className="w-full  lg:w-1/2 px-4 lg:order-2">
// //         <h2 className="text-3xl text-white font-bold mb-4">Discover</h2>
// //         <p className="text-xl text-white mb-4 font-bold">
// //           Get in the flow with <span className="text-yellow-500">FinanceFlow</span> Explore, trade, and analyze on <strong className="">Avalanche's blockchain</strong>.
// //         </p>
// //         <p className="text-xl text-white mb-4 font-bold">
// //           Navigate through an array of <span className="text-blue-400">memecoins</span> and exciting projects.
// //         </p>
// //         <p className="text-xl text-white mb-4 font-bold">
// //           Uncover promising  opportunities in the realm of <span className="text-blue-400">Avax</span>.
// //         </p>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Discover;




// // import React, { useState } from 'react';
// // import { Button } from 'antd';
// // import { useMediaQuery } from 'react-responsive';

// // const items = [
// //   { 
// //     title: 'Item 1', 
// //     description: 'la mejor plataforma de crasfsdfsdfsdfsdsdfsdafsgdsfhgtrheragagdsfg', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'Item 2', 
// //     description: 'This is the description for Item 2.', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'Item 3', 
// //     description: 'This is the description for Item 3.', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'Item 4', 
// //     description: 'This is the description for Item 4.', 
// //     image: '/img/item4.png' 
// //   },
// // ];

// // const Discover = () => {
// //   const [selectedItem, setSelectedItem] = useState(items[0]);
// //   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

// //   const handleItemClick = (item) => {
// //     setSelectedItem(item);
// //   };

// //   return (
// //     <div className="Discover p-4 grid md:grid-cols-3 gap-4">
// //       <h1 className="text-3xl mb-4 col-span-full">Discover</h1>
      
// //       <div className="md:col-span-2 flex flex-col items-center   md:flex-row">
// //         <img src={selectedItem.image} alt={selectedItem.title} className="mb-4 md:mr-4"/>
// //         <div>
// //           <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
// //           <p className="text-white">{selectedItem.description}</p>
// //         </div>
// //       </div>
      
// //       <div className={isMobile ? "flex overflow-x-auto" : "grid grid-flow-row gap-4"}>
// //         {items.map((item, index) => (
// //           <Button 
// //             key={index} 
// //             className="whitespace-nowrap" 
// //             type={item.title === selectedItem.title ? "primary" : "default"} 
// //             onClick={() => handleItemClick(item)}
// //           >
// //             {item.title}
// //           </Button>
// //         ))}
// //       </div>
      
// //     </div>
// //   );
// // };

// // export default Discover;


// // import React, { useState } from 'react';
// // import { Button } from 'antd';
// // import { useMediaQuery } from 'react-responsive';
// // import classNames from 'classnames';


// // const items = [
// //   { 
// //     title: 'FlowSwap', 
// //     description: 'This is the description for Item 1.', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'Vote Funding', 
// //     description: 'This is the description for Item 2.', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'Project Listing', 
// //     description: 'This is the description for Item 3.', 
// //     image: '/img/parilla.png' 
// //   },
// //   { 
// //     title: 'charting ', 
// //     description: 'This is the description for Item 4.', 
// //     image: '/img/parilla.png' 
// //   },
// // ];

// // const Discover = () => {
// //   const [selectedItem, setSelectedItem] = useState(items[0]);
// //   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

// //   const handleItemClick = (item) => {
// //     setSelectedItem(item);
// //   };

// //   return (
// //     <div className=" text-white p-4 grid md:grid-cols-3 gap-4">
// //       <h1 className="text-2xl lg:text-3xl mb-2 col-span-full">Discover</h1>
      
// //       <div className="md:col-span-2 grid md:grid-cols-1 md:grid-rows-2 gap-4">
// //         <img src={selectedItem.image} alt={selectedItem.title} className="mb-2 md:mr-4"/>
// //         <div>
// //           <h2 className=" text-white text-2xl font-bold mb-5 lg:text-3xl">{selectedItem.title}</h2>
// //           <p className="text-white text-2xl lg:text-4xl">{selectedItem.description}</p>
// //         </div>
// //       </div>
      
// //       <div className={classNames({ flex: isMobile, 'grid grid-flow-row gap-2': !isMobile })}>
// //         {items.map((item, index) => (
// //           <Button 
// //             key={index} 
// //             className="whitespace-nowrap" 
// //             type={item.title === selectedItem.title ? "primary" : "default"} 
// //             onClick={() => handleItemClick(item)}
// //           >
// //             {item.title}
// //           </Button>
// //         ))}
// //       </div>
      
// //     </div>
// //   );
// // };

// // export default Discover;




// import React, { useState } from 'react';
// import { Button } from 'antd';
// import { useMediaQuery } from 'react-responsive';
// import classNames from 'classnames';

// const items = [
//   { 
//     title: 'FlowSwap', 
//     description: 'This is the description for Item 1.', 
//     image: '/img/parilla.png' 
//   },
//   { 
//     title: 'Vote Funding', 
//     description: 'This is the description for Item 2.', 
//     image: '/img/parilla.png' 
//   },
//   { 
//     title: 'Project Listing', 
//     description: 'This is the description for Item 3.', 
//     image: '/img/parilla.png' 
//   },
//   { 
//     title: 'charting ', 
//     description: 'This is the description for Item 4.', 
//     image: '/img/parilla.png' 
//   },
// ];

// const Discover = () => {
//   const [selectedItem, setSelectedItem] = useState(items[0]);
//   const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <div className="text-white p-4 grid md:grid-cols-3 gap-4">
//       <h1 className="text-2xl lg:text-3xl mb-2 col-span-full">Discover</h1>
      
//       <div className="md:col-span-2 grid md:grid-cols-1 md:grid-rows-2 gap-4">
//         <img src={selectedItem.image} alt={selectedItem.title} className="mb-2 md:mr-4"/>
//         <div>
//           <h2 className="text-white text-2xl font-bold mb-5 lg:text-3xl">{selectedItem.title}</h2>
//           <p className="text-white text-2xl lg:text-4xl">{selectedItem.description}</p>
//         </div>
//       </div>
      
//       <div className={classNames({ 'flex flex-wrap': isMobile, 'grid grid-flow-row gap-2': !isMobile })}>
//         {items.map((item, index) => (
//           <Button 
//             key={index} 
//             className="whitespace-nowrap" 
//             type={item.title === selectedItem.title ? 'primary' : 'default'} 
//             onClick={() => handleItemClick(item)}
//           >
//             {item.title}
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Discover;

// import React, { useState } from 'react';

// const items = [
//   {
//     title: 'FlowSwap',
//     description: 'FlowSwap: Empowering Users with LI.FI and Beyond. Be part of the groundbreaking evolution from LI.FI widget to a fully functional autonomous DEX.',
//     image: '/img/swap.png',
//   },
//   {
//     title: 'Vote Funding',
//     description: 'Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.',
//     image: '/img/vote.png',
//   },
//   {
//     title: 'Project Listing',
//     description: 'Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.',
//     image: '/img/listing.png',
//   },
//   {
//     title: 'Charting Studio',
//     description: 'Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.',
//     image: '/img/charting.png',
//   },
// ];

// const Discover = () => {
//   const [selectedItem, setSelectedItem] = useState(items[0]);

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <div className="text-white  font-bold p-4 grid ">
//   <div className=" inline-flex overflow-auto lg:justify-center">
//     {items.map((item, index) => (
//       <button
//         key={index}
//         className={`whitespace-nowrap m-2   ${
//           item.title === selectedItem.title ? 'bg-yellow-300' : 'bg-yellow-500'
//         } text-white font-bold lg:text-2xl  px-6 py-5 rounded-full`}
//         onClick={() => handleItemClick(item)}
//       >
//         {item.title}
//       </button>
//     ))}
//   </div>

//   <div className="grid lg:flex  lg:justify-center lg:items-center lg:pt-40">
//     <img src={selectedItem.image} alt={selectedItem.title}    className="lg:mb-0 lg: md:mr-0 lg:w-1/4" />
//     <div className="-mt-44 lg:w-1/4">
//       <h2 className="text-white text-2xl md:text-4xl lg:text-5xl mb-0  lg:text-center">{selectedItem.title}</h2>
//       <p className="text-white mb-24 sm:text-sm md:text-2xl lg:text-2xl lg:mb-40 lg:mt-20  lg:text-center   lg:mr-8 ">{selectedItem.description}</p>
//     </div>
//   </div>
// </div>

//   );
// };

// export default Discover;








// import React, { useState } from 'react';
// import Image from 'next/legacy/image';


// const items = [
//   {
//     title: 'FlowSwap',
//     description: 'FlowSwap: Empowering Users with LI.FI and Beyond. Be part of the groundbreaking evolution from LI.FI widget to a fully functional autonomous DEX.',
//     image: '/img/swap.png',
//   },
//   {
//     title: 'Vote Funding',
//     description: 'Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.',
//     image: '/img/vote.png',
//   },
//   {
//     title: 'Project Listing',
//     description: 'Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.',
//   image: '/img/listing.png',
// },
//   {
//     title: 'Charting Studio',
//     description: 'Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.',
//     image: '/img/charting.png',
//   },
// ];

// const Discover = () => {
//   const [selectedItem, setSelectedItem] = useState(items[0]);

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <div className="text-white font-bold p-4 grid">
//       <h2 className='text-center pb-6 text-2xl font-bold lg:text-4xl'>
//         Discover
//       </h2>
//       <p className='text-center italic'>
//         The Future or Near 
//       </p>
//       <div className="inline-flex overflow-auto lg:justify-center">
//         {items.map((item, index) => (
//           <button
//             key={index}
//             className={`whitespace-nowrap m-2 ${
//               item.title === selectedItem.title ? 'bg-yellow-300' : 'bg-yellow-500'
//             } text-white font-bold lg:text-2xl px-6 py-0.4 rounded`}
//             onClick={() => handleItemClick(item)}
//           >
//             {item.title}
//           </button>
//         ))}
//       </div>
      

//       <div className="grid lg:flex lg:justify-center lg:items-center lg:pt-40">
//         {/* <img src={selectedItem.image} alt={selectedItem.title} className="lg:mb-0 lg:md:mr-0 lg:w-1/4" /> */}
//            <img src={selectedItem.image} alt={selectedItem.title} layout="fill" objectFit="cover" className="lg:mb-0 lg:md:mr-0 lg:w-1/4"/>

//         <div className="-mt-44 md:mb-54 lg:w-1/2">
//           <h2 className="text-white text-2xl pb-2 text-center md:text-4xl lg:text-5xl mb-0 lg:text-center">{selectedItem.title}</h2>
//           <p className="text-white pl-4 mb-18 sm:text-sm md:text-2xl lg:text-2xl lg:mb-38 lg:mt-20 lg:text-center lg:mr-8">{selectedItem.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Discover;


// import React, { useState } from 'react';
// import Image from 'next/image';

// const items = [
//   {
//     title: 'FlowSwap',
//     description: 'FlowSwap: Empowering Users with LI.FI and Beyond. Be part of the groundbreaking evolution from LI.FI widget to a fully functional autonomous DEX.',
//     image: '/img/swap.png',
//   },
//   {
//     title: 'Vote Funding',
//     description: 'Unlock the Power of Collective Decision-Making with Vote Funding. Join a community-led platform that harnesses the wisdom of the crowd to shape the future of projects and proposals.',
//     image: '/img/vote.png',
//   },
//   {
//     title: 'Project Listing',
//     description: 'Showcase Your Project with Project Listing: Gain visibility for your own project by listing it in a platform that connects creators and enthusiasts from around the world.',
//     image: '/img/listing.png',
//   },
//   {
//     title: 'Charting Studio',
//     description: 'Future-Proofing Your Charting Experience: By investing in ongoing development, Charting Studio is future-proofing your charting experience, preparing to introduce cutting-edge technologies and innovative features that will keep you ahead of the curve in the dynamic world of cryptocurrency analysis.',
//     image: '/img/charting.png',
//   },
// ];

// const Discover = () => {
//   const [selectedItem, setSelectedItem] = useState(items[0]);

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <div className="text-white font-bold p-4 grid">
//       <h2 className="text-center pb-6 text-2xl font-bold lg:text-4xl">Discover</h2>
//       <p className="text-center italic">The Future or Near</p>
//       <div className="inline-flex overflow-auto lg:justify-center">
//         {items.map((item, index) => (
//           <button
//             key={index}
//             className={`whitespace-nowrap m-2 ${
//               item.title === selectedItem.title ? 'bg-yellow-300' : 'bg-yellow-500'
//             } text-white font-bold lg:text-2xl px-6 py-0.4 rounded`}
//             onClick={() => handleItemClick(item)}
//           >
//             {item.title}
//           </button>
//         ))}
//       </div>

//       <div className="grid lg:flex lg:justify-center lg:items-center lg:pt-40">
//         <div className="relative lg:w-1/4">
//           <Image src={selectedItem.image} alt={selectedItem.title} layout="fill" objectFit="cover" />
//         </div>
//         <div className="-mt-44 md:mb-54 lg:w-1/2">
//           <h2 className="text-white text-2xl pb-2 text-center md:text-4xl lg:text-5xl mb-0 lg:text-center">{selectedItem.title}</h2>
//           <p className="text-white pl-4 mb-18 sm:text-sm md:text-2xl lg:text-2xl lg:mb-38 lg:mt-20 lg:text-center lg:mr-8">{selectedItem.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Discover;


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








