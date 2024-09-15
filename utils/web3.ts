export const IOTA_CHAIN_ID = 8822;
export const ROUTER_ADDRESS = "0x531777F8c35fDe8DA9baB6cC7093A7D14a99D73E"; // Address of the DEX router

export const IOTA_EVM_RPC = "https://evm.wasp.sc.iota.org";

export const networkParams = {
  chainId: `0x${IOTA_CHAIN_ID.toString(16)}`,
  chainName: "IOTA EVM",
  nativeCurrency: {
    name: "IOTA",
    symbol: "IOTA",
    decimals: 18,
  },
  rpcUrls: [IOTA_EVM_RPC],
  blockExplorerUrls: ["https://explorer.iota.org/mainnet"],
};
