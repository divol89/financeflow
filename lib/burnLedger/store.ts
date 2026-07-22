import type { DocumentData } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/server/firebaseAdmin";
import type {
  BurnLedgerEvent,
  BurnLedgerTokenSummary,
} from "@/types/burnLedger";
import {
  BURN_LEDGER_EVENTS_COLLECTION,
  BURN_LEDGER_EVENT_LIMIT,
  BURN_LEDGER_TOKENS_COLLECTION,
  BURN_LEDGER_TOKEN_LIMIT,
} from "./constants";

function eventDocumentId(event: Pick<BurnLedgerEvent, "mint" | "signature">) {
  return `${event.mint}_${event.signature}`;
}

function readEvent(data: DocumentData): BurnLedgerEvent | null {
  if (
    data.version !== 1 ||
    typeof data.signature !== "string" ||
    typeof data.mint !== "string" ||
    typeof data.wallet !== "string" ||
    typeof data.program !== "string" ||
    typeof data.programId !== "string" ||
    typeof data.decimals !== "number" ||
    typeof data.amountRaw !== "string" ||
    typeof data.supplyAfterRaw !== "string" ||
    typeof data.occurredAt !== "string"
  ) {
    return null;
  }

  return {
    signature: data.signature,
    mint: data.mint,
    wallet: data.wallet,
    name: typeof data.name === "string" ? data.name : null,
    symbol: typeof data.symbol === "string" ? data.symbol : null,
    program: data.program,
    programId: data.programId,
    decimals: data.decimals,
    amountRaw: data.amountRaw,
    supplyAfterRaw: data.supplyAfterRaw,
    occurredAt: data.occurredAt,
    solscanUrl: data.solscanUrl,
    tokenUrl: data.tokenUrl,
  } as BurnLedgerEvent;
}

function readSummary(data: DocumentData): BurnLedgerTokenSummary | null {
  if (
    data.version !== 1 ||
    typeof data.mint !== "string" ||
    typeof data.program !== "string" ||
    typeof data.programId !== "string" ||
    typeof data.decimals !== "number" ||
    typeof data.totalBurnedRaw !== "string" ||
    typeof data.burnCount !== "number" ||
    typeof data.currentSupplyRaw !== "string" ||
    typeof data.lastBurnAt !== "string" ||
    typeof data.lastSignature !== "string"
  ) {
    return null;
  }

  return {
    mint: data.mint,
    name: typeof data.name === "string" ? data.name : null,
    symbol: typeof data.symbol === "string" ? data.symbol : null,
    program: data.program,
    programId: data.programId,
    decimals: data.decimals,
    totalBurnedRaw: data.totalBurnedRaw,
    burnCount: data.burnCount,
    currentSupplyRaw: data.currentSupplyRaw,
    lastBurnAt: data.lastBurnAt,
    lastSignature: data.lastSignature,
    tokenUrl: data.tokenUrl,
  } as BurnLedgerTokenSummary;
}

export function buildNextBurnTokenSummary(
  event: BurnLedgerEvent,
  currentSummary: BurnLedgerTokenSummary | null
): BurnLedgerTokenSummary {
  const eventIsLatest =
    !currentSummary || event.occurredAt >= currentSummary.lastBurnAt;

  return {
    mint: event.mint,
    name: event.name || currentSummary?.name || null,
    symbol: event.symbol || currentSummary?.symbol || null,
    program: event.program,
    programId: event.programId,
    decimals: event.decimals,
    totalBurnedRaw: (
      BigInt(currentSummary?.totalBurnedRaw || "0") + BigInt(event.amountRaw)
    ).toString(),
    burnCount: (currentSummary?.burnCount || 0) + 1,
    currentSupplyRaw: event.supplyAfterRaw,
    lastBurnAt: eventIsLatest
      ? event.occurredAt
      : currentSummary?.lastBurnAt || event.occurredAt,
    lastSignature: eventIsLatest
      ? event.signature
      : currentSummary?.lastSignature || event.signature,
    tokenUrl: event.tokenUrl,
  };
}

export async function saveBurnLedgerEvent(event: BurnLedgerEvent): Promise<void> {
  const db = getAdminFirestore();
  const eventRef = db
    .collection(BURN_LEDGER_EVENTS_COLLECTION)
    .doc(eventDocumentId(event));
  const tokenRef = db.collection(BURN_LEDGER_TOKENS_COLLECTION).doc(event.mint);

  await db.runTransaction(async (transaction) => {
    const [existingEvent, tokenSnapshot] = await Promise.all([
      transaction.get(eventRef),
      transaction.get(tokenRef),
    ]);
    if (existingEvent.exists) return;

    const currentSummary = tokenSnapshot.exists
      ? readSummary(tokenSnapshot.data() || {})
      : null;
    const nextSummary = buildNextBurnTokenSummary(event, currentSummary);

    transaction.create(eventRef, { version: 1, ...event });
    transaction.set(tokenRef, { version: 1, ...nextSummary });
  });
}

export async function readBurnLedger(): Promise<{
  events: BurnLedgerEvent[];
  tokens: BurnLedgerTokenSummary[];
}> {
  const db = getAdminFirestore();
  const [eventSnapshot, tokenSnapshot] = await Promise.all([
    db
      .collection(BURN_LEDGER_EVENTS_COLLECTION)
      .orderBy("occurredAt", "desc")
      .limit(BURN_LEDGER_EVENT_LIMIT)
      .get(),
    db
      .collection(BURN_LEDGER_TOKENS_COLLECTION)
      .orderBy("lastBurnAt", "desc")
      .limit(BURN_LEDGER_TOKEN_LIMIT)
      .get(),
  ]);

  return {
    events: eventSnapshot.docs.flatMap((doc) => {
      const event = readEvent(doc.data());
      return event ? [event] : [];
    }),
    tokens: tokenSnapshot.docs.flatMap((doc) => {
      const summary = readSummary(doc.data());
      return summary ? [summary] : [];
    }),
  };
}
