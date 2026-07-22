import type {
  ContestCampaignStatus,
  ContestHolderTier,
  ContestHolderToken,
  LeviSocialContestCampaign,
} from "@/types/contest";

export const LEVI_SOCIAL_CONTEST_ID = "agent-k9-social-2026-01";
export const CONTEST_SUBMISSIONS_COLLECTION = "agentK9SocialContestSubmissions";
export const CONTEST_CAMPAIGNS_COLLECTION = "agentK9SocialContests";

export const CONTEST_HOLDER_TOKENS: ContestHolderToken[] = [];

export const CONTEST_HOLDER_TIERS: ContestHolderTier[] = [];

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
    title: "Flow-Finance Social Quest",
    description:
      "Share a thoughtful post about a Flow-Finance adventure on X and submit the direct link for human review. No token holding is required.",
    status,
    closesAt,
    eligibleTokens: CONTEST_HOLDER_TOKENS,
    tiers: CONTEST_HOLDER_TIERS,
    prizeRevealed: false,
    prizeLabel: null,
  };
}
