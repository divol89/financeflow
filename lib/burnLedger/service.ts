import { resolveBurnTokenMetadata } from "@/lib/levi/burn/metadata";
import type { BurnLedgerEvent, BurnLedgerPayload } from "@/types/burnLedger";
import {
  SOLSCAN_TOKEN_BASE_URL,
  SOLSCAN_TRANSACTION_BASE_URL,
} from "./constants";
import { fetchVerifiedPortalBurn } from "./chain";
import { readBurnLedger, saveBurnLedgerEvent } from "./store";

export class BurnLedgerVerificationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BurnLedgerVerificationError";
    this.status = status;
  }
}

export async function getBurnLedgerPayload(): Promise<BurnLedgerPayload> {
  const ledger = await readBurnLedger();
  return {
    version: 1,
    scope: "flow-finance-portal",
    ...ledger,
    updatedAt: new Date().toISOString(),
  };
}

export async function verifyAndRecordPortalBurn(input: {
  signature: string;
  mint: string;
  wallet: string;
}): Promise<BurnLedgerPayload> {
  const verified = await fetchVerifiedPortalBurn(input);
  if (!verified) {
    throw new BurnLedgerVerificationError(
      "The transaction is not a finalized token burn for this wallet and mint."
    );
  }

  const metadata = await resolveBurnTokenMetadata([
    { mint: verified.mint, programId: verified.programId },
  ]);
  const identity = metadata.get(verified.mint);
  const event: BurnLedgerEvent = {
    signature: input.signature,
    ...verified,
    name: identity?.name || null,
    symbol: identity?.symbol || null,
    solscanUrl: `${SOLSCAN_TRANSACTION_BASE_URL}/${input.signature}`,
    tokenUrl: `${SOLSCAN_TOKEN_BASE_URL}/${verified.mint}`,
  };

  await saveBurnLedgerEvent(event);
  return getBurnLedgerPayload();
}
