import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { scanSolanaCreatorWallet, redactScanReportForTier } from "@/lib/levi/scanner/scanWallet";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";
import { isSolanaRpcRateLimitError, SolanaRpcError } from "@/lib/levi/rpc";
import { InvalidScannerCursorError } from "@/lib/levi/scanner/cursor";
import { isValidSolanaAddress } from "@/lib/levi/wallet";
import {
  cacheScanReport,
  getCachedScanReport,
  saveOwnedScanReport,
  scannerCacheKey,
} from "@/lib/levi/scanner/store";

const BodySchema = z.object({
  mode: z.enum(["token", "creator"]).optional(),
  wallet: z.string().min(32).max(64),
  tokenMint: z.string().min(32).max(64).optional().or(z.literal("")),
  cursor: z.string().min(32).max(4096).optional(),
  scanId: z.string().uuid().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "private, no-store");

  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({
        code: "SESSION_REQUIRED",
        error: "Your signed session expired. Sign in again to continue.",
      });
    }

    const limited = checkRateLimit(
      `scan:${getClientKey(req)}:${session.wallet}`,
      48,
      60_000
    );
    if (!limited.allowed) {
      const retryAfterMs = Math.max(1_000, limited.resetAt - Date.now());
      res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1_000)));
      return res.status(202).json({
        code: "SCAN_COOLDOWN",
        error: "Too many scanner pages were requested. Wait a moment and continue.",
        retryAfterMs,
      });
    }

    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wallet payload" });
    }
    if (
      !isValidSolanaAddress(parsed.data.wallet) ||
      (parsed.data.tokenMint && !isValidSolanaAddress(parsed.data.tokenMint))
    ) {
      return res.status(400).json({ error: "Enter a valid Solana wallet and token mint" });
    }

    const access = await getLeviAccessForWallet(session.wallet);

    const mode =
      parsed.data.mode || (parsed.data.tokenMint ? "token" : "creator");
    if (mode === "token" && !parsed.data.tokenMint) {
      return res.status(400).json({ error: "Token mode requires a token mint" });
    }
    const cacheKey = scannerCacheKey({
      wallet: parsed.data.wallet,
      mint: parsed.data.tokenMint || undefined,
      mode,
      tier: access.tier,
      cursor: parsed.data.cursor,
    });
    let report = null;
    try {
      report = await getCachedScanReport(cacheKey);
    } catch (cacheError) {
      console.warn("Scanner cache read failed", cacheError);
    }

    if (!report) {
      report = await scanSolanaCreatorWallet(parsed.data.wallet, {
        tier: access.tier,
        mode,
        targetMint: parsed.data.tokenMint || undefined,
        cursor: parsed.data.cursor,
      });
      try {
        await cacheScanReport(cacheKey, report);
      } catch (cacheError) {
        console.warn("Scanner cache write failed", cacheError);
      }
    }

    const visiblePage = redactScanReportForTier(report, access.tier);
    let visibleReport = visiblePage;
    try {
      visibleReport = await saveOwnedScanReport(
        session.wallet,
        visiblePage,
        parsed.data.scanId
      );
      visibleReport = redactScanReportForTier(visibleReport, access.tier);
    } catch (storeError) {
      console.warn("Scanner report persistence failed", storeError);
    }

    return res.status(200).json({
      access,
      report: visibleReport,
    });
  } catch (error) {
    if (error instanceof InvalidScannerCursorError) {
      return res.status(400).json({ error: error.message });
    }
    if (isSolanaRpcRateLimitError(error)) {
      const retryAfterMs =
        error instanceof SolanaRpcError && error.retryAfterMs
          ? Math.max(2_000, error.retryAfterMs)
          : 5_000;
      res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1_000)));
      return res.status(202).json({
        code: "RPC_COOLDOWN",
        error:
          "Public Solana RPC rate limit reached. Wait a moment and scan again.",
        retryAfterMs,
      });
    }

    const message = error instanceof Error ? error.message : "Scanner failed";
    if (error instanceof SolanaRpcError || message.startsWith("Solana RPC")) {
      const retryAfterMs =
        error instanceof SolanaRpcError && error.retryAfterMs
          ? Math.max(2_000, error.retryAfterMs)
          : 3_000;
      res.setHeader("Retry-After", String(Math.ceil(retryAfterMs / 1_000)));
      return res.status(202).json({
        code: "RPC_COOLDOWN",
        error: message,
        retryAfterMs,
      });
    }

    console.error("Scanner failed", error);
    return res.status(500).json({ error: message });
  }
}
