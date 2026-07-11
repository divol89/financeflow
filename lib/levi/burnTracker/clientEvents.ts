import type { BurnTrackerPublicSnapshot } from "@/types/burnTracker";
import { isBurnTrackerPublicSnapshot } from "./validation";

const BURN_TRACKER_UPDATED_EVENT = "levi:burn-tracker-updated";
const BURN_TRACKER_STORAGE_KEY = "levi:burn-tracker:snapshot";

let latestSnapshot: BurnTrackerPublicSnapshot | null = null;

export function parseStoredBurnTrackerSnapshot(
  value: string | null
): BurnTrackerPublicSnapshot | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as { snapshot?: unknown };
    return isBurnTrackerPublicSnapshot(parsed.snapshot) ? parsed.snapshot : null;
  } catch {
    return null;
  }
}

export function publishBurnTrackerSnapshot(snapshot: BurnTrackerPublicSnapshot): void {
  latestSnapshot = snapshot;
  if (typeof window === "undefined") return;

  const event = document.createEvent("Event");
  event.initEvent(BURN_TRACKER_UPDATED_EVENT, false, false);
  window.dispatchEvent(event);

  try {
    window.localStorage.setItem(
      BURN_TRACKER_STORAGE_KEY,
      JSON.stringify({ snapshot, publishedAt: Date.now() })
    );
  } catch {
    // Same-tab subscribers still receive the standard DOM event.
  }
}

export function subscribeToBurnTrackerSnapshots(
  listener: (snapshot: BurnTrackerPublicSnapshot) => void
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const handleLocalUpdate = () => {
    if (latestSnapshot) listener(latestSnapshot);
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== BURN_TRACKER_STORAGE_KEY) return;
    const snapshot = parseStoredBurnTrackerSnapshot(event.newValue);
    if (!snapshot) return;
    latestSnapshot = snapshot;
    listener(snapshot);
  };

  window.addEventListener(BURN_TRACKER_UPDATED_EVENT, handleLocalUpdate);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(BURN_TRACKER_UPDATED_EVENT, handleLocalUpdate);
    window.removeEventListener("storage", handleStorage);
  };
}
