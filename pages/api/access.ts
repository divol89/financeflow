import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const limited = checkRateLimit(`access:${getClientKey(req)}`, 60, 60_000);
  if (!limited.allowed) {
    return res.status(429).json({ error: "Too many access checks" });
  }

  const session = getSessionFromRequest(req);
  const queryWallet = Array.isArray(req.query.wallet)
    ? req.query.wallet[0]
    : req.query.wallet;
  const wallet = queryWallet || session?.wallet;

  if (!wallet) {
    return res.status(401).json({ error: "Wallet is required" });
  }

  try {
    const access = await getLeviAccessForWallet(wallet);
    return res.status(200).json({ access });
  } catch {
    return res.status(400).json({ error: "Invalid Solana wallet address" });
  }
}
