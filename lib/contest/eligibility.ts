import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { getTokenBalanceForMint } from "@/lib/levi/tokenGate";
import { CONTEST_HOLDER_TIERS, CONTEST_HOLDER_TOKENS } from "./constants";
import type {
  ContestEligibilityResponse,
  ContestHolderTier,
  ContestHolderBalance,
} from "@/types/contest";

export function getHighestContestTier(
  holdings: ContestHolderBalance[]
): ContestHolderTier | null {
  const highestBalance = Math.max(
    0,
    ...holdings
      .filter((holding) => holding.available && holding.balance !== null)
      .map((holding) => holding.balance || 0)
  );

  return (
    CONTEST_HOLDER_TIERS.filter(
      (tier) => highestBalance >= tier.minimumHolding
    ).at(-1) || null
  );
}

export async function getContestEligibility(
  inputWallet: string
): Promise<ContestEligibilityResponse> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const holdings: ContestHolderBalance[] = [];
  let availableTokenCount = 0;

  for (const token of CONTEST_HOLDER_TOKENS) {
    try {
      const balance = await getTokenBalanceForMint(wallet, token.mint);
      availableTokenCount += 1;
      holdings.push({
        symbol: token.symbol,
        mint: token.mint,
        balance: balance.balance,
        available: true,
      });
    } catch {
      holdings.push({
        symbol: token.symbol,
        mint: token.mint,
        balance: null,
        available: false,
      });
    }
  }

  if (availableTokenCount === 0) {
    throw new Error("Unable to read contest holder balances");
  }

  const tier = getHighestContestTier(holdings);
  const winningHolding = holdings
    .filter((holding) => holding.balance !== null)
    .sort((a, b) => (b.balance || 0) - (a.balance || 0))[0];
  return {
    wallet,
    eligible: Boolean(tier),
    tier,
    qualifyingToken: tier ? winningHolding?.symbol || null : null,
    holdings,
    checkedAt: new Date().toISOString(),
  };
}
