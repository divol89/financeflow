import type { NextApiRequest, NextApiResponse } from "next";
import { fetchLeviAiBurnBySignature } from "@/lib/levi/burnTracker/chain";
import { getLiveBurnTrackerSnapshot } from "@/lib/levi/burnTracker/service";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";

const SOLANA_SIGNATURE_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{64,128}$/;

function getBurnSignature(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const signature = (body as Record<string, unknown>).signature;
  return typeof signature === "string" ? signature : null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BurnTrackerPublicSnapshot | { error: string }>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    if (req.method === "POST") {
      const limited = checkRateLimit(
        `burn-tracker-force:${getClientKey(req)}`,
        3,
        5 * 60_000
      );
      if (!limited.allowed) {
        return res.status(429).json({ error: "Too many forced burn tracker refreshes" });
      }

      const signature = getBurnSignature(req.body);
      if (!signature || !SOLANA_SIGNATURE_PATTERN.test(signature)) {
        return res.status(400).json({ error: "A valid burn transaction signature is required." });
      }

      const verifiedBurn = await fetchLeviAiBurnBySignature(signature);
      if (!verifiedBurn) {
        return res.status(400).json({ error: "The signature is not a finalized K9 burn." });
      }

      const snapshot = await getLiveBurnTrackerSnapshot(new Date(), {
        force: true,
        verifiedBurn,
      });
      return res.status(200).json(snapshot);
    }

    const snapshot = await getLiveBurnTrackerSnapshot();
    return res.status(200).json(snapshot);
  } catch (error) {
    console.error("K9 burn tracker read failed", error);
    return res.status(503).json({
      error: "The live burn tracker is temporarily unavailable. Please try again shortly.",
    });
  }
}
