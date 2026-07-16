import type { NextApiRequest, NextApiResponse } from "next";
import { getLeviBurnTransactionStatus } from "@/lib/levi/burn/transaction";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import type { LeviBurnTransactionStatus } from "@/types/leviBurn";

const SOLANA_SIGNATURE_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{64,128}$/;

function getSignatureQueryValue(request: NextApiRequest): string | null {
  const value = request.query.signature;
  return typeof value === "string" ? value : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeviBurnTransactionStatus | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  const limited = checkRateLimit(`burn-transaction:${getClientKey(req)}`, 60, 60_000);
  if (!limited.allowed) {
    return res.status(429).json({ error: "Too many transaction status checks" });
  }

  const signature = getSignatureQueryValue(req);
  if (!signature || !SOLANA_SIGNATURE_PATTERN.test(signature)) {
    return res.status(400).json({ error: "A valid Solana transaction signature is required." });
  }

  try {
    return res.status(200).json(await getLeviBurnTransactionStatus(signature));
  } catch (error) {
    console.error("K9 burn transaction status failed", error);
    return res.status(503).json({
      error: "Unable to verify the submitted transaction right now. Please try again shortly.",
    });
  }
}
