import type { LeviAccessState } from "@/types/levi";
import { AGENT_K9_DECIMALS } from "./burnTracker/constants";
import { getAccessLimits, getAccessReason, uiTokenAmount } from "./access";
import { solanaRpc } from "./rpc";
import { normalizeSolanaAddress } from "./wallet";

interface TokenAccountsResponse {
  value: Array<{
    account: {
      data: {
        parsed?: {
          info?: {
            mint?: string;
            tokenAmount?: {
              amount?: string;
              decimals?: number;
            };
          };
        };
      };
    };
  }>;
}

export interface TokenBalance {
  mint: string;
  raw: bigint;
  decimals: number;
  balance: number;
}

const ACCESS_RPC_POLICY = {
  maxAttempts: 1,
  requestTimeoutMs: 1_200,
  deadlineMs: 2_500,
} as const;

export function clearLeviAccessCacheForTests(): void {
  // Retained for compatibility with existing callers. Open access has no cache.
}

export async function getTokenBalanceForMint(
  inputWallet: string,
  inputMint: string
): Promise<TokenBalance> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const mint = normalizeSolanaAddress(inputMint);
  const result = await solanaRpc<TokenAccountsResponse>(
    "getTokenAccountsByOwner",
    [
      wallet,
      { mint },
      {
        encoding: "jsonParsed",
      },
    ],
    ACCESS_RPC_POLICY
  );

  const tokenAmount = result.value.reduce(
    (acc, item) => {
      const info = item.account.data.parsed?.info;
      if (info?.mint !== mint) return acc;

      const amount = BigInt(info.tokenAmount?.amount || "0");
      return {
        raw: acc.raw + amount,
        decimals: info.tokenAmount?.decimals ?? acc.decimals,
      };
    },
    { raw: BigInt(0), decimals: AGENT_K9_DECIMALS }
  );

  return {
    mint,
    ...tokenAmount,
    balance: uiTokenAmount(tokenAmount.raw, tokenAmount.decimals),
  };
}

export async function getLeviAccessForWallet(
  inputWallet: string
): Promise<LeviAccessState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const tier = "full" as const;
  return {
    wallet,
    mint: "",
    balance: 0,
    balanceRaw: "0",
    decimals: 0,
    tier,
    limits: getAccessLimits(tier),
    checkedAt: new Date().toISOString(),
    reason: getAccessReason(tier),
  };
}
