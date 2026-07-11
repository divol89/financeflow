import type { NextApiRequest } from "next";
import { getLeviAccessForWallet } from "@/lib/levi/tokenGate";
import { getSessionFromRequest } from "@/lib/levi/session";

export async function requirePortfolioSession(req: NextApiRequest) {
  const session = getSessionFromRequest(req);
  if (!session) throw new Error("AUTH_REQUIRED");
  const access = await getLeviAccessForWallet(session.wallet);
  return { session, access };
}
