import {
  fetchLeviAiTokenAccountsByOwner,
  sumTokenAccountBalances,
} from "@/lib/levi/burnTracker/chain";
import {
  LEVI_AI_DECIMALS,
  LEVI_AI_MINT_ADDRESS,
  LEVI_AI_SYMBOL,
} from "@/lib/levi/burnTracker/constants";
import { solanaRpc } from "@/lib/levi/rpc";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import type { LeviBurnQuote } from "@/types/leviBurn";

interface SolBalanceResponse {
  value: number;
}

export async function getLeviBurnQuote(wallet: string): Promise<LeviBurnQuote> {
  const normalizedWallet = normalizeSolanaAddress(wallet);
  const [tokenAccounts, solBalance] = await Promise.all([
    fetchLeviAiTokenAccountsByOwner(normalizedWallet, "confirmed"),
    solanaRpc<SolBalanceResponse>("getBalance", [
      normalizedWallet,
      { commitment: "confirmed" },
    ]),
  ]);

  return {
    wallet: normalizedWallet,
    mint: LEVI_AI_MINT_ADDRESS,
    symbol: LEVI_AI_SYMBOL,
    decimals: LEVI_AI_DECIMALS,
    availableRaw: sumTokenAccountBalances(
      tokenAccounts.map((account) => account.amountRaw)
    ),
    tokenAccounts,
    solBalanceLamports: String(solBalance.value),
  };
}
