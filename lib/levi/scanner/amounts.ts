import type { RawAmountValue } from "@/types/levi";

export function absBigInt(value: bigint): bigint {
  return value < BigInt(0) ? -value : value;
}

export function formatRawAmount(raw: bigint, decimals: number): string {
  const negative = raw < BigInt(0);
  const absolute = absBigInt(raw);
  if (decimals <= 0) return `${negative ? "-" : ""}${absolute.toString()}`;

  const padded = absolute.toString().padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = padded.slice(-decimals).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

export function rawAmountValue(
  raw: bigint,
  decimals: number
): RawAmountValue {
  return {
    raw: raw.toString(),
    decimals,
    formatted: formatRawAmount(raw, decimals),
  };
}

export function percentageOf(numerator: bigint, denominator: bigint): number | null {
  if (denominator <= BigInt(0) || numerator < BigInt(0)) return null;
  const partsPerMillion = (numerator * BigInt(100_000_000)) / denominator;
  return Number(partsPerMillion) / 1_000_000;
}

export function compareRawAmountValues(
  left: RawAmountValue,
  right: RawAmountValue
): boolean {
  return left.raw === right.raw && left.decimals === right.decimals;
}
