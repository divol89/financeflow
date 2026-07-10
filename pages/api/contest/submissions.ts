import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import { getContestEligibility } from "@/lib/contest/eligibility";
import {
  countCampaignSubmissions,
  createSubmission,
  getContestCampaign,
} from "@/lib/contest/store";
import { normalizePostUrl, ContestValidationError } from "@/lib/contest/validation";
import type { ContestSubmissionResponse } from "@/types/contest";

const BodySchema = z.object({
  postUrl: z.string().min(1).max(400),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContestSubmissionResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limited = checkRateLimit(`contest:${getClientKey(req)}`, 10, 60_000);
    if (!limited.allowed) {
      return res.status(429).json({ error: "Too many submission attempts" });
    }

    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ error: "Connect and sign with your Solana wallet first." });
    }

    const eligibility = await getContestEligibility(session.wallet);
    if (!eligibility.eligible) {
      return res.status(403).json({
        error: "Hold at least 500 LEVI or 500 LEVI AI to enter this campaign.",
        eligibility,
      });
    }

    const campaign = await getContestCampaign();
    if (campaign.status !== "open" || new Date(campaign.closesAt).getTime() <= Date.now()) {
      return res.status(409).json({ error: "This campaign is no longer accepting entries." });
    }

    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "A post URL is required." });
    }

    let postUrl: string;
    try {
      postUrl = normalizePostUrl(parsed.data.postUrl);
    } catch (error) {
      if (error instanceof ContestValidationError) {
        return res.status(400).json({ error: error.message });
      }
      throw error;
    }

    const submission = await createSubmission({
      campaignId: campaign.id,
      wallet: session.wallet,
      postUrl,
    });

    let totalEntries: number | undefined;
    try {
      totalEntries = await countCampaignSubmissions(campaign.id);
    } catch (countError) {
      console.error("LEVI Social contest count refresh failed", countError);
    }

    return res.status(201).json({
      submission: {
        id: submission.id,
        postUrl: submission.postUrl,
        submittedAt: submission.submittedAt,
        status: submission.status,
      },
      totalEntries,
    });
  } catch (error) {
    console.error("LEVI Social contest submission failed", error);
    if (error instanceof Error && error.message.includes("already exists")) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(503).json({
      error: "Contest submissions are temporarily unavailable.",
    });
  }
}
