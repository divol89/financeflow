import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createBurnCheckedInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import type { InjectedSolanaProvider } from "@/hooks/useInjectedSolanaWallet";
import {
  LEVI_AI_MINT_ADDRESS,
} from "@/lib/levi/communityBurn";
import { SOLANA_RPC_URL } from "@/lib/levi/constants";
import { LEVI_AI_DECIMALS } from "@/lib/levi/burnTracker/constants";
import type {
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
}): Promise<LeviBurnSubmission> {
  if (!input.provider.signAndSendTransaction && !input.provider.signTransaction) {
    throw new LeviBurnClientError(
      "This wallet does not support signing a Solana burn transaction."
    );
  }

  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  const transaction = createLeviBurnTransaction({
    wallet: input.wallet,
    tokenAccounts: input.tokenAccounts,
    amountRaw: input.amountRaw,
    blockhash: latestBlockhash.blockhash,
  });

  let signature: string;
  if (input.provider.signAndSendTransaction) {
    signature = getSignature(
      await input.provider.signAndSendTransaction(transaction)
    );
  } else if (input.provider.signTransaction) {
    const signedTransaction = await input.provider.signTransaction(transaction);
    signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      maxRetries: 3,
      skipPreflight: false,
    });
  } else {
    throw new LeviBurnClientError("Unable to sign the burn transaction.");
  }

  const confirmation = await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed"
  );
  if (confirmation.value.err) {
    throw new LeviBurnClientError("The burn transaction was not confirmed by Solana.");
  }

  return {
    signature,
    solscanUrl: `https://solscan.io/tx/${signature}`,
    amountRaw: input.amountRaw.toString(),
  };
}
