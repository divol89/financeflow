import type { NextApiRequest, NextApiResponse } from "next";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";
import { getSessionFromRequest } from "@/lib/levi/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return res.status(200).json({ authenticated: false });
    }

    const access = await getLeviAccessForWallet(session.wallet);
    return res.status(200).json({ authenticated: true, session, access });
  } catch (error) {
    console.error("K9 auth session check failed", error);
    return res.status(200).json({ authenticated: false });
  }
}
