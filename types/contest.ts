export type ContestSubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "winner";

export type ContestCampaignStatus = "open" | "closed" | "revealed";

export interface ContestHolderToken {
  symbol: string;
  mint: string;
}

export interface ContestHolderTier {
  id: "signal" | "amplifier" | "sentinel";
  label: string;
  minimumHolding: number;
}

export interface LeviSocialContestCampaign {
  id: string;
  title: string;
  description: string;
  status: ContestCampaignStatus;
  closesAt: string;
  eligibleTokens: ContestHolderToken[];
  tiers: ContestHolderTier[];
  prizeRevealed: boolean;
  prizeLabel: string | null;
}

export interface ContestHolderBalance {
  symbol: string;
  mint: string;
  balance: number | null;
  available: boolean;
}

export interface ContestEligibilityResponse {
  wallet: string;
  eligible: boolean;
  tier: ContestHolderTier | null;
  qualifyingToken: string | null;
  holdings: ContestHolderBalance[];
  checkedAt: string;
  error?: string;
}

export interface ContestPublicSubmission {
  id: string;
  postUrl: string;
  submittedAt: string;
  walletLabel: string;
}

export interface ContestPublicResponse {
  campaign: LeviSocialContestCampaign;
  entries: ContestPublicSubmission[];
  totalEntries: number;
  storageAvailable: boolean;
  error?: string;
}

export interface ContestSubmissionResponse {
  submission?: {
    id: string;
    postUrl: string;
    submittedAt: string;
    status: ContestSubmissionStatus;
  };
  totalEntries?: number;
  eligibility?: ContestEligibilityResponse;
  error?: string;
}

export interface ContestSubmissionRecord {
  id: string;
  campaignId: string;
  wallet: string;
  postUrl: string;
  status: ContestSubmissionStatus;
  submittedAt: string;
  updatedAt: string;
  score: number | null;
  reviewerNote: string | null;
}
