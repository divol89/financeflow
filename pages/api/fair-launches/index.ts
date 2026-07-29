import type { NextApiRequest, NextApiResponse } from "next";
import { isFairLaunchAdminWallet } from "@/lib/fairLaunch/admin";
import { BULLISH_MULE_MINT } from "@/lib/fairLaunch/constants";
import {
  getBullishMuleBalance,
  hasBullishMuleAccess,
} from "@/lib/fairLaunch/eligibility";
import {
  listAdminFairLaunches,
  listPublishedFairLaunches,
} from "@/lib/fairLaunch/store";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { getSessionFromRequest } from "@/lib/levi/session";
import type { FairLaunchAccessResponse } from "@/types/fairLaunch";

function unauthenticatedResponse(): FairLaunchAccessResponse {
  return {
    authenticated: false,
    wallet: null,
    holderEligible: false,
    accessGranted: false,
    accessCheckAvailable: true,
    isAdmin: false,
    holderMint: BULLISH_MULE_MINT,
    balance: null,
    balanceRaw: null,
    decimals: null,
    checkedAt: null,
    launches: [],
    catalogAvailable: true,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FairLaunchAccessResponse | { error: string }>
) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const limited = checkRateLimit(
    `fair-launches:${getClientKey(req)}`,
    30,
    60_000
  );
  if (!limited.allowed) {
    return res
      .status(429)
      .json({ error: "Too many launch-board requests. Try again shortly." });
  }

  const session = getSessionFromRequest(req);
  if (!session) return res.status(200).json(unauthenticatedResponse());

  const isAdmin = isFairLaunchAdminWallet(session.wallet);
  let balance: Awaited<ReturnType<typeof getBullishMuleBalance>> | null = null;

  try {
    balance = await getBullishMuleBalance(session.wallet);
  } catch (error) {
    console.error("Bullish Mule holder verification failed", error);
    if (!isAdmin) {
      return res.status(503).json({
        authenticated: true,
        wallet: session.wallet,
        holderEligible: false,
        accessGranted: false,
        accessCheckAvailable: false,
        isAdmin: false,
        holderMint: BULLISH_MULE_MINT,
        balance: null,
        balanceRaw: null,
        decimals: null,
        checkedAt: null,
        launches: [],
        catalogAvailable: true,
        error:
          "Holder verification is temporarily unavailable. Your wallet was not treated as ineligible.",
      });
    }
  }

  const holderEligible = balance
    ? hasBullishMuleAccess(balance.raw)
    : false;
  const accessGranted = holderEligible || isAdmin;

  let launches = [];
  try {
    launches = accessGranted
      ? isAdmin
        ? await listAdminFairLaunches()
        : await listPublishedFairLaunches()
      : [];
  } catch (error) {
    console.error("Fair-launch catalog load failed", error);
    return res.status(503).json({
      authenticated: true,
      wallet: session.wallet,
      holderEligible,
      accessGranted,
      accessCheckAvailable: balance !== null,
      isAdmin,
      holderMint: BULLISH_MULE_MINT,
      balance: balance?.balance ?? null,
      balanceRaw: balance?.raw.toString() ?? null,
      decimals: balance?.decimals ?? null,
      checkedAt: balance ? new Date().toISOString() : null,
      launches: [],
      catalogAvailable: false,
      error: "The launch catalog is temporarily unavailable.",
    });
  }

  return res.status(200).json({
    authenticated: true,
    wallet: session.wallet,
    holderEligible,
    accessGranted,
    accessCheckAvailable: balance !== null,
    isAdmin,
    holderMint: BULLISH_MULE_MINT,
    balance: balance?.balance ?? null,
    balanceRaw: balance?.raw.toString() ?? null,
    decimals: balance?.decimals ?? null,
    checkedAt: balance ? new Date().toISOString() : null,
    launches,
    catalogAvailable: true,
  });
}
