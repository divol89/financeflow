// context/Web3Modal.tsx

"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// Your WalletConnect Cloud project ID
export const projectId = "a70d258465c691d9e132614c92d48a62";

// 2. Set chains
const mainnet = {
  chainId: 8822,
  name: "IOTA EVM",
  currency: "IOTA",
  explorerUrl: "https://explorer.evm.iota.org",
  rpcUrl: "https://iota-mainnet-evm.public.blastapi.io",
};

// 3. Create a metadata object
const metadata = {
  name: "FlowFinance",
  description: "AppKit Example",
  url: "http://flow-finance.xyz/", // origin must match your domain & subdomain
  icons: [""],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  auth: {
    showWallets: true,
    walletFeatures: true,
    socials: [],
    email: false,
  },
  /*Optional*/
  enableEIP6963: false, // true by default
  enableInjected: false, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: mainnet.rpcUrl, // Use the mainnet rpcUrl
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId: projectId as string,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default

  themeVariables: {
    "--w3m-font-family": "Roboto, sans-serif",
    "--w3m-color-mix": "#F5841F",
  },
  featuredWalletIds: [],
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
