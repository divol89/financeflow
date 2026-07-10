export type ContestSubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "winner";

export type ContestCampaignStatus = "open" | "closed" | "revealed";

export interface LeviSocialContestCampaign {
  id: string;
  title: string;
  description: string;
  status: ContestCampaignStatus;
  closesAt: string;
  requiredLevi: number;
  prizeRevealed: boolean;
  prizeLabel: string | null;
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
