import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getSessionFromRequest } from "@/lib/levi/session";
import { getContestCampaign, listAdminSubmissions, updateContestCampaign, updateSubmission } from "@/lib/contest/store";
import type { ContestSubmissionStatus } from "@/types/contest";

const UpdateSchema = z.object({
  submissionId: z.string().min(1).optional(),
  status: z.enum(["pending", "approved", "rejected", "winner"]).optional(),
  score: z.number().min(0).max(100).nullable().optional(),
  reviewerNote: z.string().max(1000).nullable().optional(),
  campaignStatus: z.enum(["open", "closed", "revealed"]).optional(),
  prizeRevealed: z.boolean().optional(),
  prizeLabel: z.string().max(200).nullable().optional(),
  closesAt: z.string().datetime().optional(),
});

function isAdminWallet(wallet: string): boolean {
  const configured = (process.env.CONTEST_ADMIN_WALLETS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return configured.includes(wallet);
}

function requireAdmin(req: NextApiRequest): string | null {
  const session = getSessionFromRequest(req);
  if (!session || !isAdminWallet(session.wallet)) return null;
  return session.wallet;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wallet = requireAdmin(req);
  if (!wallet) return res.status(403).json({ error: "Admin wallet required." });

  try {
    const campaign = await getContestCampaign();
    if (req.method === "GET") {
      const submissions = await listAdminSubmissions(campaign.id);
      return res.status(200).json({ campaign, submissions });
    }

    if (req.method !== "PATCH") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const parsed = UpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid admin update." });

    const changes = parsed.data;
    const response: Record<string, unknown> = { ok: true, adminWallet: wallet };
    if (changes.submissionId) {
      const submission = await updateSubmission({
        id: changes.submissionId,
        status: changes.status as ContestSubmissionStatus | undefined,
        score: changes.score,
        reviewerNote: changes.reviewerNote,
      });
      response.submission = submission;
    }

    if (
      changes.campaignStatus ||
      changes.prizeRevealed !== undefined ||
      changes.prizeLabel !== undefined ||
      changes.closesAt
    ) {
      response.campaign = await updateContestCampaign({
        status: changes.campaignStatus,
        prizeRevealed: changes.prizeRevealed,
        prizeLabel: changes.prizeLabel,
        closesAt: changes.closesAt,
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("LEVI Social contest admin operation failed", error);
    return res.status(503).json({ error: "Contest administration is temporarily unavailable." });
  }
}
