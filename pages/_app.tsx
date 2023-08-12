// /* eslint-disable import/no-default-export */
// import type { AppProps } from 'next/app';
// import '../styles/tailwind.css';
// import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
// const activeChainId = ChainId.AvalancheFujiTestnet;


// function MyApp({ Component, pageProps }: AppProps) {
//   return<ThirdwebProvider  activeChain={activeChainId}>  
//   <Component {...pageProps} />   
//   </ThirdwebProvider>
// }


// export default MyApp;


/* eslint-disable import/no-default-export */


////////////////////////////////////////////////////////////////

// import type { AppProps } from 'next/app';
// import  '../styles/tailwind.css';
// import { TokenContextProvider } from '../contexts/TokenContext'; // Importa el proveedor de contexto
// import React from "react";
// import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
// import { Analytics } from '@vercel/analytics/react';



// const activeChainId = ChainId.AvalancheFujiTestnet;

// function MyApp({ Component, pageProps }: AppProps) {
//   return(
//     <TokenContextProvider>  {/* Envuelve la aplicación con el proveedor de contexto */}
//       <ThirdwebProvider activeChain={activeChainId}>
//         <Component {...pageProps} />
//         <Analytics />
//       </ThirdwebProvider>
//       </TokenContextProvider>

//   );
// }

// export default MyApp;


////////////////////////////////////////////////////////////////
import type { AppProps } from 'next/app';
import '../styles/tailwind.css';
import { TokenContextProvider } from '../contexts/TokenContext';
import React from "react";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from '@vercel/analytics/react';

const activeChainId = ChainId.AvalancheFujiTestnet;
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID; // Access the clientId from environment variables

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={activeChainId} clientId={clientId}> {/* ThirdwebProvider wraps everything */}
      <TokenContextProvider>
        <Component {...pageProps} />
        <Analytics />
      </TokenContextProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
