import type {
  DistributionPressureLevel,
  TokenActivityClassification,
} from "@/types/levi";

export const SCANNER_METHODOLOGY_VERSION = "2.0.0";
export const SCANNER_METHODOLOGY_UPDATED_AT = "2026-07-11";

export const QUOTE_ASSETS = {
  So11111111111111111111111111111111111111112: {
    symbol: "wSOL",
    decimals: 9,
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    symbol: "USDC",
    decimals: 6,
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    symbol: "USDT",
    decimals: 6,
  },
} as const;

export const KNOWN_SWAP_PROGRAMS: Record<string, string> = {
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": "Pump bonding curve",
  pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA: "PumpSwap",
  JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4: "Jupiter",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM v4",
  CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C: "Raydium CPMM",
  CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK: "Raydium CLMM",
};

export const CLASSIFICATION_LABELS: Record<
  TokenActivityClassification,
  { label: string; description: string }
> = {
  sell: {
    label: "Observed sell",
    description: "Target tokens left while a quote asset entered through a known swap venue.",
  },
  buy: {
    label: "Observed buy",
    description: "Target tokens entered while a quote asset left through a known swap venue.",
  },
  transfer_in: {
    label: "Transfer in",
    description: "Tokens entered without enough swap evidence to call the movement a buy.",
  },
  transfer_out: {
    label: "Transfer out",
    description: "Tokens left without enough swap evidence to call the movement a sell.",
  },
  liquidity: {
    label: "Liquidity operation",
    description: "Target and quote assets moved in the same direction through a swap venue.",
  },
  burn: {
    label: "Burn",
    description: "A parsed token burn instruction reduced the wallet balance.",
  },
  mint: {
    label: "Mint",
    description: "A parsed mint instruction increased the wallet balance.",
  },
  unknown: {
    label: "Unclassified",
    description: "The balance changed, but the available evidence is not specific enough.",
  },
};

export const PRESSURE_FACTOR_MAXIMUMS = {
  authorities: 25,
  concentration: 20,
  observedSelling: 35,
  repeatedPattern: 15,
  unknownOutflow: 5,
} as const;

export function getPressureLevel(score: number): Exclude<
  DistributionPressureLevel,
  "insufficient"
> {
  if (score >= 70) return "high";
  if (score >= 45) return "elevated";
  if (score >= 25) return "watch";
  return "lower";
}
