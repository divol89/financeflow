import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import {
  BurnPreparationError,
  prepareBurnTransaction,
} from "@/lib/levi/burn/prepare";
import { isValidSolanaAddress } from "@/lib/levi/wallet";
import type { BurnPreparation } from "@/types/leviBurn";

interface BurnPreparationBody {
  wallet?: unknown;
  mint?: unknown;
  amountRaw?: unknown;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BurnPreparation | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  const limited = checkRateLimit(`burn-prepare:${getClientKey(req)}`, 12, 60_000);
  if (!limited.allowed) {
    return res.status(429).json({ error: "Too many burn preparation requests" });
  }

  const body = (req.body || {}) as BurnPreparationBody;
  const wallet = typeof body.wallet === "string" ? body.wallet : "";
  const mint = typeof body.mint === "string" ? body.mint : "";
  const amountRaw = typeof body.amountRaw === "string" ? body.amountRaw : "";
  if (!isValidSolanaAddress(wallet) || !isValidSolanaAddress(mint)) {
    return res.status(400).json({ error: "Valid wallet and token mint addresses are required." });
  }

  try {
    return res.status(200).json(
      await prepareBurnTransaction({
        wallet,
        mint,
        amountRaw,
      })
    );
  } catch (error) {
    if (error instanceof BurnPreparationError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Universal burn preparation failed", error);
    return res.status(503).json({
      error: "Unable to prepare the burn transaction right now. Please try again shortly.",
    });
  }
}
