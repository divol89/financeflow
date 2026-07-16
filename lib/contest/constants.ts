import {
  AGENT_K9_MINT_ADDRESS,
  AGENT_K9_SYMBOL,
} from "@/lib/agentK9/brand";
import type {
  ContestCampaignStatus,
  ContestHolderTier,
  ContestHolderToken,
  LeviSocialContestCampaign,
} from "@/types/contest";

export const LEVI_SOCIAL_CONTEST_ID = "agent-k9-social-2026-01";
export const CONTEST_SUBMISSIONS_COLLECTION = "agentK9SocialContestSubmissions";
export const CONTEST_CAMPAIGNS_COLLECTION = "agentK9SocialContests";
export const AGENT_K9_HOLDER_MINT = AGENT_K9_MINT_ADDRESS;

export const CONTEST_HOLDER_TOKENS: ContestHolderToken[] = [
  {
    symbol: AGENT_K9_SYMBOL,
    mint: AGENT_K9_HOLDER_MINT,
  },
];

export const CONTEST_HOLDER_TIERS: ContestHolderTier[] = [
  { id: "signal", label: "Signal Holder", minimumHolding: 500 },
  { id: "amplifier", label: "Amplifier Holder", minimumHolding: 1_000 },
  { id: "sentinel", label: "Sentinel Holder", minimumHolding: 10_000 },
];

const DEFAULT_CLOSE_DATE = "2026-08-31T23:59:59.000Z";

function getConfiguredStatus(): ContestCampaignStatus | null {
  const status = process.env.AGENT_K9_CONTEST_STATUS;
  if (status === "open" || status === "closed" || status === "revealed") {
    return status;
  }
  return null;
}

export function getDefaultContestCampaign(): LeviSocialContestCampaign {
  const closesAt = process.env.AGENT_K9_CONTEST_ENDS_AT || DEFAULT_CLOSE_DATE;
  const configuredStatus = getConfiguredStatus();
  const status =
    configuredStatus ||
    (new Date(closesAt).getTime() > Date.now() ? "open" : "closed");

  return {
    id: LEVI_SOCIAL_CONTEST_ID,
    title: "Agent K9 Social Contest",
    description:
      "Share a thoughtful post about Agent K9 on X, submit the link, and unlock a surprise reward tier through your K9 holding.",
    status,
    closesAt,
    eligibleTokens: CONTEST_HOLDER_TOKENS,
    tiers: CONTEST_HOLDER_TIERS,
    prizeRevealed: false,
    prizeLabel: null,
  };
}
