import {
  BULLISH_MULE_MINT_ADDRESS,
  BULLISH_MULE_NAME,
  BULLISH_MULE_SYMBOL,
} from "@/lib/bullishMule/brand";

export const PORTFOLIO_ROOT_COLLECTION = "bullish_mule_portfolios";
export const PORTFOLIO_SNAPSHOT_MIN_INTERVAL_MS = 5 * 60 * 1000;
export const PORTFOLIO_FLAT_HEARTBEAT_MS = 24 * 60 * 60 * 1000;
export const PORTFOLIO_CHAIN_ACTIVITY_BATCH = 12;

export const PORTFOLIO_TOKEN_ASSETS = [
  {
    id: "mule" as const,
    name: BULLISH_MULE_NAME,
    symbol: BULLISH_MULE_SYMBOL,
    mint: BULLISH_MULE_MINT_ADDRESS,
  },
] as const;
