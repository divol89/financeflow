import { PublicKey, Transaction } from "@solana/web3.js";
import { createBurnCheckedInstruction } from "@solana/spl-token";
import { getBurnTokenProgram } from "./constants";
import type { BurnSourceAccount } from "./inventory";

export class BurnTransactionBuildError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BurnTransactionBuildError";
  }
}

interface BurnAllocation {
  account: PublicKey;
  amountRaw: bigint;
}

function allocateBurnAcrossAccounts(
  accounts: BurnSourceAccount[],
  amountRaw: bigint
): BurnAllocation[] {
  let remaining = amountRaw;
  const allocations: BurnAllocation[] = [];
  const seen = new Set<string>();

  for (const account of accounts) {
    if (remaining <= BigInt(0)) break;
    if (seen.has(account.address)) continue;
    seen.add(account.address);
    const available = BigInt(account.amountRaw);
    if (available <= BigInt(0)) continue;

    const allocation = available < remaining ? available : remaining;
    allocations.push({
      account: new PublicKey(account.address),
      amountRaw: allocation,
    });
    remaining -= allocation;
  }

  if (remaining > BigInt(0)) {
    throw new BurnTransactionBuildError(
      "The requested burn amount exceeds the selected token balance."
    );
  }

  return allocations;
}

export function createBurnTransaction(input: {
  wallet: string;
  mint: string;
  programId: string;
  decimals: number;
  tokenAccounts: BurnSourceAccount[];
  amountRaw: bigint;
  blockhash: string;
}): Transaction {
  if (!getBurnTokenProgram(input.programId)) {
    throw new BurnTransactionBuildError(
      "Only the Solana SPL Token and Token-2022 programs are supported."
    );
  }
  if (!Number.isInteger(input.decimals) || input.decimals < 0 || input.decimals > 255) {
    throw new BurnTransactionBuildError("The selected token has invalid decimals.");
  }
  if (input.amountRaw <= BigInt(0)) {
    throw new BurnTransactionBuildError("The burn amount must be greater than zero.");
  }

  const owner = new PublicKey(input.wallet);
  const mint = new PublicKey(input.mint);
  const programId = new PublicKey(input.programId);
  const transaction = new Transaction({
    feePayer: owner,
    recentBlockhash: input.blockhash,
  });

  for (const allocation of allocateBurnAcrossAccounts(
    input.tokenAccounts,
    input.amountRaw
  )) {
    transaction.add(
      createBurnCheckedInstruction(
        allocation.account,
        mint,
        owner,
        allocation.amountRaw,
        input.decimals,
        [],
        programId
      )
    );
  }

  return transaction;
}
