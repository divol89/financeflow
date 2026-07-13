import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import { truncateSolanaAddress } from "@/lib/levi/wallet";
import type { BurnTokenOption } from "@/types/leviBurn";

function fallbackTokenName(token: BurnTokenOption): string {
  return `Token ${truncateSolanaAddress(token.mint, 4)}`;
}

export function getBurnTokenDisplayName(token: BurnTokenOption): string {
  const name = token.name?.trim() || null;
  const symbol = token.symbol?.trim() || null;
  if (name && symbol && name.localeCompare(symbol, undefined, { sensitivity: "base" }) !== 0) {
    return `${name} (${symbol})`;
  }
  return name || symbol || fallbackTokenName(token);
}

export function getBurnTokenUnit(token: BurnTokenOption): string {
  return token.symbol?.trim() || token.name?.trim() || fallbackTokenName(token);
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
