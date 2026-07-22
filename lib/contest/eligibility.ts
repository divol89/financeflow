import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import type { ContestEligibilityResponse } from "@/types/contest";

export async function getContestEligibility(
  inputWallet: string
): Promise<ContestEligibilityResponse> {
  const wallet = normalizeSolanaAddress(inputWallet);
  return {
    wallet,
    eligible: true,
    tier: null,
    qualifyingToken: null,
    holdings: [],
    checkedAt: new Date().toISOString(),
  };
}
