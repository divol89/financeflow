import { createHmac, timingSafeEqual } from "crypto";
import type { LeviScanMode } from "@/types/levi";

const CURSOR_VERSION = 1;

export interface ScannerSignatureSourceCursor {
  address: string;
  before?: string;
  done?: boolean;
}

export interface ScannerCursorPayload {
  version: typeof CURSOR_VERSION;
  wallet: string;
  targetMint?: string;
  mode: LeviScanMode;
  pageIndex: number;
  sources: ScannerSignatureSourceCursor[];
}

export class InvalidScannerCursorError extends Error {
  constructor(message = "The scanner continuation cursor is invalid or expired.") {
    super(message);
    this.name = "InvalidScannerCursorError";
  }
}

function cursorSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return `levi-scanner:${secret}`;
  if (process.env.NODE_ENV === "production") {
    throw new InvalidScannerCursorError();
  }
  return "levi-scanner:local-development-secret";
}

function encode(value: Buffer | string): string {
  return Buffer.from(value).toString("base64url");
}

function signatureFor(body: string): string {
  return encode(createHmac("sha256", cursorSecret()).update(body).digest());
}

function isSource(value: unknown): value is ScannerSignatureSourceCursor {
  if (!value || typeof value !== "object") return false;
  const source = value as ScannerSignatureSourceCursor;
  return (
    typeof source.address === "string" &&
    source.address.length >= 32 &&
    source.address.length <= 64 &&
    (source.before === undefined ||
      (typeof source.before === "string" && source.before.length <= 128)) &&
    (source.done === undefined || typeof source.done === "boolean")
  );
}

function isPayload(value: unknown): value is ScannerCursorPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as ScannerCursorPayload;
  return (
    payload.version === CURSOR_VERSION &&
    typeof payload.wallet === "string" &&
    (payload.mode === "token" || payload.mode === "creator") &&
    Number.isInteger(payload.pageIndex) &&
    payload.pageIndex > 0 &&
    Array.isArray(payload.sources) &&
    payload.sources.length > 0 &&
    payload.sources.every(isSource)
  );
}

export function createScannerCursor(
  payload: Omit<ScannerCursorPayload, "version">
): string {
  const body = encode(JSON.stringify({ ...payload, version: CURSOR_VERSION }));
  return `${body}.${signatureFor(body)}`;
}

export function parseScannerCursor(
  cursor: string,
  expected: {
    wallet: string;
    targetMint?: string;
    mode: LeviScanMode;
  }
): ScannerCursorPayload {
  const [body, signature] = cursor.split(".");
  if (!body || !signature) throw new InvalidScannerCursorError();

  const expectedSignature = signatureFor(body);
  const actualBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expectedSignature);
  if (
    actualBytes.length !== expectedBytes.length ||
    !timingSafeEqual(actualBytes, expectedBytes)
  ) {
    throw new InvalidScannerCursorError();
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    throw new InvalidScannerCursorError();
  }
  if (!isPayload(payload)) throw new InvalidScannerCursorError();
  if (
    payload.wallet !== expected.wallet ||
    payload.mode !== expected.mode ||
    (payload.targetMint || undefined) !== (expected.targetMint || undefined)
  ) {
    throw new InvalidScannerCursorError(
      "The scanner cursor does not match this wallet and token."
    );
  }
  return payload;
}
