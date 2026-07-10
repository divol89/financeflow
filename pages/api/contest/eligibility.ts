import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { getContestEligibility } from "@/lib/contest/eligibility";
import type { ContestEligibilityResponse } from "@/types/contest";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContestEligibilityResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limited = checkRateLimit(`contest-eligibility:${getClientKey(req)}`, 20, 60_000);
    if (!limited.allowed) {
      return res.status(429).json({ error: "Too many eligibility checks" });
    }

    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Connect and sign with your Solana wallet first." });
    }

    const eligibility = await getContestEligibility(session.wallet);
    return res.status(200).json(eligibility);
  } catch (error) {
    console.error("LEVI Social holder eligibility check failed", error);
    return res.status(503).json({ error: "Unable to read contest holder balances." });
  }
}
