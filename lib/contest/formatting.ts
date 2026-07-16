const wholeTokenFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatContestHolding(value: number): string {
  return wholeTokenFormatter.format(value);
}
