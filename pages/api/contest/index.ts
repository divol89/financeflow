import type { NextApiRequest, NextApiResponse } from "next";
import type { ContestPublicResponse } from "@/types/contest";
import {
  countCampaignSubmissions,
  getContestCampaign,
  listPublicSubmissions,
} from "@/lib/contest/store";
import { getDefaultContestCampaign } from "@/lib/contest/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContestPublicResponse | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const campaign = await getContestCampaign();
    const [entries, totalEntries] = await Promise.all([
      listPublicSubmissions(campaign.id),
      countCampaignSubmissions(campaign.id),
    ]);
    return res.status(200).json({
      campaign,
      entries,
      totalEntries,
      storageAvailable: true,
    });
  } catch (error) {
    console.error("LEVI Social contest read failed", error);
    return res.status(503).json({
      campaign: getDefaultContestCampaign(),
      entries: [],
      totalEntries: 0,
      storageAvailable: false,
      error: "Contest submissions are temporarily unavailable.",
    });
  }
}
