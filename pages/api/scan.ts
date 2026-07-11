import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { scanSolanaCreatorWallet, redactScanReportForTier } from "@/lib/levi/scanner/scanWallet";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";
import { isSolanaRpcRateLimitError } from "@/lib/levi/rpc";
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
  cursor: z.string().min(32).max(128).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limited = checkRateLimit(`scan:${getClientKey(req)}`, 20, 60_000);
    if (!limited.allowed) {
      return res.status(429).json({ error: "Too many scan requests" });
    }

    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Connect and sign with a Solana wallet first" });
    }

    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wallet payload" });
    }

    const access = await getLeviAccessForWallet(session.wallet);
    if (access.tier === "blocked") {
      return res.status(403).json({
        error: "LEVI holder access required",
        access,
      });
    }

    const mode =
      parsed.data.mode || (parsed.data.tokenMint ? "token" : "creator");
    if (mode === "token" && !parsed.data.tokenMint) {
      return res.status(400).json({ error: "Token mode requires a token mint" });
    }
    if (parsed.data.cursor && !access.limits.canExtendScanHistory) {
      return res.status(403).json({ error: "Older scan windows require Full access" });
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
      console.warn("LEVI scanner cache read failed", cacheError);
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
        console.warn("LEVI scanner cache write failed", cacheError);
      }
    }

    let visibleReport = redactScanReportForTier(report, access.tier);
    try {
      visibleReport = await saveOwnedScanReport(session.wallet, visibleReport);
    } catch (storeError) {
      console.warn("LEVI scanner report persistence failed", storeError);
    }

    return res.status(200).json({
      access,
      report: visibleReport,
    });
  } catch (error) {
    if (isSolanaRpcRateLimitError(error)) {
      return res.status(503).json({
        error:
          "Public Solana RPC rate limit reached. Wait a moment and scan again.",
      });
    }

    console.error("LEVI scanner failed", error);
    const message = error instanceof Error ? error.message : "Scanner failed";
    const status = message.startsWith("Solana RPC") ? 502 : 500;
    return res.status(status).json({ error: message });
  }
}
