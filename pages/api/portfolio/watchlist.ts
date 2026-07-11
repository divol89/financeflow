import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { requirePortfolioSession } from "@/lib/portfolio/auth";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { listWatchlist, removeWatchItem, saveWatchItem } from "@/lib/portfolio/store";
import { getOwnedScanReport } from "@/lib/levi/scanner/store";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";

const SaveSchema = z.object({
  targetWallet: z.string().min(32).max(64),
  tokenMint: z.string().min(32).max(64),
  scanId: z.string().uuid().nullable().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const limited = checkRateLimit(`portfolio-watchlist:${getClientKey(req)}`, 60, 60_000);
    if (!limited.allowed) return res.status(429).json({ error: "Too many watchlist requests" });
    const { session, access } = await requirePortfolioSession(req);
    if (req.method === "GET") {
      return res.status(200).json({ watchlist: await listWatchlist(session.wallet) });
    }
    if (req.method === "POST") {
      const parsed = SaveSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid watchlist item" });
      const targetWallet = normalizeSolanaAddress(parsed.data.targetWallet);
      const tokenMint = normalizeSolanaAddress(parsed.data.tokenMint);
      const ownedReport = parsed.data.scanId
        ? await getOwnedScanReport(session.wallet, parsed.data.scanId)
        : null;
      if (
        parsed.data.scanId &&
        (!ownedReport ||
          ownedReport.wallet !== targetWallet ||
          ownedReport.targetMint !== tokenMint)
      ) {
        return res.status(403).json({ error: "The saved scan does not match this investigation" });
      }
      const item = await saveWatchItem({
        ownerWallet: session.wallet,
        targetWallet,
        tokenMint,
        scanId: parsed.data.scanId,
        snapshot: ownedReport?.snapshot || null,
        pressure: ownedReport?.distributionPressure || null,
        limit: access.limits.watchlistLimit,
      });
      return res.status(201).json({ item });
    }
    if (req.method === "DELETE") {
      const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
      if (!id || !/^[a-f0-9]{64}$/.test(id)) {
        return res.status(400).json({ error: "Invalid watchlist id" });
      }
      await removeWatchItem(session.wallet, id);
      return res.status(204).end();
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") {
      return res.status(401).json({ error: "Connect and sign your wallet first" });
    }
    const message = error instanceof Error ? error.message : "Watchlist failed";
    const status = /limit|requires/i.test(message) ? 403 : 500;
    return res.status(status).json({ error: message });
  }
}
