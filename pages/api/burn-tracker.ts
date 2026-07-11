import type { NextApiRequest, NextApiResponse } from "next";
import { getLiveBurnTrackerSnapshot } from "@/lib/levi/burnTracker/service";
import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BurnTrackerPublicSnapshot | { error: string }>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    const snapshot = await getLiveBurnTrackerSnapshot();
    return res.status(200).json(snapshot);
  } catch (error) {
    console.error("LEVI AI burn tracker read failed", error);
    return res.status(503).json({
      error: "The live burn tracker is temporarily unavailable. Please try again shortly.",
    });
  }
}
