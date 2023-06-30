// import { useState, useEffect } from "react";
// const Moralis = require('moralis').default;
// const { EvmChain } = require('@moralisweb3/common-evm-utils');
// import Select from "react-select";
// import styles from "../styles/Home.module.css";

// export default function Header() {
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState("");
//   const [chainValue, setChainValue] = useState("");
//   let address;

//   const valueOptions = [
//     { value: "eth", label: "AVALANCHE" },
    
//   ];

//   const customStyles = {
//     option: (provided) => ({
//       ...provided,
//       color: "#000000",
//       backgroundColor: "#ffffff",
//     }),
//   };

//   const changeHandler = (chainValue) => {
//     setChainValue(chainValue);
//   };



//   // ...

// const handleSubmit = async () => {
//   address = document.querySelector("#contractAddress").value;
//   const chain = EvmChain.AVALANCHE;

//   const response = await Moralis.EvmApi.token.getTokenPrice({
//     address,
//     chain,
//   });

//   setResult(`$ ${response.toJSON().usdPrice}`);
//   setShowResult(true);
//   setChainValue("");
//   document.querySelector("#contractAddress").value = "";
// };

// // ...


//   // ...resto del componente...





//   return (
//     <section className={styles.main}>
//       <form
//         className={styles.getTokenForm}
//         name="create-profile-form"
//         method="POST"
//         action="#"
//       >
//         <label className={styles.label} htmlFor="contractAddress">
//           Add ERC20 Contract Address
//         </label>
//         <input
//           className={styles.contractAddress}
//           type="text"
//           id="contractAddress"
//           name="contractAddress"
//           maxLength="120"
//           required
//         />
//         <label className={styles.label} htmlFor="contractAddress">
//           Select Chain
//         </label>
//         <Select
//           styles={customStyles}
//           options={valueOptions}
//           value={chainValue}
//           instanceId="long-value-select"
//           onChange={changeHandler}
//         />
//       </form>
//       <button className={styles.form_btn} onClick={handleSubmit}>
//         Submit
//       </button>
//       <section className={styles.result}>
//         {showResult && <p>{result}</p>}
//       </section>
//     </section>
//   );
// }

// import { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import styles from "../styles/Home.module.css";
// import Moralis from 'moralis';

// Moralis.start({
//   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// });

// const Main = () => {
//   const [contractPrice, setContractPrice] = useState(0);

//   const fetchContractPrice = async () => {
//     const address = "0xa010cd55a383251c5996b697d02a818e542e2fc3";
//     const chain = EvmChain.AVALANCHE;

//     const response = await Moralis.EvmApi.token.getTokenPrice({
//       address,
//       chain,
//     });

//     setContractPrice(response.toJSON().usdPrice);
//   };

//   useEffect(() => {
//     fetchContractPrice();

//     const interval = setInterval(fetchContractPrice, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className={styles.main}>
//       <p>Contract Price: $ {contractPrice}</p>
//     </section>
//   );
// };

// export default Main;








// import { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import styles from "../styles/Home.module.css";
// import Moralis from 'moralis';

// Moralis.start({
//   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// });

// const Main = () => {
//   const [contractPrices, setContractPrices] = useState([]);

//   const addresses = [
//     "0xa010cd55a383251c5996b697d02a818e542e2fc3",
//     "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5",
//   ];

//   const fetchContractPrices = async (addresses) => {
//     const chain = EvmChain.AVALANCHE;
//     const prices = [];

//     for (const address of addresses) {
//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address,
//         chain,
//       });

//       const price = response.toJSON().usdPrice;
//       prices.push({ address, price });
//     }

//     return prices;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const prices = await fetchContractPrices(addresses);
//       setContractPrices(prices);
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className={styles.main}>
//       <p>Contract Prices:</p>
//       <ul>
//         {contractPrices.map((contract) => (
//           <li key={contract.address}>
//             Address: {contract.address}, Price: ${contract.price}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Main;






// import { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import styles from "../styles/Home.module.css";
// import Moralis from 'moralis';

// // Moralis.start({
// //   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// // });

// const Main = () => {
//   const [contractPrices, setContractPrices] = useState([]);
//   const [searchAddress, setSearchAddress] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState("");

//   const addresses = [
//     "0xa010cd55a383251c5996b697d02a818e542e2fc3",
//     "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5",
//   ];

//   const fetchContractPrices = async (addresses) => {
//     const chain = EvmChain.AVALANCHE;
//     const prices = [];

//     for (const address of addresses) {
//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address,
//         chain,
//       });

//       const price = response.toJSON().usdPrice;
//       prices.push({ address, price });
//     }

//     return prices;
//   };

//   const handleSearch = async () => {
//     if (searchAddress) {
//       const chain = EvmChain.AVALANCHE;

//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: searchAddress,
//         chain,
//       });

//       setResult(`$ ${response.toJSON().usdPrice}`);
//       setShowResult(true);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const prices = await fetchContractPrices(addresses);
//       setContractPrices(prices);
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className={styles.main}>
//       <div className={styles.getTokenForm}>
//         <label className={styles.label} htmlFor="contractAddress">
//           Add ERC20 Contract Address
//         </label>
//         <input
//           className={styles.contractAddress}
//           type="text"
//           id="contractAddress"
//           name="contractAddress"
//           maxLength="120"
//           required
//           value={searchAddress}
//           onChange={(e) => setSearchAddress(e.target.value)}
//         />
//         <button className={styles.form_btn} onClick={handleSearch}>
//           Submit
//         </button>
//         <section className={styles.result}>
//           {showResult && <p>{result}</p>}
//         </section>
//       </div>

//       <p className={styles.result}>Avax MemeCoins</p>
//       <ul>
//         {contractPrices.map((contract) => (
//           <li className={styles.result} key={contract.address}>
//             Address: {contract.address}, Price: ${contract.price}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// };

// export default Main;








// import { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import Moralis from 'moralis';

// // Moralis.start({
// //   apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
// // });

// const Main = () => {
//   const [contractPrices, setContractPrices] = useState([]);
//   const [searchAddress, setSearchAddress] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState("");

//   const addresses = [
//     "0xa010cd55a383251c5996b697d02a818e542e2fc3",
//     "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5",
//   ];

//   const fetchContractPrices = async (addresses) => {
//     const chain = EvmChain.AVALANCHE;
//     const prices = [];

//     for (const address of addresses) {
//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address,
//         chain,
//       });

//       const price = response.toJSON().usdPrice;
//       prices.push({ address, price });
//     }

//     return prices;
//   };

//   const handleSearch = async () => {
//     if (searchAddress) {
//       const chain = EvmChain.AVALANCHE;

//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: searchAddress,
//         chain,
//       });

//       setResult(`$ ${response.toJSON().usdPrice}`);
//       setShowResult(true);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const prices = await fetchContractPrices(addresses);
//       setContractPrices(prices);
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-blue-500 mb-8">
//           Token Price App
//         </h1>

//         <div className="flex flex-col space-y-4 mb-8">
//           <label className=" text-blue-400 font-bold">Add ERC20 Contract Address</label>
//           <input
//             className="px-4 py-2 rounded border-blue-500 border"
//             type="text"
//             id="contractAddress"
//             name="contractAddress"
//             maxLength="120"
//             required
//             value={searchAddress}
//             onChange={(e) => setSearchAddress(e.target.value)}
//           />
//           <button
//             className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={handleSearch}
//           >
//             Submit
//           </button>
//           {showResult && <p className="text-red-400">{result}</p>}
//         </div>

//         <h2 className="text-4xl font-bold text-blue-500 mb-4">Contract Prices:</h2>
//         <ul className="space-y-2">
//           {contractPrices.map((contract) => (
//             <li key={contract.address}>
//               Address: {contract.address}, Price: ${contract.price}
//             </li>
//           ))}
//         </ul>
//       </div>
      
//     </section>
//   );
// };

// export default Main;




// import React, { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import Moralis from 'moralis';

// const Main = () => {
//   const [contractPrices, setContractPrices] = useState([]);
//   const [searchAddress, setSearchAddress] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState("");

//   const addresses = [
//     { address: "0xa010cd55a383251c5996b697d02a818e542e2fc3", name: "BENQIFANS" },
//     { address: "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5", name: "BENQI" },
//   ];

//   const fetchContractPrices = async (addresses) => {
//     const chain = EvmChain.AVALANCHE;
//     const prices = [];

//     for (const address of addresses) {
//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: address.address,
//         chain,
//       });

//       const price = Number(response.toJSON().usdPrice).toFixed(2);
//       prices.push({ ...address, price });
//     }

//     return prices;
//   };

//   const handleSearch = async () => {
//     if (searchAddress) {
//       const chain = EvmChain.AVALANCHE;

//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: searchAddress,
//         chain,
//       });

//       setResult(`$ ${Number(response.toJSON().usdPrice).toFixed(2)}`);
//       setShowResult(true);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const prices = await fetchContractPrices(addresses);
//       setContractPrices(prices);
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-blue-500 mb-8">
//           Token Price App
//         </h1>

//         <div className="flex flex-col space-y-4 mb-8">
//           <label className=" text-blue-400 font-bold">Add ERC20 Contract Address</label>
//           <input
//             className="px-4 py-2 rounded border-blue-500 border"
//             type="text"
//             id="contractAddress"
//             name="contractAddress"
//             maxLength="120"
//             required
//             value={searchAddress}
//             onChange={(e) => setSearchAddress(e.target.value)}
//           />
//           <button
//             className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={handleSearch}
//           >
//             Submit
//           </button>
//           {showResult && <p className="text-red-400">{result}</p>}
//         </div>

//         <h2 className="text-4xl font-bold text-blue-500 mb-4">Contract Prices:</h2>
//         <ul className="space-y-2">
//           {contractPrices.map((contract) => (
//             <li key={contract.address}>
//               <div className="flex items-center justify-between">
//                 <img
//                   src={`/${contract.address}.png`}
//                   alt={contract.name}
//                   className="w-8 h-8 mr-4"
//                 />
//                 <p className="text-yellow-500">{contract.name}</p>
//                 <p>{contract.price}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default Main;


// import React, { useState, useEffect } from "react";
// import { EvmChain } from '@moralisweb3/common-evm-utils';
// import Moralis from 'moralis';

// const Main = () => {
//   const [contractPrices, setContractPrices] = useState([]);
//   const [searchAddress, setSearchAddress] = useState("");
//   const [showResult, setShowResult] = useState(false);
//   const [result, setResult] = useState("");

//   const addresses = [
//     { address: "0xa010cd55a383251c5996b697d02a818e542e2fc3", name: "BENQI", logo: "BENQI.png" },
//     { address: "0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5", name: "BENQIFANS", logo: "BENQIFANS.png" },
//   ];

//   const fetchContractPrices = async (addresses) => {
//     const chain = EvmChain.AVALANCHE;
//     const prices = [];

//     for (const address of addresses) {
//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: address.address,
//         chain,
//       });

//       const price = Number(response.toJSON().usdPrice).toFixed(8).replace(/\.?0+$/, '');
//       prices.push({ ...address, price });
//     }

//     return prices;
//   };

//   const handleSearch = async () => {
//     if (searchAddress) {
//       const chain = EvmChain.AVALANCHE;

//       const response = await Moralis.EvmApi.token.getTokenPrice({
//         address: searchAddress,
//         chain,
//       });

//       setResult(`$ ${Number(response.toJSON().usdPrice).toFixed(8).replace(/\.?0+$/, '')}`);
//       setShowResult(true);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       const prices = await fetchContractPrices(addresses);
//       setContractPrices(prices);
//     };

//     fetchData();

//     const interval = setInterval(fetchData, 30000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <section className="container mx-auto px-4 py-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-center text-blue-500 mb-8">
//           Token Price App
//         </h1>

//         <div className="flex flex-col space-y-4 mb-8">
//           <label className="text-blue-400 font-bold">Add ERC20 Contract Address</label>
//           <input
//             className="px-4 py-2 rounded border-blue-500 border"
//             type="text"
//             id="contractAddress"
//             name="contractAddress"
//             maxLength="120"
//             required
//             value={searchAddress}
//             onChange={(e) => setSearchAddress(e.target.value)}
//           />
//           <button
//             className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
//             onClick={handleSearch}
//           >
//             Submit
//           </button>
//           {showResult && <p className="text-red-400">{result}</p>}
//         </div>

//         <h2 className="text-4xl font-bold text-blue-500 mb-4">Contract Prices:</h2>
//         <ul className="space-y-2">
//           {contractPrices.map((contract) => (
//             <li key={contract.address}>
//               <div className="flex items-center justify-between">
//                 <img
//                   src={`/img/${contract.logo}`}
//                   alt={contract.name}
//                   className="w-8 h-8 mr-4"
//                 />
//                 <div className="flex flex-col">
//                   <p className="text-yellow-500">{contract.name}</p>
//                   <p>${contract.price}</p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default Main;


// import { useState } from 'react';
// import axios from 'axios';
// import 'tailwindcss/tailwind.css'

// const main = () => {
//   const [contractAddress, setContractAddress] = useState('');
//   const [tokenPrice, setTokenPrice] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const response = await axios.get(`https://api.coingecko.com/api/v3/coins/{tu_api_endpoint}?contract_address=${contractAddress}`);
//     setTokenPrice(response.data.market_data.current_price.usd);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//       <form onSubmit={handleSubmit} className="flex flex-col items-center">
//         <input 
//           type="text" 
//           placeholder="Dirección del contrato" 
//           onChange={(e) => setContractAddress(e.target.value)}
//           className="px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
//         />
//         <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Obtener Precio</button>
//       </form>
//       {tokenPrice && <p className="mt-4 text-lg">Precio del Token: ${tokenPrice}</p>}
//     </div>
//   );
// };

// export default main;

import { useState } from 'react';
import axios from 'axios';

const TokenPrice = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenPrice, setTokenPrice] = useState(null);

  const fetchTokenPrice = async () => {
    try {
      const response = await axios.get(`https://api.geckoterminal.com/api/v2/networks/avax/tokens/${tokenAddress}/pools`, {
        headers: {
          'Accept': 'application/json;version=20230302',
        },
      });

      const poolData = response.data.data;
      
      // Supongamos que usamos el precio del primer pool
      if (poolData && poolData.length > 0) {
        setTokenPrice(poolData[0].attributes.token_price_usd);
      } else {
        setTokenPrice('No se encontró el precio del token.');
      }
    } catch (error) {
      setTokenPrice('Ocurrió un error al buscar el precio del token.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <div className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="text-center">
          <div className="text-xl font-medium text-black">Precio del token</div>
          <div className="mt-2 text-gray-500">
            Introduce la dirección del contrato del token para obtener su precio en USD.
          </div>
          <input 
            type="text" 
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value)}
            className="mt-4 w-full rounded-md border-gray-300"
          />
          <button 
            onClick={fetchTokenPrice}
            className="mt-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg"
          >
            Obtener precio
          </button>
          {tokenPrice && (
            <div className="mt-4 text-gray-700">
              Precio: {tokenPrice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPrice;

