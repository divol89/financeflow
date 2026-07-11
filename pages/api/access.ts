import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limited = checkRateLimit(`access:${getClientKey(req)}`, 60, 60_000);
    if (!limited.allowed) {
      return res.status(429).json({ error: "Too many access checks" });
    }

    const queryWallet = Array.isArray(req.query.wallet)
      ? req.query.wallet[0]
      : req.query.wallet;
    const session = queryWallet ? null : getSessionFromRequest(req);
    const wallet = queryWallet || session?.wallet;

    if (!wallet) {
      return res.status(401).json({ error: "Wallet is required" });
    }

    const access = await getLeviAccessForWallet(wallet);
    return res.status(200).json({ access });
  } catch (error) {
    console.error("LEVI access check failed", error);
    const message =
      error instanceof Error && error.message.toLowerCase().includes("invalid")
        ? "Invalid Solana wallet address"
        : "Unable to read LEVI AI access";
    return res.status(400).json({ error: message });
  }
}
