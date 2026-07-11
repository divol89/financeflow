import type { LeviAccessState } from "@/types/levi";
import { LEVI_AI_MINT_ADDRESS } from "./communityBurn";
import { LEVI_AI_DECIMALS } from "./burnTracker/constants";
import { getAccessLimits, getAccessReason, getAccessTier, uiTokenAmount } from "./access";
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

const ACCESS_CACHE_TTL_MS = 60_000;
const accessCache = new Map<
  string,
  { value: LeviAccessState; expiresAt: number }
>();
const accessRequests = new Map<string, Promise<LeviAccessState>>();
const ACCESS_RPC_POLICY = {
  maxAttempts: 1,
  requestTimeoutMs: 1_200,
  deadlineMs: 2_500,
} as const;

export function clearLeviAccessCacheForTests(): void {
  accessCache.clear();
  accessRequests.clear();
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
    { raw: BigInt(0), decimals: LEVI_AI_DECIMALS }
  );

  return {
    mint,
    ...tokenAmount,
    balance: uiTokenAmount(tokenAmount.raw, tokenAmount.decimals),
  };
}

async function loadLeviAccessForWallet(
  inputWallet: string
): Promise<LeviAccessState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const tokenBalance = await getTokenBalanceForMint(wallet, LEVI_AI_MINT_ADDRESS);
  const { raw: balanceRaw, decimals, balance } = tokenBalance;
  const tier = getAccessTier(balance);

  return {
    wallet,
    mint: LEVI_AI_MINT_ADDRESS,
    balance,
    balanceRaw: balanceRaw.toString(),
    decimals,
    tier,
    limits: getAccessLimits(tier),
    checkedAt: new Date().toISOString(),
    reason: getAccessReason(tier),
  };
}

export async function getLeviAccessForWallet(
  inputWallet: string
): Promise<LeviAccessState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const cached = accessCache.get(wallet);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const pending = accessRequests.get(wallet);
  if (pending) return pending;

  const request = loadLeviAccessForWallet(wallet)
    .then((value) => {
      accessCache.set(wallet, {
        value,
        expiresAt: Date.now() + ACCESS_CACHE_TTL_MS,
      });
      return value;
    })
    .finally(() => {
      accessRequests.delete(wallet);
    });
  accessRequests.set(wallet, request);
  return request;
}
