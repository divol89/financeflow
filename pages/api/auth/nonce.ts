import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createNonce, setNonceCookie } from "@/lib/levi/session";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { isValidSolanaAddress } from "@/lib/levi/wallet";

const BodySchema = z.object({
  wallet: z.string().min(32).max(64),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limited = checkRateLimit(`nonce:${getClientKey(req)}`, 20, 60_000);
    if (!limited.allowed) {
      return res.status(429).json({ error: "Too many nonce requests" });
    }

    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid wallet payload" });
    }
    if (!isValidSolanaAddress(parsed.data.wallet)) {
      return res.status(400).json({ error: "Invalid Solana wallet address" });
    }

    const nonce = createNonce(parsed.data.wallet);
    setNonceCookie(res, nonce);
    return res.status(200).json({
      wallet: nonce.wallet,
      nonce: nonce.nonce,
      message: nonce.message,
      expiresAt: nonce.expiresAt,
    });
  } catch (error) {
    console.error("LEVI nonce creation failed", error);
    return res
      .status(503)
      .json({ error: "Authentication is temporarily unavailable" });
  }
}
