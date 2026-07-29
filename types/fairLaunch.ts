export type FairLaunchStatus = "announced" | "open" | "closed";

export interface FairLaunchProject {
  id: string;
  mint: string;
  name: string;
  symbol: string;
  summary: string;
  status: FairLaunchStatus;
  launchAt: string | null;
  officialUrl: string | null;
  xUrl: string | null;
  telegramUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FairLaunchProjectRecord extends FairLaunchProject {
  createdBy: string;
}

export interface FairLaunchAccessResponse {
  authenticated: boolean;
  wallet: string | null;
  holderEligible: boolean;
  accessGranted: boolean;
  accessCheckAvailable: boolean;
  isAdmin: boolean;
  holderMint: string;
  balance: number | null;
  balanceRaw: string | null;
  decimals: number | null;
  checkedAt: string | null;
  launches: FairLaunchProject[];
  catalogAvailable: boolean;
  error?: string;
}

export interface FairLaunchMutationResponse {
  project?: FairLaunchProject;
  deletedMint?: string;
  error?: string;
}
