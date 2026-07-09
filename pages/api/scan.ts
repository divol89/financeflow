import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { scanSolanaCreatorWallet, redactScanReportForTier } from "@/lib/levi/scanner/scanWallet";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";
import { isSolanaRpcRateLimitError } from "@/lib/levi/rpc";

const BodySchema = z.object({
  wallet: z.string().min(32).max(64),
  tokenMint: z.string().min(32).max(64).optional().or(z.literal("")),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

  try {
    const access = await getLeviAccessForWallet(session.wallet);
    if (access.tier === "blocked") {
      return res.status(403).json({
        error: "LEVI token gate locked",
        access,
      });
    }

    const report = await scanSolanaCreatorWallet(parsed.data.wallet, {
      tier: access.tier,
      targetMint: parsed.data.tokenMint || undefined,
    });

    return res.status(200).json({
      access,
      report: redactScanReportForTier(report, access.tier),
    });
  } catch (error) {
    if (isSolanaRpcRateLimitError(error)) {
      return res.status(503).json({
        error:
          "Public Solana RPC rate limit reached. Wait a moment and scan again.",
      });
    }

    const message = error instanceof Error ? error.message : "Scanner failed";
    const status = message.startsWith("Solana RPC") ? 502 : 500;
    return res.status(status).json({ error: message });
  }
}
