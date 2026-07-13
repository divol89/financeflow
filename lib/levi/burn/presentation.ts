import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type { BurnTokenOption } from "@/types/leviBurn";

export function getBurnTokenName(token: BurnTokenOption): string {
  return token.symbol || token.name || `Token ${truncateSolanaAddress(token.mint, 4)}`;
}

export function formatBurnTokenBalance(token: BurnTokenOption): string {
  return formatRawTokenAmount(
    token.availableRaw,
    token.decimals,
    Math.min(token.decimals, 6)
  );
}

export function formatBurnSolBalance(lamports: string): string {
  return formatRawTokenAmount(lamports, 9, 5);
}
