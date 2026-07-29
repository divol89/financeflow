import type { NextApiRequest, NextApiResponse } from "next";
import { isFairLaunchAdminWallet } from "@/lib/fairLaunch/admin";
import {
  createFairLaunch,
  deleteFairLaunch,
  FairLaunchStoreError,
  updateFairLaunch,
} from "@/lib/fairLaunch/store";
import {
  CreateFairLaunchSchema,
  DeleteFairLaunchSchema,
  UpdateFairLaunchSchema,
} from "@/lib/fairLaunch/validation";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import type { FairLaunchMutationResponse } from "@/types/fairLaunch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FairLaunchMutationResponse>
) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");

  const limited = checkRateLimit(
    `fair-launch-admin:${getClientKey(req)}`,
    40,
    60_000
  );
  if (!limited.allowed) {
    return res
      .status(429)
      .json({ error: "Too many administration requests. Try again shortly." });
  }

  const session = getSessionFromRequest(req);
  if (!session || !isFairLaunchAdminWallet(session.wallet)) {
    return res.status(403).json({ error: "Admin wallet required." });
  }

  try {
    if (req.method === "POST") {
      const parsed = CreateFairLaunchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid launch project.",
        });
      }

      const project = await createFairLaunch(parsed.data, session.wallet);
      return res.status(201).json({ project });
    }

    if (req.method === "PATCH") {
      const parsed = UpdateFairLaunchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid launch update.",
        });
      }

      const { mint, ...changes } = parsed.data;
      const project = await updateFairLaunch(mint, changes);
      return res.status(200).json({ project });
    }

    if (req.method === "DELETE") {
      const parsed = DeleteFairLaunchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: parsed.error.issues[0]?.message || "Invalid token mint.",
        });
      }

      await deleteFairLaunch(parsed.data.mint);
      return res.status(200).json({ deletedMint: parsed.data.mint });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    if (error instanceof FairLaunchStoreError) {
      return res
        .status(error.code === "already_exists" ? 409 : 404)
        .json({ error: error.message });
    }

    console.error("Fair-launch administration failed", error);
    return res
      .status(503)
      .json({ error: "Launch administration is temporarily unavailable." });
  }
}
