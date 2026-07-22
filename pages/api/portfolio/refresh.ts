import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { isSolanaRpcRateLimitError } from "@/lib/levi/rpc";
import { requirePortfolioSession } from "@/lib/portfolio/auth";
import { refreshPortfolio } from "@/lib/portfolio/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const limited = checkRateLimit(`portfolio:${getClientKey(req)}`, 10, 60_000);
    if (!limited.allowed) return res.status(429).json({ error: "Too many portfolio refreshes" });
    const { session, access } = await requirePortfolioSession(req);
    return res.status(200).json(await refreshPortfolio(session.wallet, access));
  } catch (error) {
    if (error instanceof Error && error.message === "AUTH_REQUIRED") {
      return res.status(401).json({ error: "Connect and sign your wallet first" });
    }
    if (isSolanaRpcRateLimitError(error)) {
      return res.status(503).json({ error: "Public Solana RPC is busy. Retry in a moment." });
    }
    console.error("Portfolio refresh failed", error);
    return res.status(500).json({ error: "Unable to refresh Portfolio" });
  }
}
