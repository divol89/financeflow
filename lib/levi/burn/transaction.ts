import { solanaRpc } from "@/lib/levi/rpc";
import type {
  LeviBurnSigningContext,
  LeviBurnTransactionStatus,
} from "@/types/leviBurn";

interface LatestBlockhashResponse {
  value: {
    blockhash: string;
  };
}

interface SignatureStatusRecord {
  err: unknown;
  confirmationStatus?: "processed" | "confirmed" | "finalized" | null;
}

interface SignatureStatusesResponse {
  value: Array<SignatureStatusRecord | null>;
}

export async function getLeviBurnSigningContext(): Promise<LeviBurnSigningContext> {
  const result = await solanaRpc<LatestBlockhashResponse>("getLatestBlockhash", [
    { commitment: "confirmed" },
  ]);

  return { blockhash: result.value.blockhash };
}

export function classifyLeviBurnTransactionStatus(
  signature: string,
  record: SignatureStatusRecord | null | undefined
): LeviBurnTransactionStatus {
  if (!record) return { signature, state: "pending" };
  if (record.err) return { signature, state: "failed" };
  if (
    record.confirmationStatus === "confirmed" ||
    record.confirmationStatus === "finalized"
  ) {
    return { signature, state: "confirmed" };
  }

  return { signature, state: "pending" };
}

export async function getLeviBurnTransactionStatus(
  signature: string
): Promise<LeviBurnTransactionStatus> {
  const result = await solanaRpc<SignatureStatusesResponse>("getSignatureStatuses", [
    [signature],
    { searchTransactionHistory: true },
  ]);

  return classifyLeviBurnTransactionStatus(signature, result.value[0]);
}
