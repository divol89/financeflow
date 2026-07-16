import {
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_NAME,
  AGENT_K9_SYMBOL,
} from "@/lib/agentK9/brand";

export const PORTFOLIO_ROOT_COLLECTION = "agent_k9_portfolios";
export const PORTFOLIO_SNAPSHOT_MIN_INTERVAL_MS = 5 * 60 * 1000;
export const PORTFOLIO_FLAT_HEARTBEAT_MS = 24 * 60 * 60 * 1000;
export const PORTFOLIO_CHAIN_ACTIVITY_BATCH = 12;

export const PORTFOLIO_TOKEN_ASSETS = [
  {
    id: "levi-ai" as const,
    name: AGENT_K9_NAME,
    symbol: AGENT_K9_SYMBOL,
    mint: AGENT_K9_MINT_ADDRESS,
  },
] as const;
