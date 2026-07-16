import type { NextApiRequest, NextApiResponse } from "next";
import { getLeviBurnSigningContext } from "@/lib/levi/burn/transaction";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import type { LeviBurnSigningContext } from "@/types/leviBurn";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeviBurnSigningContext | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");
  const limited = checkRateLimit(`burn-context:${getClientKey(req)}`, 20, 60_000);
  if (!limited.allowed) {
    return res.status(429).json({ error: "Too many burn preparation requests" });
  }

  try {
    return res.status(200).json(await getLeviBurnSigningContext());
  } catch (error) {
    console.error("K9 burn context failed", error);
    return res.status(503).json({
      error: "Unable to prepare the burn transaction right now. Please try again shortly.",
    });
  }
}
