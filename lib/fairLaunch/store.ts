import type {
  FairLaunchProject,
  FairLaunchProjectRecord,
  FairLaunchStatus,
} from "@/types/fairLaunch";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";
import {
  FAIR_LAUNCH_COLLECTION,
  FAIR_LAUNCH_MAX_PROJECTS,
} from "./constants";

export class FairLaunchStoreError extends Error {
  code: "already_exists" | "not_found";

  constructor(code: FairLaunchStoreError["code"], message: string) {
    super(message);
    this.name = "FairLaunchStoreError";
    this.code = code;
  }
}

function normalizeStatus(value: unknown): FairLaunchStatus {
  return value === "open" || value === "closed" ? value : "announced";
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function fromDocument(
  id: string,
  data: FirebaseFirestore.DocumentData
): FairLaunchProjectRecord {
  return {
    id,
    mint: String(data.mint || id),
    name: String(data.name || "Untitled launch"),
    symbol: String(data.symbol || "TOKEN"),
    summary: String(data.summary || ""),
    status: normalizeStatus(data.status),
    launchAt: nullableString(data.launchAt),
    officialUrl: nullableString(data.officialUrl),
    xUrl: nullableString(data.xUrl),
    telegramUrl: nullableString(data.telegramUrl),
    isPublished: data.isPublished === true,
    createdAt: String(data.createdAt || data.updatedAt || new Date(0).toISOString()),
    updatedAt: String(data.updatedAt || data.createdAt || new Date(0).toISOString()),
    createdBy: String(data.createdBy || ""),
  };
}

function toPublicProject(record: FairLaunchProjectRecord): FairLaunchProject {
  return {
    id: record.id,
    mint: record.mint,
    name: record.name,
    symbol: record.symbol,
    summary: record.summary,
    status: record.status,
    launchAt: record.launchAt,
    officialUrl: record.officialUrl,
    xUrl: record.xUrl,
    telegramUrl: record.telegramUrl,
    isPublished: record.isPublished,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function statusRank(status: FairLaunchStatus): number {
  if (status === "open") return 0;
  if (status === "announced") return 1;
  return 2;
}

function sortProjects(
  projects: FairLaunchProjectRecord[]
): FairLaunchProjectRecord[] {
  return projects.sort((a, b) => {
    const byStatus = statusRank(a.status) - statusRank(b.status);
    if (byStatus !== 0) return byStatus;
    const aDate = a.launchAt || a.updatedAt;
    const bDate = b.launchAt || b.updatedAt;
    return bDate.localeCompare(aDate);
  });
}

async function listRecords(): Promise<FairLaunchProjectRecord[]> {
  const snapshot = await getAdminFirestore()
    .collection(FAIR_LAUNCH_COLLECTION)
    .limit(FAIR_LAUNCH_MAX_PROJECTS)
    .get();

  return sortProjects(
    snapshot.docs.map((document) =>
      fromDocument(document.id, document.data())
    )
  );
}

export async function listPublishedFairLaunches(): Promise<FairLaunchProject[]> {
  const records = await listRecords();
  return records
    .filter((project) => project.isPublished)
    .map(toPublicProject);
}

export async function listAdminFairLaunches(): Promise<FairLaunchProject[]> {
  const records = await listRecords();
  return records.map(toPublicProject);
}

export async function createFairLaunch(
  input: Omit<FairLaunchProject, "id" | "createdAt" | "updatedAt">,
  adminWallet: string
): Promise<FairLaunchProject> {
  const now = new Date().toISOString();
  const record: FairLaunchProjectRecord = {
    ...input,
    id: input.mint,
    createdAt: now,
    updatedAt: now,
    createdBy: adminWallet,
  };
  const reference = getAdminFirestore()
    .collection(FAIR_LAUNCH_COLLECTION)
    .doc(input.mint);

  try {
    await reference.create(record);
  } catch (error) {
    const code = (error as { code?: number | string }).code;
    if (
      code === 6 ||
      code === "6" ||
      code === "already-exists" ||
      (error instanceof Error &&
        error.message.toLowerCase().includes("already exists"))
    ) {
      throw new FairLaunchStoreError(
        "already_exists",
        "This token mint is already in the launch catalog."
      );
    }
    throw error;
  }

  return toPublicProject(record);
}

export async function updateFairLaunch(
  mint: string,
  changes: Partial<
    Omit<FairLaunchProject, "id" | "mint" | "createdAt" | "updatedAt">
  >
): Promise<FairLaunchProject> {
  const reference = getAdminFirestore()
    .collection(FAIR_LAUNCH_COLLECTION)
    .doc(mint);
  const existing = await reference.get();
  if (!existing.exists) {
    throw new FairLaunchStoreError("not_found", "Launch project not found.");
  }

  await reference.update({
    ...changes,
    updatedAt: new Date().toISOString(),
  });
  const updated = await reference.get();
  return toPublicProject(fromDocument(updated.id, updated.data() || {}));
}

export async function deleteFairLaunch(mint: string): Promise<void> {
  const reference = getAdminFirestore()
    .collection(FAIR_LAUNCH_COLLECTION)
    .doc(mint);
  const existing = await reference.get();
  if (!existing.exists) {
    throw new FairLaunchStoreError("not_found", "Launch project not found.");
  }
  await reference.delete();
}
