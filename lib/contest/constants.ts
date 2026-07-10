import { LEVI_BASIC_THRESHOLD } from "@/lib/levi/constants";
import type {
  ContestCampaignStatus,
  LeviSocialContestCampaign,
} from "@/types/contest";

export const LEVI_SOCIAL_CONTEST_ID = "levi-social-2026-01";
export const CONTEST_SUBMISSIONS_COLLECTION = "leviSocialContestSubmissions";
export const CONTEST_CAMPAIGNS_COLLECTION = "leviSocialContests";

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
      "Share a thoughtful post about LEVI on X, submit the link, and help the community move the signal further.",
    status,
    closesAt,
    requiredLevi: LEVI_BASIC_THRESHOLD,
    prizeRevealed: false,
    prizeLabel: null,
  };
}
