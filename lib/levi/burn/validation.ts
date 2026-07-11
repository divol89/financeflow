const RAW_AMOUNT_PATTERN = /^(0|[1-9]\d*)(?:\.(\d+))?$/;

export class LeviBurnValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeviBurnValidationError";
  }
}

export function parseLeviBurnAmount(value: string, decimals: number): bigint {
  const trimmed = value.trim();
  const match = RAW_AMOUNT_PATTERN.exec(trimmed);
  if (!match) {
    throw new LeviBurnValidationError("Enter a valid LEVI AI amount.");
  }

  const whole = match[1];
  const fraction = match[2] || "";
  if (fraction.length > decimals) {
    throw new LeviBurnValidationError(
      `LEVI AI supports up to ${decimals} decimal places.`
    );
  }

  const rawAmount =
    BigInt(whole) * BigInt(10 ** decimals) +
    BigInt((fraction + "0".repeat(decimals)).slice(0, decimals) || "0");
  if (rawAmount <= BigInt(0)) {
    throw new LeviBurnValidationError("The burn amount must be greater than zero.");
  }

  return rawAmount;
}

export function formatLeviBurnAmount(rawAmount: string, decimals: number): string {
  const amount = BigInt(rawAmount);
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = (amount % divisor)
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole.toString();
}
