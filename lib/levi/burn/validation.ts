const RAW_AMOUNT_PATTERN = /^(0|[1-9]\d*)(?:\.(\d+))?$/;

export class BurnValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BurnValidationError";
  }
}

export function parseBurnAmount(
  value: string,
  decimals: number,
  symbol = "token"
): bigint {
  const trimmed = value.trim();
  const match = RAW_AMOUNT_PATTERN.exec(trimmed);
  if (!match) {
    throw new BurnValidationError(`Enter a valid ${symbol} amount.`);
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new BurnValidationError("The selected token has invalid decimals.");
  }

  const whole = match[1];
  const fraction = match[2] || "";
  if (fraction.length > decimals) {
    throw new BurnValidationError(
      `${symbol} supports up to ${decimals} decimal places.`
    );
  }

  const scale = BigInt(`1${"0".repeat(decimals)}`);
  const rawAmount =
    BigInt(whole) * scale +
    BigInt((fraction + "0".repeat(decimals)).slice(0, decimals) || "0");
  if (rawAmount <= BigInt(0)) {
    throw new BurnValidationError("The burn amount must be greater than zero.");
  }

  return rawAmount;
}

export function formatBurnAmount(rawAmount: string, decimals: number): string {
  const amount = BigInt(rawAmount);
  const divisor = BigInt(`1${"0".repeat(decimals)}`);
  const whole = amount / divisor;
  const fraction = (amount % divisor)
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole.toString();
}
