import { createHash, randomUUID } from "crypto";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";
import type { ClassifiedTokenActivity, LeviScanReport } from "@/types/levi";

const SCAN_CACHE_COLLECTION = "levi_scanner_cache";
const OWNED_SCANS_COLLECTION = "levi_scanner_reports";
const SCAN_CACHE_TTL_MS = 10 * 60 * 1000;
const SCAN_CACHE_SCHEMA = "scanner-v2.1";

interface CachedScanDocument {
  expiresAt?: string;
  report?: LeviScanReport;
}

function serializableReport(report: LeviScanReport): LeviScanReport {
  return JSON.parse(JSON.stringify(report)) as LeviScanReport;
}

export function scannerCacheKey(input: {
  wallet: string;
  mint?: string;
  mode: string;
  tier: string;
  cursor?: string;
}): string {
  return createHash("sha256")
    .update(
      [
        SCAN_CACHE_SCHEMA,
        input.wallet,
        input.mint || "-",
        input.mode,
        input.tier,
        input.cursor || "latest",
      ].join(":")
    )
    .digest("hex");
}

export async function getCachedScanReport(
  key: string,
  now = new Date()
): Promise<LeviScanReport | null> {
  const snapshot = await getAdminFirestore()
    .collection(SCAN_CACHE_COLLECTION)
    .doc(key)
    .get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as CachedScanDocument | undefined;
  if (!data?.report || !data.expiresAt) return null;
  if (new Date(data.expiresAt).getTime() <= now.getTime()) return null;
  return data.report;
}

export async function cacheScanReport(
  key: string,
  report: LeviScanReport,
  now = new Date()
): Promise<void> {
  await getAdminFirestore()
    .collection(SCAN_CACHE_COLLECTION)
    .doc(key)
    .set({
      report: serializableReport(report),
      cachedAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + SCAN_CACHE_TTL_MS).toISOString(),
    });
}

export async function saveOwnedScanReport(
  ownerWallet: string,
  report: LeviScanReport
): Promise<LeviScanReport> {
  const scanId = randomUUID();
  const storedReport = serializableReport({
    ...report,
    scanId,
    activityEvents: report.activityEvents?.map((event) => ({
      ...event,
      sourceScanId: scanId,
    })),
  });
  await getAdminFirestore()
    .collection(OWNED_SCANS_COLLECTION)
    .doc(scanId)
    .set({
      ownerWallet,
      createdAt: new Date().toISOString(),
      report: storedReport,
    });
  return storedReport;
}

export async function getOwnedScanExplanation(input: {
  ownerWallet: string;
  scanId: string;
  eventId: string;
}): Promise<{
  report: LeviScanReport;
  event: ClassifiedTokenActivity;
} | null> {
  const report = await getOwnedScanReport(input.ownerWallet, input.scanId);
  if (!report) return null;
  const event = report.activityEvents?.find(
    (candidate) =>
      candidate.id === input.eventId || candidate.signature === input.eventId
  );
  return event ? { report, event } : null;
}

export async function getOwnedScanReport(
  ownerWallet: string,
  scanId: string
): Promise<LeviScanReport | null> {
  const snapshot = await getAdminFirestore()
    .collection(OWNED_SCANS_COLLECTION)
    .doc(scanId)
    .get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() as {
    ownerWallet?: string;
    report?: LeviScanReport;
  };
  if (data.ownerWallet !== ownerWallet || !data.report) return null;
  return data.report;
}
