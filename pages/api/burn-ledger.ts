import type { NextApiRequest, NextApiResponse } from "next";
import { getClientKey } from "@/lib/levi/http";
import { checkRateLimit } from "@/lib/levi/rateLimit";
import { isValidSolanaAddress } from "@/lib/levi/wallet";
import {
  BurnLedgerVerificationError,
  getBurnLedgerPayload,
  verifyAndRecordPortalBurn,
} from "@/lib/burnLedger/service";
import type { BurnLedgerPayload } from "@/types/burnLedger";

const SIGNATURE_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{64,128}$/;

function readBody(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const value = body as Record<string, unknown>;
  if (
    typeof value.signature !== "string" ||
    typeof value.mint !== "string" ||
    typeof value.wallet !== "string"
  ) {
    return null;
  }
  return { signature: value.signature, mint: value.mint, wallet: value.wallet };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BurnLedgerPayload | { error: string }>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (req.method === "GET") {
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=30, stale-while-revalidate=120"
      );
      return res.status(200).json(await getBurnLedgerPayload());
    }

    res.setHeader("Cache-Control", "no-store, max-age=0");
    const limit = checkRateLimit(`burn-ledger:${getClientKey(req)}`, 12, 60_000);
    if (!limit.allowed) {
      return res.status(429).json({ error: "Too many burn ledger updates" });
    }

    const body = readBody(req.body);
    if (
      !body ||
      !SIGNATURE_PATTERN.test(body.signature) ||
      !isValidSolanaAddress(body.mint) ||
      !isValidSolanaAddress(body.wallet)
    ) {
      return res.status(400).json({
        error: "A valid signature, mint and wallet are required.",
      });
    }

    return res.status(200).json(await verifyAndRecordPortalBurn(body));
  } catch (error) {
    if (error instanceof BurnLedgerVerificationError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Public burn ledger failed", error);
    return res.status(503).json({
      error: "The public burn ledger is temporarily unavailable.",
    });
  }
}
