import { PublicKey, Transaction } from "@solana/web3.js";
import type { InjectedSolanaProvider } from "@/lib/levi/solanaWallet";
import { getBurnTokenProgram } from "./constants";
import type {
  BurnPreparation,
  LeviBurnSubmission,
} from "@/types/leviBurn";

export class BurnClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BurnClientError";
  }
}

function decodeBase64(value: string): Uint8Array {
  const decoded = globalThis.atob(value);
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function getSignature(result: string | { signature: string }): string {
  return typeof result === "string" ? result : result.signature;
}

export function parseAndValidatePreparedBurn(
  preparation: BurnPreparation
): Transaction {
  if (!getBurnTokenProgram(preparation.programId)) {
    throw new BurnClientError("The prepared token program is not supported.");
  }

  let transaction: Transaction;
  try {
    transaction = Transaction.from(decodeBase64(preparation.transactionBase64));
  } catch {
    throw new BurnClientError("The prepared burn transaction is invalid.");
  }

  const expectedWallet = new PublicKey(preparation.wallet).toBase58();
  const expectedMint = new PublicKey(preparation.mint).toBase58();
  if (transaction.feePayer?.toBase58() !== expectedWallet) {
    throw new BurnClientError("The prepared fee payer does not match your wallet.");
  }
  if (!transaction.recentBlockhash || transaction.instructions.length === 0) {
    throw new BurnClientError("The prepared burn transaction is incomplete.");
  }

  let totalAmountRaw = BigInt(0);
  for (const instruction of transaction.instructions) {
    if (
      instruction.programId.toBase58() !== preparation.programId ||
      instruction.data.length !== 10 ||
      instruction.data[0] !== 15 ||
      instruction.data[9] !== preparation.decimals ||
      instruction.keys.length < 3 ||
      instruction.keys[1].pubkey.toBase58() !== expectedMint ||
      instruction.keys[2].pubkey.toBase58() !== expectedWallet ||
      !instruction.keys[2].isSigner
    ) {
      throw new BurnClientError(
        "The prepared transaction contains an unexpected instruction."
      );
    }
    totalAmountRaw += instruction.data.readBigUInt64LE(1);
  }
  if (totalAmountRaw !== BigInt(preparation.amountRaw)) {
    throw new BurnClientError("The prepared burn amount does not match your request.");
  }

  return transaction;
}

export async function submitPreparedBurn(input: {
  provider: InjectedSolanaProvider;
  preparation: BurnPreparation;
}): Promise<LeviBurnSubmission> {
  if (!input.provider.signAndSendTransaction) {
    throw new BurnClientError(
      "This wallet must support sign-and-send to submit a token burn."
    );
  }

  const transaction = parseAndValidatePreparedBurn(input.preparation);
  const signature = getSignature(
    await input.provider.signAndSendTransaction(transaction)
  );

  return {
    signature,
    solscanUrl: `https://solscan.io/tx/${signature}`,
    mint: input.preparation.mint,
    symbol: input.preparation.symbol,
    decimals: input.preparation.decimals,
    amountRaw: input.preparation.amountRaw,
    isLeviAi: input.preparation.isLeviAi,
    state: "submitted",
  };
}
