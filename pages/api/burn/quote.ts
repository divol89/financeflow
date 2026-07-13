import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getBurnWalletInventory } from "@/lib/levi/burn/inventory";
import { isValidSolanaAddress } from "@/lib/levi/wallet";
import type { BurnWalletInventory } from "@/types/leviBurn";

function getWalletQueryValue(request: NextApiRequest): string | null {
  const value = request.query.wallet;
  return typeof value === "string" ? value : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BurnWalletInventory | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  const limited = checkRateLimit(`burn-inventory:${getClientKey(req)}`, 20, 60_000);
  if (!limited.allowed) {
    return res.status(429).json({ error: "Too many wallet token checks" });
  }

  const wallet = getWalletQueryValue(req);
  if (!wallet || !isValidSolanaAddress(wallet)) {
    return res.status(400).json({ error: "A valid Solana wallet address is required." });
  }

  try {
    return res.status(200).json(await getBurnWalletInventory(wallet));
  } catch (error) {
    console.error("Universal burn inventory failed", error);
    return res.status(503).json({
      error: "Unable to read your Solana token balances right now. Please try again shortly.",
    });
  }
}
