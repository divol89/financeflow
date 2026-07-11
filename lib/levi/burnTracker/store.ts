import { randomUUID } from "crypto";
import type { DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";
import type { BurnTrackerLatestBurn, BurnTrackerRecord } from "@/types/burnTracker";
import {
  BURN_TRACKER_COLLECTION,
  BURN_TRACKER_DOCUMENT_ID,
  BURN_TRACKER_REFRESH_LEASE_MS,
} from "./constants";
import {
  isBurnTrackerRefreshLeaseActive,
  isBurnTrackerSnapshotFresh,
} from "./calculations";

export type BurnTrackerRefreshLease =
  | { state: "fresh"; record: BurnTrackerRecord }
  | { state: "locked"; record: BurnTrackerRecord | null }
  | { state: "acquired"; record: BurnTrackerRecord | null; leaseId: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function readLatestBurn(value: unknown): BurnTrackerLatestBurn | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (
    !isNonEmptyString(candidate.signature) ||
    !isNonEmptyString(candidate.occurredAt) ||
    !isNonEmptyString(candidate.solscanUrl)
  ) {
    return null;
  }

  return {
    signature: candidate.signature,
    occurredAt: candidate.occurredAt,
    solscanUrl: candidate.solscanUrl,
    amountRaw:
      typeof candidate.amountRaw === "string" || candidate.amountRaw === null
        ? candidate.amountRaw
        : null,
  };
}

function readRecord(data: DocumentData): BurnTrackerRecord | null {
  if (
    data.version !== 2 ||
    !isNonEmptyString(data.mint) ||
    !isNonEmptyString(data.initialSupplyRaw) ||
    !isNonEmptyString(data.currentSupplyRaw) ||
    !isNonEmptyString(data.totalBurnedRaw) ||
    !isNonEmptyString(data.refreshedAt)
  ) {
    return null;
  }

  return {
    version: 2,
    mint: data.mint,
    initialSupplyRaw: data.initialSupplyRaw,
    currentSupplyRaw: data.currentSupplyRaw,
    totalBurnedRaw: data.totalBurnedRaw,
    communityLockRaw: isNonEmptyString(data.communityLockRaw)
      ? data.communityLockRaw
      : "0",
    latestBurn: readLatestBurn(data.latestBurn),
    lastObservedMintSignature: isNonEmptyString(data.lastObservedMintSignature)
      ? data.lastObservedMintSignature
      : null,
    pendingBurnCursor: isNonEmptyString(data.pendingBurnCursor)
      ? data.pendingBurnCursor
      : null,
    pendingBurnUntil: isNonEmptyString(data.pendingBurnUntil)
      ? data.pendingBurnUntil
      : null,
    verificationPending: data.verificationPending === true,
    refreshedAt: data.refreshedAt,
    refreshLeaseId: isNonEmptyString(data.refreshLeaseId) ? data.refreshLeaseId : null,
    refreshLeaseUntil: isNonEmptyString(data.refreshLeaseUntil)
      ? data.refreshLeaseUntil
      : null,
  };
}

function hasActiveStoredLease(data: DocumentData, nowMs: number): boolean {
  return isBurnTrackerRefreshLeaseActive(
    {
      refreshLeaseUntil: isNonEmptyString(data.refreshLeaseUntil)
        ? data.refreshLeaseUntil
        : null,
    },
    nowMs
  );
}

export async function acquireBurnTrackerRefreshLease(
  now: Date,
  options: { force?: boolean } = {}
): Promise<BurnTrackerRefreshLease> {
  const db = getAdminFirestore();
  const ref = db.collection(BURN_TRACKER_COLLECTION).doc(BURN_TRACKER_DOCUMENT_ID);
  const nowMs = now.getTime();

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const data = snapshot.data() || {};
    const record = snapshot.exists ? readRecord(data) : null;

    if (!options.force && record && isBurnTrackerSnapshotFresh(record, nowMs)) {
      return { state: "fresh", record };
    }

    if (hasActiveStoredLease(data, nowMs)) {
      return { state: "locked", record };
    }

    const leaseId = randomUUID();
    transaction.set(
      ref,
      {
        refreshLeaseId: leaseId,
        refreshLeaseUntil: new Date(nowMs + BURN_TRACKER_REFRESH_LEASE_MS).toISOString(),
      },
      { merge: true }
    );

    return { state: "acquired", record, leaseId };
  });
}

export async function completeBurnTrackerRefresh(
  leaseId: string,
  record: BurnTrackerRecord
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(BURN_TRACKER_COLLECTION).doc(BURN_TRACKER_DOCUMENT_ID);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const storedLeaseId = snapshot.data()?.refreshLeaseId;
    if (storedLeaseId !== leaseId) return;

    transaction.set(ref, {
      ...record,
      refreshLeaseId: null,
      refreshLeaseUntil: null,
    });
  });
}

export async function releaseBurnTrackerRefreshLease(leaseId: string): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(BURN_TRACKER_COLLECTION).doc(BURN_TRACKER_DOCUMENT_ID);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.data()?.refreshLeaseId !== leaseId) return;

    transaction.update(ref, {
      refreshLeaseId: null,
      refreshLeaseUntil: null,
    });
  });
}
