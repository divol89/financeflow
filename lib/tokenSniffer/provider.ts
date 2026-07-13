import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import type { TokenSnifferReport } from "@/types/tokenSniffer";
import { normalizeTokenSnifferReport } from "./model";

const RUGCHECK_BASE_URL = "https://api.rugcheck.xyz/v1/tokens";
export const TOKEN_SNIFFER_CACHE_TTL_MS = 10 * 60_000;
export const TOKEN_SNIFFER_STALE_TTL_MS = 60 * 60_000;
export const TOKEN_SNIFFER_MIN_REQUEST_INTERVAL_MS = 500;
const TOKEN_SNIFFER_TIMEOUT_MS = 8_000;

interface CacheEntry {
  report: TokenSnifferReport;
  staleUntil: number;
}

export class TokenSnifferProviderError extends Error {
  status: number;
  retryAfterSeconds: number;

  constructor(message: string, status = 503, retryAfterSeconds = 0) {
    super(message);
    this.name = "TokenSnifferProviderError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<TokenSnifferReport>>();
let outboundQueue: Promise<void> = Promise.resolve();
let nextRequestAt = 0;

export function isTokenSnifferCacheFresh(
  report: TokenSnifferReport,
  now = Date.now()
): boolean {
  return Date.parse(report.expiresAt) > now;
}

function retryAfterSeconds(response: Response): number {
  const value = Number(response.headers.get("retry-after") || 0);
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : 0;
}

async function scheduleProviderRequest<T>(task: () => Promise<T>): Promise<T> {
  const scheduled = outboundQueue.then(async () => {
    const waitMs = Math.max(0, nextRequestAt - Date.now());
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    nextRequestAt = Date.now() + TOKEN_SNIFFER_MIN_REQUEST_INTERVAL_MS;
    return task();
  });
  outboundQueue = scheduled.then(
    () => undefined,
    () => undefined
  );
  return scheduled;
}

async function requestProvider(mint: string): Promise<TokenSnifferReport> {
  return scheduleProviderRequest(async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TOKEN_SNIFFER_TIMEOUT_MS);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      const apiKey = process.env.FLUX_RUGCHECK_API_KEY?.trim();
      if (apiKey) headers["X-API-KEY"] = apiKey;

      const response = await fetch(
        `${RUGCHECK_BASE_URL}/${encodeURIComponent(mint)}/report/summary`,
        { headers, signal: controller.signal }
      );
      if (!response.ok) {
        throw new TokenSnifferProviderError(
          response.status === 429
            ? "Token intelligence is busy. Please wait before trying again."
            : "Token intelligence is temporarily unavailable.",
          response.status,
          retryAfterSeconds(response)
        );
      }
      const payload = await response.json();
      return normalizeTokenSnifferReport(
        mint,
        payload,
        new Date(),
        TOKEN_SNIFFER_CACHE_TTL_MS
      );
    } catch (error) {
      if (error instanceof TokenSnifferProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new TokenSnifferProviderError("Token intelligence timed out.");
      }
      throw new TokenSnifferProviderError(
        error instanceof Error ? error.message : "Token intelligence failed."
      );
    } finally {
      clearTimeout(timeout);
    }
  });
}

function asCached(report: TokenSnifferReport, stale: boolean): TokenSnifferReport {
  return { ...report, cached: true, stale };
}

export async function getTokenSnifferReport(
  inputMint: string
): Promise<TokenSnifferReport> {
  const mint = normalizeSolanaAddress(inputMint);
  const current = cache.get(mint);
  const now = Date.now();
  if (current && isTokenSnifferCacheFresh(current.report, now)) {
    return asCached(current.report, false);
  }

  const existingRequest = inflight.get(mint);
  if (existingRequest) return existingRequest;

  const request = requestProvider(mint)
    .then((report) => {
      cache.set(mint, {
        report,
        staleUntil: Date.parse(report.expiresAt) + TOKEN_SNIFFER_STALE_TTL_MS,
      });
      return report;
    })
    .catch((error) => {
      if (current && current.staleUntil > now) {
        return asCached(current.report, true);
      }
      throw error;
    })
    .finally(() => inflight.delete(mint));

  inflight.set(mint, request);
  return request;
}
