import { createHash } from "crypto";
import type {
  ContestPublicSubmission,
  ContestSubmissionRecord,
  ContestSubmissionStatus,
  LeviSocialContestCampaign,
} from "@/types/contest";
import {
  CONTEST_CAMPAIGNS_COLLECTION,
  CONTEST_SUBMISSIONS_COLLECTION,
  getDefaultContestCampaign,
  LEVI_SOCIAL_CONTEST_ID,
} from "./constants";
import { abbreviatedWallet } from "./validation";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";

function submissionId(campaignId: string, wallet: string): string {
  return createHash("sha256")
    .update(`${campaignId}:${wallet}`)
    .digest("hex");
}

function fromDocument(
  id: string,
  data: FirebaseFirestore.DocumentData
): ContestSubmissionRecord {
  return {
    id,
    campaignId: String(data.campaignId),
    wallet: String(data.wallet),
    postUrl: String(data.postUrl),
    status: data.status as ContestSubmissionStatus,
    submittedAt: String(data.submittedAt),
    updatedAt: String(data.updatedAt),
    score: typeof data.score === "number" ? data.score : null,
    reviewerNote: typeof data.reviewerNote === "string" ? data.reviewerNote : null,
  };
}

export async function getContestCampaign(): Promise<LeviSocialContestCampaign> {
  const fallback = getDefaultContestCampaign();
  const snapshot = await getAdminFirestore()
    .collection(CONTEST_CAMPAIGNS_COLLECTION)
    .doc(LEVI_SOCIAL_CONTEST_ID)
    .get();

  if (!snapshot.exists) return fallback;
  const data = snapshot.data() || {};

  return {
    ...fallback,
    status:
      data.status === "open" || data.status === "closed" || data.status === "revealed"
        ? data.status
        : fallback.status,
    closesAt: typeof data.closesAt === "string" ? data.closesAt : fallback.closesAt,
    prizeRevealed:
      typeof data.prizeRevealed === "boolean"
        ? data.prizeRevealed
        : fallback.prizeRevealed,
    prizeLabel:
      typeof data.prizeLabel === "string" || data.prizeLabel === null
        ? data.prizeLabel
        : fallback.prizeLabel,
    id: LEVI_SOCIAL_CONTEST_ID,
  };
}

export async function createSubmission(input: {
  campaignId: string;
  wallet: string;
  postUrl: string;
}): Promise<ContestSubmissionRecord> {
  const db = getAdminFirestore();
  const id = submissionId(input.campaignId, input.wallet);
  const ref = db.collection(CONTEST_SUBMISSIONS_COLLECTION).doc(id);
  const existing = await ref.get();
  if (existing.exists) {
    throw new Error("A submission already exists for this wallet.");
  }

  const now = new Date().toISOString();
  const record: ContestSubmissionRecord = {
    id,
    campaignId: input.campaignId,
    wallet: input.wallet,
    postUrl: input.postUrl,
    status: "pending",
    submittedAt: now,
    updatedAt: now,
    score: null,
    reviewerNote: null,
  };

  try {
    await ref.create(record);
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("already exists")) {
      throw new Error("A submission already exists for this wallet.");
    }
    throw error;
  }

  return record;
}

export async function listPublicSubmissions(
  campaignId: string
): Promise<ContestPublicSubmission[]> {
  const snapshot = await getAdminFirestore()
    .collection(CONTEST_SUBMISSIONS_COLLECTION)
    .where("campaignId", "==", campaignId)
    .limit(200)
    .get();

  return snapshot.docs
    .map((doc) => fromDocument(doc.id, doc.data()))
    .filter((submission) =>
      submission.status === "approved" || submission.status === "winner"
    )
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .slice(0, 50)
    .map((submission) => ({
      id: submission.id,
      postUrl: submission.postUrl,
      submittedAt: submission.submittedAt,
      walletLabel: abbreviatedWallet(submission.wallet),
    }));
}

export async function countCampaignSubmissions(campaignId: string): Promise<number> {
  const aggregate = await getAdminFirestore()
    .collection(CONTEST_SUBMISSIONS_COLLECTION)
    .where("campaignId", "==", campaignId)
    .count()
    .get();

  return aggregate.data().count;
}

export async function listAdminSubmissions(
  campaignId: string
): Promise<ContestSubmissionRecord[]> {
  const snapshot = await getAdminFirestore()
    .collection(CONTEST_SUBMISSIONS_COLLECTION)
    .where("campaignId", "==", campaignId)
    .limit(500)
    .get();

  return snapshot.docs
    .map((doc) => fromDocument(doc.id, doc.data()))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function updateSubmission(input: {
  id: string;
  status?: ContestSubmissionStatus;
  score?: number | null;
  reviewerNote?: string | null;
}): Promise<ContestSubmissionRecord> {
  const ref = getAdminFirestore()
    .collection(CONTEST_SUBMISSIONS_COLLECTION)
    .doc(input.id);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error("Submission not found.");

  const changes = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.score !== undefined ? { score: input.score } : {}),
    ...(input.reviewerNote !== undefined
      ? { reviewerNote: input.reviewerNote }
      : {}),
    updatedAt: new Date().toISOString(),
  };
  await ref.update(changes);
  const updated = await ref.get();
  return fromDocument(updated.id, updated.data() || {});
}

export async function updateContestCampaign(
  changes: Partial<Pick<LeviSocialContestCampaign, "status" | "prizeRevealed" | "prizeLabel" | "closesAt">>
): Promise<LeviSocialContestCampaign> {
  const ref = getAdminFirestore()
    .collection(CONTEST_CAMPAIGNS_COLLECTION)
    .doc(LEVI_SOCIAL_CONTEST_ID);
  await ref.set(
    {
      ...changes,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  return getContestCampaign();
}
