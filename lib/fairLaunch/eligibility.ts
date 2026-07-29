import type { TokenBalance } from "@/lib/levi/tokenGate";
import { getTokenBalanceForMint } from "@/lib/levi/tokenGate";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import {
  BULLISH_MULE_MINT,
  FAIR_LAUNCH_ELIGIBILITY_CACHE_MS,
} from "./constants";

interface CachedEligibility {
  expiresAt: number;
  balance: TokenBalance;
}

const cache = new Map<string, CachedEligibility>();
const pending = new Map<string, Promise<TokenBalance>>();

export function hasBullishMuleAccess(balanceRaw: string | bigint): boolean {
  try {
    return BigInt(balanceRaw) > BigInt(0);
  } catch {
    return false;
  }
}

export function clearFairLaunchEligibilityCacheForTests(): void {
  cache.clear();
  pending.clear();
}

export async function getBullishMuleBalance(
  walletInput: string
): Promise<TokenBalance> {
  const wallet = normalizeSolanaAddress(walletInput);
  const cached = cache.get(wallet);
  if (cached && cached.expiresAt > Date.now()) return cached.balance;

  const inflight = pending.get(wallet);
  if (inflight) return inflight;

  const request = getTokenBalanceForMint(wallet, BULLISH_MULE_MINT)
    .then((balance) => {
      cache.set(wallet, {
        balance,
        expiresAt: Date.now() + FAIR_LAUNCH_ELIGIBILITY_CACHE_MS,
      });
      return balance;
    })
    .finally(() => {
      pending.delete(wallet);
    });

  pending.set(wallet, request);
  return request;
}
