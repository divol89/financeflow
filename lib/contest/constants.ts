import { LEVI_MINT_ADDRESS } from "@/lib/levi/constants";
import type {
  ContestCampaignStatus,
  ContestHolderTier,
  ContestHolderToken,
  LeviSocialContestCampaign,
} from "@/types/contest";

export const LEVI_SOCIAL_CONTEST_ID = "levi-social-2026-01";
export const CONTEST_SUBMISSIONS_COLLECTION = "leviSocialContestSubmissions";
export const CONTEST_CAMPAIGNS_COLLECTION = "leviSocialContests";
export const LEVI_AI_HOLDER_MINT =
  "AQPhtB5DSqFbhtnN5wSjNdkHmBE15qFX76EfXRnspump";

export const CONTEST_HOLDER_TOKENS: ContestHolderToken[] = [
  {
    symbol: "LEVI",
    mint: LEVI_MINT_ADDRESS,
  },
  {
    symbol: "LEVI AI",
    mint: LEVI_AI_HOLDER_MINT,
  },
];

export const CONTEST_HOLDER_TIERS: ContestHolderTier[] = [
  { id: "signal", label: "Signal Holder", minimumHolding: 500 },
  { id: "amplifier", label: "Amplifier Holder", minimumHolding: 1_000 },
  { id: "sentinel", label: "Sentinel Holder", minimumHolding: 10_000 },
];

const DEFAULT_CLOSE_DATE = "2026-08-31T23:59:59.000Z";

function getConfiguredStatus(): ContestCampaignStatus | null {
  const status = process.env.LEVI_CONTEST_STATUS;
  if (status === "open" || status === "closed" || status === "revealed") {
    return status;
  }
  return null;
}

export function getDefaultContestCampaign(): LeviSocialContestCampaign {
  const closesAt = process.env.LEVI_CONTEST_ENDS_AT || DEFAULT_CLOSE_DATE;
  const configuredStatus = getConfiguredStatus();
  const status =
    configuredStatus ||
    (new Date(closesAt).getTime() > Date.now() ? "open" : "closed");

  return {
    id: LEVI_SOCIAL_CONTEST_ID,
    title: "LEVI Social Contest",
    description:
      "Share a thoughtful post about LEVI on X, submit the link, and unlock a surprise reward tier through either a LEVI or LEVI AI holding.",
    status,
    closesAt,
    eligibleTokens: CONTEST_HOLDER_TOKENS,
    tiers: CONTEST_HOLDER_TIERS,
    prizeRevealed: false,
    prizeLabel: null,
  };
}
