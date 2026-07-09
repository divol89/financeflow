import type { NextApiRequest, NextApiResponse } from "next";
import { clearAuthCookies } from "@/lib/levi/session";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearAuthCookies(res);
  return res.status(200).json({ authenticated: false });
}
