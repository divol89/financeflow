// import React, { useEffect, useState } from 'react';

// const ShimmerPrice = () => {
//   const [price, setPrice] = useState(null);

//   useEffect(() => {
//     const fetchPrice = async () => {
//       try {
//         const response = await fetch(
//           'https://api.coingecko.com/api/v3/simple/price?ids=shimmer&vs_currencies=usd'
//         );
//         const data = await response.json();
//         const shimmerPrice = data.shimmer.usd;
//         setPrice(shimmerPrice);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchPrice();
//   }, []);

//   return (
//     <div className='flex flex-col w-full items-center  lg: '>
//      <img src="/img/shimmer.png" alt="shimmer.network" className="w-8 h-8 " />
//      <p className='text-sm'>SMR</p>
//     {price !== null ? (
//         <p className='font-bold'>${price}</p> 
//       ) : (
//         <p>Loading price...</p>
//       )}
//     </div>
//   );
// };

// export default ShimmerPrice;


////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const ShimmerPrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=shimmer&vs_currencies=usd'
        );
        const data = await response.json();
        const shimmerPrice = data.shimmer.usd;
        setPrice(shimmerPrice);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPrice();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <Image
        src="/img/shimmer.png"
        alt="shimmer.network"
        width={32}
        height={32}
      />
      <p className="text-sm">SMR</p>
      {price !== null ? (
        <p className="font-bold">${price}</p>
      ) : (
        <p>Loading price...</p>
      )}
    </div>
  );
};

export default ShimmerPrice;
