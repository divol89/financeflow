// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Collapse } from 'antd';
// import PriceLineChart from './PriceLineChart';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const { Panel } = Collapse;

// const tokens = [
//   { address: '0x8729438eb15e2c8b576fcc6aecda6a148776c0f5', name: 'BENQI', logo: '/img/BENQI.png', poolAddress: '0x2774516897ac629ad3ed9dcac7e375dda78412b9' },
//   { address: '0x51e48670098173025c477d9aa3f0eff7bf9f7812', name: 'DegenX', logo: '/img/dgnx.png', poolAddress: '0xbcabb94006400ed84c3699728d6ecbaa06665c89' },
//   // Agrega más tokens aquí
//   { address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', name: 'Avax', logo: '/img/avax.png', poolAddress: '0xf4003f4efbe8691b60249e6afbd307abe7758adb' },
//   { address: '0x22d4002028f537599be9f666d1c4fa138522f9c8', name: 'Platypus', logo: '/img/platypus.png', poolAddress: '0xcdfd91eea657cc2701117fe9711c9a4f61feed23' },
//   { address: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd', name: 'JOE', logo: '/img/joe2.png', poolAddress: '0x454e67025631c065d3cfad6d71e6892f74487a15' },
//   { address: '0x60781c2586d68229fde47564546784ab3faca982', name: 'Pangolin', logo: '/img/pangolin.png', poolAddress: '0xd7538cabbf8605bde1f4901b47b8d42c61de0367' },
//   { address: '0x62edc0692bd897d2295872a9ffcac5425011c661', name: 'GMX', logo: '/img/gmx.png', poolAddress: '0x0c91a070f862666bbcce281346be45766d874d98' },
// ];

// const TokenGrid = ({ setSelectedPoolAddress }) => {
//   const [tokenPrices, setTokenPrices] = useState([]);
//   const [selectedToken, setSelectedToken] = useState(null);

//   useEffect(() => {
//     const fetchTokenPrices = async () => {
//       const prices = [];

//       for (let token of tokens) {
//         try {
//           const response = await axios.get(`https://api.geckoterminal.com/api/v2/networks/avax/tokens/${token.address}/pools`, {
//             headers: {
//               Accept: 'application/json;version=20230302',
//             },
//           });

//           const poolData = response.data.data;

//           if (poolData && poolData.length > 0) {
//             const tokenPrice = parseFloat(poolData[0].attributes.token_price_usd);
//             const decimalDigits = tokenPrice.toString().split('.')[1] || '';
//             const firstNonZeroIndex = [...decimalDigits].findIndex((digit) => digit !== '0');
//             const significantDigits = decimalDigits.substring(firstNonZeroIndex, firstNonZeroIndex + 2);
//             const displayPrice = tokenPrice.toFixed(firstNonZeroIndex + 2).replace(/0+$/, '');
//             prices.push({ ...token, price: `$${displayPrice}` });
//           } else {
//             prices.push({ ...token, price: 'No se encontró el precio del token.' });
//           }
//         } catch (error) {
//           prices.push({ ...token, price: 'Ocurrió un error al buscar el precio del token.' });
//         }
//       }

//       setTokenPrices(prices);
//     };

//     fetchTokenPrices();
//   }, []);

//   const handleTokenClick = (token) => {
//     setSelectedToken(token);
//     setSelectedPoolAddress(token.poolAddress);
//   };

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="flex flex-col items-center bg-transparent p-10 lg:pb-24">
//       <div className="w-full md:w-3/4 mb-4 md:order-1">
//         {selectedToken && (
//           <Collapse bordered={false}>
//             <Panel header={selectedToken.name} key="1">
//               <div className="chart">
//                 <PriceLineChart poolAddresses={selectedToken.poolAddress} />
//               </div>
//             </Panel>
//           </Collapse>
//         )}
//       </div>
//       <div className="w-full rounded-xl md:w-3/4 order-1 md:order-2">
//         <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
//           {tokenPrices.map((token) => (
//             <div
//               key={token.address}
//               className="token-button flex flex-col items-center justify-center  p-4 ml-0 md:ml-2  md:p-4 md:w-1/2"
//               onClick={() => handleTokenClick(token)}
//             >
//               <div className="text-3xl">{selectedToken === token ? token.price : null}</div>
//               <div className="text-3xl">{token.name}</div>
//               <div className="flex items-center justify-center ">
//                 <img src={token.logo} alt={token.name} className="logo-image" />
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default TokenGrid;



////////////////////////////////////////////////////////////////  


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse } from 'antd';
import PriceLineChart from './PriceLineChart';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useTokens } from '../contexts/TokenContext';
import Image from 'next/image';

const { Panel } = Collapse;


const TokenGrid = ({ setSelectedPoolAddress }) => {
  
  const [tokenPrices, setTokenPrices] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const { tokens } = useTokens(); // Usa tokens desde el contexto

  useEffect(() => {
    const fetchTokenPrices = async () => {
      const prices = [];

      for (let token of tokens) {
        try {
          const response = await axios.get(`https://api.geckoterminal.com/api/v2/networks/avax/tokens/${token.address}/pools`, {
            headers: {
              Accept: 'application/json;version=20230302',
            },
          });

          const poolData = response.data.data;

          if (poolData && poolData.length > 0) {
            const tokenPrice = parseFloat(poolData[0].attributes.token_price_usd);
            const decimalDigits = tokenPrice.toString().split('.')[1] || '';
            const firstNonZeroIndex = [...decimalDigits].findIndex((digit) => digit !== '0');
            const displayPrice = tokenPrice.toFixed(firstNonZeroIndex + 2).replace(/0+$/, '');
            prices.push({ ...token, price: `$${displayPrice}` });
          } else {
            prices.push({ ...token, price: 'No se encontró el precio del token.' });
          }
        } catch (error) {
          prices.push({ ...token, price: 'Ocurrió un error al buscar el precio del token.' });
        }
      }

      setTokenPrices(prices);
    };

    fetchTokenPrices();
  }, [tokens]); // Agrega tokens a la dependencia de useEffect para que se ejecute cuando tokens cambie

  const handleTokenClick = (token) => {
    setSelectedToken(token);
    setSelectedPoolAddress(token.poolAddress);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
//     <div className="flex flex-col items-center bg-transparent p-10 lg:pb-24">
//       <div className="w-full md:w-3/4 mb-4 md:order-1">
//         {selectedToken && (
//           <Collapse bordered={false}>
//             <Panel header={selectedToken.name} key="1">
//               <div className="chart">
//                 <PriceLineChart poolAddresses={selectedToken.poolAddress} />
//               </div>
//             </Panel>
//           </Collapse>
//         )}
//       </div>
//       <div className="w-full rounded-xl md:w-3/4 order-1 md:order-2">
//         <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
//           {tokenPrices.map((token) => (
//             <div
//               key={token.address}
//               className="token-button flex flex-col items-center justify-center  p-4 ml-0 md:ml-2  md:p-4 md:w-1/2"
//               onClick={() => handleTokenClick(token)}
//             >
//               <div className="text-3xl">{selectedToken === token ? token.price : null}</div>
//               <div className="text-3xl">{token.name}</div>
//               <div className="flex items-center justify-start ">
//               <Image src={token.logo} alt={token.name} layout="fill" className="logo-image" />

//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };
<div className="flex flex-col items-center bg-transparent p-10 lg:pb-24">
  <div className="w-full md:w-3/4 mb-4 md:order-1">
    {selectedToken && (
      <Collapse bordered={false}>
        <Panel header={selectedToken.name} key="1">
          <div className="chart">
            <PriceLineChart poolAddresses={selectedToken.poolAddress} />
          </div>
        </Panel>
      </Collapse>
    )}
  </div>
  <div className="w-full  rounded-xl md:w-3/4 order-1 md:order-2">
    <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
      {tokenPrices.map((token) => (
        <div
          key={token.address}
          className="token-button text- flex flex-col items-center justify-center p-4 ml-0 md:ml-2 md:p-4 md:w-1/2"
          onClick={() => handleTokenClick(token)}
        >
          <div className="token-name ">{token.name}</div>
          <div className="flex items-center justify-center">
            <Image src={token.logo} alt={token.name} fill className="logo-image" />
          </div>
          <div className="token-price">{selectedToken === token ? token.price : null}</div>
        </div>
      ))}
    </Slider>
  </div>
</div>
);
};



export default TokenGrid;
