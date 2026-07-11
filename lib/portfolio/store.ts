import { createHash, randomUUID } from "crypto";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";
import type {
  JournalDecision,
  PortfolioActivity,
  PortfolioJournalEntry,
  PortfolioSnapshot,
  PortfolioWatchItem,
} from "@/types/portfolio";
import type {
  DistributionPressureResult,
  ScannerTokenSnapshot,
} from "@/types/levi";
import {
  PORTFOLIO_ROOT_COLLECTION,
} from "./constants";
import { shouldStorePortfolioSnapshot } from "./snapshots";

function ownerId(wallet: string): string {
  return createHash("sha256").update(wallet).digest("hex");
}

function watchItemId(wallet: string, mint: string): string {
  return createHash("sha256").update(`${wallet}:${mint}`).digest("hex");
}

function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function rootRef(wallet: string) {
  return getAdminFirestore().collection(PORTFOLIO_ROOT_COLLECTION).doc(ownerId(wallet));
}

export async function savePortfolioSnapshot(
  snapshot: PortfolioSnapshot
): Promise<boolean> {
  const db = getAdminFirestore();
  const ref = rootRef(snapshot.wallet);

  return db.runTransaction(async (transaction) => {
    const document = await transaction.get(ref);
    const lastStored = document.data()?.lastStoredSnapshot as PortfolioSnapshot | undefined;
    const shouldStore = shouldStorePortfolioSnapshot(lastStored || null, snapshot);

    transaction.set(
      ref,
      {
        wallet: snapshot.wallet,
        currentSnapshot: clean(snapshot),
        ...(shouldStore ? { lastStoredSnapshot: clean(snapshot) } : {}),
        updatedAt: snapshot.capturedAt,
      },
      { merge: true }
    );
    if (shouldStore) {
      transaction.set(
        ref.collection("snapshots").doc(String(new Date(snapshot.capturedAt).getTime())),
        clean(snapshot)
      );
    }
    return shouldStore;
  });
}

export async function listPortfolioSnapshots(
  wallet: string,
  historyDays: number | null,
  now = new Date()
): Promise<PortfolioSnapshot[]> {
  if (historyDays === 0) return [];
  let query: FirebaseFirestore.Query = rootRef(wallet)
    .collection("snapshots")
    .orderBy("capturedAt", "desc")
    .limit(500);
  if (typeof historyDays === "number") {
    query = query.where(
      "capturedAt",
      ">=",
      new Date(now.getTime() - historyDays * 24 * 60 * 60 * 1000).toISOString()
    );
  }
  const snapshot = await query.get();
  return snapshot.docs
    .map((document) => document.data() as PortfolioSnapshot)
    .sort((left, right) => left.capturedAt.localeCompare(right.capturedAt));
}

export async function savePortfolioActivity(
  wallet: string,
  activity: PortfolioActivity[]
): Promise<void> {
  if (activity.length === 0) return;
  const batch = getAdminFirestore().batch();
  const collection = rootRef(wallet).collection("activity");
  for (const event of activity) {
    batch.set(collection.doc(createHash("sha256").update(event.id).digest("hex")), clean(event));
  }
  await batch.commit();
}

export async function listPortfolioActivity(
  wallet: string,
  limit: number
): Promise<PortfolioActivity[]> {
  if (limit <= 0) return [];
  const snapshot = await rootRef(wallet)
    .collection("activity")
    .orderBy("blockTime", "desc")
    .limit(limit)
    .get();
  return snapshot.docs.map((document) => document.data() as PortfolioActivity);
}

export async function listWatchlist(wallet: string): Promise<PortfolioWatchItem[]> {
  const snapshot = await rootRef(wallet)
    .collection("watchlist")
    .orderBy("updatedAt", "desc")
    .limit(100)
    .get();
  return snapshot.docs.map((document) => document.data() as PortfolioWatchItem);
}

export async function saveWatchItem(input: {
  ownerWallet: string;
  targetWallet: string;
  tokenMint: string;
  scanId?: string | null;
  snapshot?: ScannerTokenSnapshot | null;
  pressure?: DistributionPressureResult | null;
  limit: number;
}): Promise<PortfolioWatchItem> {
  if (input.limit <= 0) throw new Error("Watchlist requires Basic access.");
  const collection = rootRef(input.ownerWallet).collection("watchlist");
  const id = watchItemId(input.targetWallet, input.tokenMint);
  const ref = collection.doc(id);
  const existing = await ref.get();
  if (!existing.exists) {
    const count = await collection.count().get();
    if (count.data().count >= input.limit) {
      throw new Error(`Watchlist limit reached (${input.limit}).`);
    }
  }
  const now = new Date().toISOString();
  const item: PortfolioWatchItem = {
    id,
    targetWallet: input.targetWallet,
    tokenMint: input.tokenMint,
    scanId: input.scanId || null,
    snapshot: input.snapshot || null,
    pressure: input.pressure || null,
    createdAt:
      (existing.data()?.createdAt as string | undefined) || now,
    updatedAt: now,
  };
  await ref.set(clean(item));
  return item;
}

export async function removeWatchItem(wallet: string, id: string): Promise<void> {
  await rootRef(wallet).collection("watchlist").doc(id).delete();
}

export async function listJournal(wallet: string): Promise<PortfolioJournalEntry[]> {
  const snapshot = await rootRef(wallet)
    .collection("journal")
    .orderBy("updatedAt", "desc")
    .limit(250)
    .get();
  return snapshot.docs.map((document) => document.data() as PortfolioJournalEntry);
}

export async function createJournalEntry(input: {
  ownerWallet: string;
  decision: JournalDecision;
  tokenMint: string;
  targetWallet?: string | null;
  thesis: string;
  invalidation: string;
  notes: string;
  outcome: string;
  limit: number;
}): Promise<PortfolioJournalEntry> {
  if (input.limit <= 0) throw new Error("Decision Journal requires Basic access.");
  const collection = rootRef(input.ownerWallet).collection("journal");
  const count = await collection.count().get();
  if (count.data().count >= input.limit) {
    throw new Error(`Journal limit reached (${input.limit}).`);
  }
  const now = new Date().toISOString();
  const entry: PortfolioJournalEntry = {
    id: randomUUID(),
    decision: input.decision,
    tokenMint: input.tokenMint,
    targetWallet: input.targetWallet || null,
    thesis: input.thesis,
    invalidation: input.invalidation,
    notes: input.notes,
    outcome: input.outcome,
    createdAt: now,
    updatedAt: now,
  };
  await collection.doc(entry.id).set(clean(entry));
  return entry;
}

export async function updateJournalEntry(input: {
  ownerWallet: string;
  id: string;
  decision: JournalDecision;
  tokenMint: string;
  targetWallet?: string | null;
  thesis: string;
  invalidation: string;
  notes: string;
  outcome: string;
}): Promise<PortfolioJournalEntry> {
  const ref = rootRef(input.ownerWallet).collection("journal").doc(input.id);
  const existing = await ref.get();
  if (!existing.exists) throw new Error("Journal entry not found.");
  const current = existing.data() as PortfolioJournalEntry;
  const entry: PortfolioJournalEntry = {
    ...current,
    decision: input.decision,
    tokenMint: input.tokenMint,
    targetWallet: input.targetWallet || null,
    thesis: input.thesis,
    invalidation: input.invalidation,
    notes: input.notes,
    outcome: input.outcome,
    updatedAt: new Date().toISOString(),
  };
  await ref.set(clean(entry));
  return entry;
}

export async function removeJournalEntry(wallet: string, id: string): Promise<void> {
  await rootRef(wallet).collection("journal").doc(id).delete();
}
