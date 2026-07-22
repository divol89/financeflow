import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import bs58 from "bs58";
import nacl from "tweetnacl";
import type { LeviSession } from "@/types/levi";
import {
  NONCE_COOKIE,
  NONCE_TTL_MS,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "./constants";
import { clearCookie, parseCookies, setCookie } from "./http";
import { normalizeSolanaAddress } from "./wallet";

interface NoncePayload {
  wallet: string;
  nonce: string;
  message: string;
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  return "local-development-levi-session-secret";
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromBase64url(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64");
}

function signPayload(payload: unknown): string {
  const body = base64url(JSON.stringify(payload));
  const signature = createHmac("sha256", getSessionSecret())
    .update(body)
    .digest();
  return `${body}.${base64url(signature)}`;
}

function verifyPayload<T>(token: string): T | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = base64url(
    createHmac("sha256", getSessionSecret()).update(body).digest()
  );
  if (signature.length !== expected.length) return null;

  const valid = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
  if (!valid) return null;

  return JSON.parse(fromBase64url(body).toString("utf8")) as T;
}

export function buildSignInMessage(
  wallet: string,
  nonce: string,
  expiresAt: number
): string {
  return [
    "flow-finance.xyz wants you to sign in with your Solana wallet:",
    wallet,
    "",
    "Purpose: Flow-Finance Adventures wallet access.",
    `Nonce: ${nonce}`,
    `Expires: ${new Date(expiresAt).toISOString()}`,
  ].join("\n");
}

export function createNonce(walletInput: string): NoncePayload {
  const wallet = normalizeSolanaAddress(walletInput);
  const nonce = randomBytes(16).toString("hex");
  const expiresAt = Date.now() + NONCE_TTL_MS;
  return {
    wallet,
    nonce,
    expiresAt,
    message: buildSignInMessage(wallet, nonce, expiresAt),
  };
}

export function setNonceCookie(res: NextApiResponse, payload: NoncePayload) {
  setCookie(res, NONCE_COOKIE, signPayload(payload), NONCE_TTL_MS / 1000);
}

export function getNonceFromRequest(req: NextApiRequest): NoncePayload | null {
  const token = parseCookies(req)[NONCE_COOKIE];
  if (!token) return null;

  let payload: NoncePayload | null = null;
  try {
    payload = verifyPayload<NoncePayload>(token);
  } catch {
    return null;
  }
  if (!payload || payload.expiresAt <= Date.now()) return null;
  return payload;
}

export function verifySolanaSignature(
  walletInput: string,
  message: string,
  signatureBase58: string
): boolean {
  const wallet = normalizeSolanaAddress(walletInput);
  const publicKeyBytes = bs58.decode(wallet);
  const signatureBytes = bs58.decode(signatureBase58);
  const messageBytes = new TextEncoder().encode(message);
  return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
}

export function setSessionCookie(res: NextApiResponse, walletInput: string) {
  const wallet = normalizeSolanaAddress(walletInput);
  const now = Date.now();
  const session: LeviSession = {
    wallet,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  setCookie(res, SESSION_COOKIE, signPayload(session), SESSION_TTL_MS / 1000);
}

export function getSessionFromRequest(req: NextApiRequest): LeviSession | null {
  const token = parseCookies(req)[SESSION_COOKIE];
  if (!token) return null;

  let session: LeviSession | null = null;
  try {
    session = verifyPayload<LeviSession>(token);
  } catch {
    return null;
  }
  if (!session || session.expiresAt <= Date.now()) return null;
  return session;
}

export function clearAuthCookies(res: NextApiResponse) {
  clearCookie(res, SESSION_COOKIE);
  clearCookie(res, NONCE_COOKIE);
}
