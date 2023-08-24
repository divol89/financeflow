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
// import type { AppProps } from 'next/app';
// import '../styles/tailwind.css';
// import { TokenContextProvider } from '../contexts/TokenContext';
// import React from "react";
// import { ChainId,ThirdwebProvider } from "@thirdweb-dev/react";
// import { Analytics } from '@vercel/analytics/react';
// import { ThirdwebSDKProvider as SDKThirdwebProvider } from '../contexts/ThirdwebContext'; // Adjust the path

// // const activeChainId = ChainId.AvalancheFujiTestnet;

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <SDKThirdwebProvider>
//         <ThirdwebProvider>
//         <TokenContextProvider>
//           <Component {...pageProps} />
//           <Analytics />
//       </TokenContextProvider>
//       </ThirdwebProvider>

//     </SDKThirdwebProvider>
//   );
// }

// export default MyApp;




// import type { AppProps } from 'next/app';
// import '../styles/tailwind.css';
// import { TokenContextProvider } from '../contexts/TokenContext';
// import React from "react";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
// import { Analytics } from '@vercel/analytics/react';
// import { ThirdwebSDKProvider, useThirdweb } from '../contexts/ThirdwebContext'; // Adjust the path

// function MyApp({ Component, pageProps, router }: AppProps) {
//   return (
//     <ThirdwebSDKProvider>
//       <InnerApp Component={Component} pageProps={pageProps} router={router} />
//     </ThirdwebSDKProvider>
//   );
// }

// function InnerApp({ Component, pageProps }: AppProps) {
//   const { activeChainId } = useThirdweb();

//   return (
//     <ThirdwebProvider activeChain={activeChainId}>
//       <TokenContextProvider>
//         <Component {...pageProps} />
//         <Analytics />
//       </TokenContextProvider>
//     </ThirdwebProvider>
//   );
// }


// export default MyApp;


import type { AppProps } from 'next/app';
import '../styles/tailwind.css';
import { TokenContextProvider } from '../contexts/TokenContext';
import React from "react";
import {  ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from '@vercel/analytics/react';
import { ThirdwebSDKProvider, useThirdweb } from '../contexts/ThirdwebContext'; 


function MyApp({ Component, pageProps }: AppProps) {
  const { activeChainId } = useThirdweb();

  return (
    <ThirdwebSDKProvider>
      <ThirdwebProvider activeChain={activeChainId}>
        <TokenContextProvider>
          <Component {...pageProps} />
          <Analytics />
        </TokenContextProvider>
      </ThirdwebProvider>
    </ThirdwebSDKProvider>
  );
}

export default MyApp;

// import { AppProps } from 'next/app';
// import '../styles/tailwind.css';
// import { TokenContextProvider } from '../contexts/TokenContext';
// import React from "react";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
// import { Analytics } from '@vercel/analytics/react';
// import { ThirdwebSDKProvider, useThirdweb } from '../contexts/ThirdwebContext';

// // Importing necessary components and functions for LiFi SDK
// import { LiFi } from '@lifi/sdk';
// import fetch, { Headers, Request, Response } from 'cross-fetch';

// // Polyfill for Fetch API if it's not available (for server-side compatibility)
// if (!globalThis.fetch) {
//   const globalThisAny: any = globalThis;
//   globalThisAny.fetch = fetch;
//   globalThisAny.Headers = Headers;
//   globalThisAny.Request = Request;
//   globalThisAny.Response = Response;
// }

// // Initialize the LiFi SDK
// const lifi = new LiFi({
//   integrator: 'Flow/FinanceFlow'
// });

// function MyApp({ Component, pageProps }: AppProps) {
//   const { activeChainId } = useThirdweb();

//   return (
//     <ThirdwebSDKProvider>
//       <ThirdwebProvider activeChain={activeChainId}>
//         <TokenContextProvider>
//           <Component {...pageProps} />
//           <Analytics />
//         </TokenContextProvider>
//       </ThirdwebProvider>
//     </ThirdwebSDKProvider>
//   );
// }

// export default MyApp;
