import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createBurnCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import type { InjectedSolanaProvider } from "@/hooks/useInjectedSolanaWallet";
import {
  LEVI_AI_MINT_ADDRESS,
} from "@/lib/levi/communityBurn";
import { LEVI_AI_DECIMALS } from "@/lib/levi/burnTracker/constants";
import type {
  LeviBurnSigningContext,
  LeviBurnSubmission,
  LeviBurnTokenAccount,
} from "@/types/leviBurn";

export class LeviBurnClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeviBurnClientError";
  }
}

interface BurnAllocation {
  account: PublicKey;
  amountRaw: bigint;
}

function allocateBurnAcrossAccounts(
  accounts: LeviBurnTokenAccount[],
  amountRaw: bigint
): BurnAllocation[] {
  let remaining = amountRaw;
  const allocations: BurnAllocation[] = [];

  for (const account of accounts) {
    if (remaining <= BigInt(0)) break;
    const available = BigInt(account.amountRaw);
    if (available <= BigInt(0)) continue;

    const allocation = available < remaining ? available : remaining;
    allocations.push({ account: new PublicKey(account.address), amountRaw: allocation });
    remaining -= allocation;
  }

  if (remaining > BigInt(0)) {
    throw new LeviBurnClientError("The requested burn amount exceeds your LEVI AI balance.");
  }

  return allocations;
}

function getSignature(result: string | { signature: string }): string {
  return typeof result === "string" ? result : result.signature;
}

export function createLeviBurnTransaction(input: {
  wallet: string;
  tokenAccounts: LeviBurnTokenAccount[];
  amountRaw: bigint;
  blockhash: string;
}): Transaction {
  const owner = new PublicKey(input.wallet);
  const mint = new PublicKey(LEVI_AI_MINT_ADDRESS);
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
        LEVI_AI_DECIMALS,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  return transaction;
}

export async function submitLeviBurn(input: {
  provider: InjectedSolanaProvider;
  wallet: string;
  tokenAccounts: LeviBurnTokenAccount[];
  amountRaw: bigint;
  signingContext: LeviBurnSigningContext;
}): Promise<LeviBurnSubmission> {
  if (!input.provider.signAndSendTransaction) {
    throw new LeviBurnClientError(
      "This wallet must support sign-and-send to submit a LEVI AI burn."
    );
  }

  const transaction = createLeviBurnTransaction({
    wallet: input.wallet,
    tokenAccounts: input.tokenAccounts,
    amountRaw: input.amountRaw,
    blockhash: input.signingContext.blockhash,
  });
  const signature = getSignature(
    await input.provider.signAndSendTransaction(transaction)
  );

  return {
    signature,
    solscanUrl: `https://solscan.io/tx/${signature}`,
    amountRaw: input.amountRaw.toString(),
    state: "submitted",
  };
}
