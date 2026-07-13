import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { isValidSolanaAddress } from "@/lib/levi/wallet";
import {
  getTokenSnifferReport,
  TokenSnifferProviderError,
} from "@/lib/tokenSniffer/provider";
import type { TokenSnifferApiResponse } from "@/types/tokenSniffer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenSnifferApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const mint = Array.isArray(req.query.mint) ? req.query.mint[0] : req.query.mint;
  if (!mint || !isValidSolanaAddress(mint)) {
    return res.status(400).json({ error: "Enter a valid Solana token mint address." });
  }

  const limited = checkRateLimit(
    `token-sniffer:${getClientKey(req)}`,
    12,
    60_000
  );
  res.setHeader("X-RateLimit-Remaining", String(limited.remaining));
  if (!limited.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limited.resetAt - Date.now()) / 1_000));
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      error: "Too many token checks. Wait a moment before trying again.",
      retryAfterSeconds: retryAfter,
    });
  }

  try {
    const report = await getTokenSnifferReport(mint);
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600"
    );
    return res.status(200).json({ report });
  } catch (error) {
    if (error instanceof TokenSnifferProviderError) {
      if (error.retryAfterSeconds > 0) {
        res.setHeader("Retry-After", String(error.retryAfterSeconds));
      }
      return res.status(error.status === 429 ? 429 : 503).json({
        error: error.message,
        retryAfterSeconds: error.retryAfterSeconds || undefined,
      });
    }
    console.error("Token Sniffer failed", error);
    return res.status(503).json({
      error: "Token intelligence is temporarily unavailable.",
    });
  }
}
