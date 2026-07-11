import { LEVI_MINT_ADDRESS } from "@/lib/levi/constants";
import { LEVI_AI_MINT_ADDRESS } from "@/lib/levi/communityBurn";

export const PORTFOLIO_ROOT_COLLECTION = "levi_portfolios";
export const PORTFOLIO_SNAPSHOT_MIN_INTERVAL_MS = 5 * 60 * 1000;
export const PORTFOLIO_FLAT_HEARTBEAT_MS = 24 * 60 * 60 * 1000;
export const PORTFOLIO_CHAIN_ACTIVITY_BATCH = 12;

export const PORTFOLIO_TOKEN_ASSETS = [
  {
    id: "levi" as const,
    name: "The White Bull",
    symbol: "LEVI",
    mint: LEVI_MINT_ADDRESS,
  },
  {
    id: "levi-ai" as const,
    name: "The White Bull Agent",
    symbol: "LEVI AI",
    mint: LEVI_AI_MINT_ADDRESS,
  },
] as const;
