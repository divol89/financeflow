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
import type { AppProps } from 'next/app';
import  '../styles/tailwind.css';
import { TokenContextProvider } from '../contexts/TokenContext'; // Importa el proveedor de contexto
import React from "react";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
const activeChainId = ChainId.AvalancheFujiTestnet;

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <ThirdwebProvider activeChain={activeChainId}>
    <TokenContextProvider>  {/* Envuelve la aplicación con el proveedor de contexto */}
        <Component {...pageProps} />
      </TokenContextProvider>
      
    </ThirdwebProvider>
  );
}

export default MyApp;


