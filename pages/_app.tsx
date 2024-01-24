import type { AppProps } from 'next/app';
import '../styles/tailwind.css';
import { TokenContextProvider } from '../contexts/TokenContext';
import React from "react";
import {   ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from '@vercel/analytics/react';
import { ThirdwebSDKProvider } from '../contexts/ThirdwebContext'; 
import { SessionProvider } from 'next-auth/react';



function MyApp({ Component, pageProps }: AppProps) {
  
  const activeChainId = ChainId.AvalancheFujiTestnet;


  return (
    <ThirdwebSDKProvider>
      <ThirdwebProvider activeChain={activeChainId}>
        <TokenContextProvider>
        <SessionProvider session={pageProps.session}>

          <Component {...pageProps} />
          </SessionProvider>

          <Analytics />
        </TokenContextProvider>
      </ThirdwebProvider>
    </ThirdwebSDKProvider>
  );
}

export default MyApp;
