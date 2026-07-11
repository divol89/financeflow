const TRANSIENT_SCAN_STATUSES = new Set([429, 500, 502, 503, 504]);
const SCANNER_RETRY_DELAYS_MS = [1_500, 3_000, 5_000];

export const SCANNER_PAGE_COOLDOWN_MS = 900;

export function scannerRetryDelay(input: {
  status: number;
  attempt: number;
  retryAfterMs?: number;
}): number | null {
  if (
    !TRANSIENT_SCAN_STATUSES.has(input.status) ||
    input.attempt < 0 ||
    input.attempt >= SCANNER_RETRY_DELAYS_MS.length
  ) {
    return null;
  }
  return Math.max(
    input.retryAfterMs || 0,
    SCANNER_RETRY_DELAYS_MS[input.attempt] || SCANNER_RETRY_DELAYS_MS[0]
  );
}
