import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { clearCookie } from "@/lib/levi/http";
import { NONCE_COOKIE } from "@/lib/levi/constants";
import {
  getNonceFromRequest,
  setSessionCookie,
  verifySolanaSignature,
} from "@/lib/levi/session";

const BodySchema = z.object({
  wallet: z.string().min(32).max(64),
  message: z.string().min(1),
  signature: z.string().min(32),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid verification payload" });
    }

    const nonce = getNonceFromRequest(req);
    if (!nonce) {
      return res.status(401).json({ error: "Nonce expired or missing" });
    }

    if (
      nonce.wallet !== parsed.data.wallet ||
      nonce.message !== parsed.data.message
    ) {
      return res.status(401).json({ error: "Nonce payload mismatch" });
    }

    const valid = verifySolanaSignature(
      parsed.data.wallet,
      parsed.data.message,
      parsed.data.signature
    );

    if (!valid) {
      return res.status(401).json({ error: "Invalid wallet signature" });
    }

    setSessionCookie(res, parsed.data.wallet);
    clearCookie(res, NONCE_COOKIE);
    return res.status(200).json({ authenticated: true, wallet: nonce.wallet });
  } catch (error) {
    console.error("K9 signature verification failed", error);
    return res.status(401).json({ error: "Unable to verify wallet signature" });
  }
}
