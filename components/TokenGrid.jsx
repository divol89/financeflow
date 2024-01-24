////////////////////////////////////////////////////////////////  


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Collapse } from 'antd';
// import PriceLineChart from './PriceLineChart';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import { useTokens } from '../contexts/TokenContext';
// import Image from 'next/image';

// const { Panel } = Collapse;


// const TokenGrid = ({ setSelectedPoolAddress }) => {
  
//   const [tokenPrices, setTokenPrices] = useState([]);
//   const [selectedToken, setSelectedToken] = useState(null);
//   const { tokens } = useTokens(); // Usa tokens desde el contexto

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
//           console.log('API Response Data:', poolData); // Log the API response data

//           if (poolData && poolData.length > 0) {
//             const tokenPrice = parseFloat(poolData[0].attributes.token_price_usd);
//             const decimalDigits = tokenPrice.toString().split('.')[1] || '';
//             const firstNonZeroIndex = [...decimalDigits].findIndex((digit) => digit !== '0');
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
//   }, [tokens]); // Agrega tokens a la dependencia de useEffect para que se ejecute cuando tokens cambie

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

// <div className="flex flex-col items-center bg-transparent p-10 lg:pb-24">
//   <div className="w-full md:w-3/4 mb-4 md:order-1">
//     {selectedToken && (
//       <Collapse bordered={false}>
//         <Panel header={selectedToken.name} key="1">
//           <div className="chart">
//             <PriceLineChart  poolAddresses={selectedToken.poolAddress}/>
//           </div>
//         </Panel>
//       </Collapse>
//     )}
//   </div>
//   <div className="w-full  rounded-xl md:w-3/4 order-1 md:order-2">
//     <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
//       {tokenPrices.map((token) => (
//         <div
//           key={token.address}
//           className="token-button text- flex flex-col items-center justify-center p-4 ml-0 md:ml-2 md:p-4 md:w-1/2"
//           onClick={() => handleTokenClick(token)}
//         >
//           <div className="token-name ">{token.name}</div>
//           <div className="flex items-center justify-center">
//             <Image src={token.logo} alt={token.name} fill className="logo-image" />
//           </div>
//           <div className="token-price">{selectedToken === token ? token.price : null}</div>
//         </div>
//       ))}
//     </Slider>
//   </div>
// </div>
// );
// };



// export default TokenGrid;


/////////////////////////////
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Collapse } from 'antd';
// import PriceLineChart from './PriceLineChart';
// import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import { useTokens } from '../contexts/TokenContext';
// import Image from 'next/image';

// const { Panel } = Collapse;

// const TokenGrid = ({ setSelectedPoolAddress }) => {
//   const [tokenPrices, setTokenPrices] = useState([]);
//   const [selectedToken, setSelectedToken] = useState(null);
//   const { tokens } = useTokens(); // Usa tokens desde el contexto

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
//           console.log('API Response Data:', poolData); // Log the API response data

//           if (poolData && poolData.length > 0) {
//             const pool = poolData[0];
//             const poolId = pool.id;
//             const poolAttributes = pool.attributes;
//             const tokenPrice = parseFloat(poolAttributes.base_token_price_usd);
//             const decimalDigits = tokenPrice.toString().split('.')[1] || '';
//             const firstNonZeroIndex = [...decimalDigits].findIndex((digit) => digit !== '0');
//             const displayPrice = tokenPrice.toFixed(firstNonZeroIndex + 2).replace(/0+$/, '');
//             const logoUrl = tokens.find((t) => t.address === token.address)?.logo || ''; // Obtiene la URL del logo del token
//             prices.push({ ...token, price: `$${displayPrice}`, poolId, poolAttributes, logoUrl });
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
//   }, [tokens]);

//   const handleTokenClick = (token) => {
//     setSelectedToken(token);
//     setSelectedPoolAddress(token.poolId);
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
//                       <PriceLineChart  poolAddresses={selectedToken.poolAddress}/>


//               </div>
//             </Panel>
//           </Collapse>
//         )}
//       </div>
//       <div className="w-full  rounded-xl md:w-3/4 order-1 md:order-2">
//         <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
//           {tokenPrices.map((token) => (
//             <div
//               key={token.address}
//               className="token-button text- flex flex-col items-center justify-center p-4 ml-0 md:ml-2 md:p-4 md:w-1/2"
//               onClick={() => handleTokenClick(token)}
//             >
//               <div className="token-name ">{token.name}</div>
//               <div className="flex items-center justify-center">
//                 <Image src={token.logoUrl} alt={token.name} fill className="logo-image" />
//               </div>
//               <div className="token-price">{selectedToken === token ? token.price : null}</div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default TokenGrid;



////////////////////////////////////////////////////////////////


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
          console.log('API Response Data:', poolData); // Log the API response data

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

<div className="flex flex-col items-center bg-transparent p-10 lg:pb-24 relative">
  <div className="w-full md:w-3/4 mb-4 md:order-1 relative">
    {selectedToken && (
      <Collapse bordered={false}>
        <Panel header={selectedToken.name} key="1">
          <div className="chart">
            <PriceLineChart  poolAddresses={selectedToken.poolAddress}/>
          </div>
        </Panel>
      </Collapse>
    )}
  </div>
  <div className="w-full  rounded-xl md:w-3/4 order-1 md:order-2 relative">
    <Slider {...settings} autoplay={true} autoplaySpeed={2000}>
      {tokenPrices.map((token) => (
        <div
          key={token.address}
          className="token-button text- flex flex-col items-center justify-center p-4 ml-0 md:ml-2 md:p-4 md:w-1/2 relative"
          onClick={() => handleTokenClick(token)}
        >
          <div className="token-name  ">{token.name}</div>
          <div className="flex flex-col items-center w-contain h-contain justify-center relative">
            <Image src={token.logo} alt={token.name}  width={64} height={64}  />
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
