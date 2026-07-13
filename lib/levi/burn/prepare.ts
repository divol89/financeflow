import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { getLeviBurnSigningContext } from "./transaction";
import { loadBurnWalletState } from "./inventory";
import { createBurnTransaction } from "./transactionFactory";
import { EXTERNAL_BURN_THRESHOLD_RAW, isLeviAiMint } from "./constants";
import type { BurnPreparation } from "@/types/leviBurn";

const RAW_TOKEN_AMOUNT_PATTERN = /^[1-9]\d*$/;

export class BurnPreparationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BurnPreparationError";
    this.status = status;
  }
}

export async function prepareBurnTransaction(input: {
  wallet: string;
  mint: string;
  amountRaw: string;
  sessionWallet: string | null;
}): Promise<BurnPreparation> {
  const wallet = normalizeSolanaAddress(input.wallet);
  const mint = normalizeSolanaAddress(input.mint);
  if (!RAW_TOKEN_AMOUNT_PATTERN.test(input.amountRaw)) {
    throw new BurnPreparationError("A valid burn amount is required.");
  }

  const isLeviAi = isLeviAiMint(mint);
  if (!isLeviAi) {
    if (!input.sessionWallet) {
      throw new BurnPreparationError(
        "Sign access to verify the 1,000,000 LEVI AI holder requirement.",
        401
      );
    }
    if (normalizeSolanaAddress(input.sessionWallet) !== wallet) {
      throw new BurnPreparationError(
        "The signed session must match the connected wallet.",
        403
      );
    }
  }

  const state = await loadBurnWalletState(wallet);
  const token = state.records.find((record) => record.mint === mint);
  if (!token) {
    throw new BurnPreparationError(
      "The connected wallet does not hold this token.",
      404
    );
  }
  if (!token.burnable) {
    throw new BurnPreparationError(
      token.blockedReason || "This token balance cannot be burned."
    );
  }
  if (
    !isLeviAi &&
    BigInt(state.inventory.leviAiBalanceRaw) < BigInt(EXTERNAL_BURN_THRESHOLD_RAW)
  ) {
    throw new BurnPreparationError(
      "Hold at least 1,000,000 LEVI AI to burn another Solana token.",
      403
    );
  }

  const amountRaw = BigInt(input.amountRaw);
  if (amountRaw > BigInt(token.availableRaw)) {
    throw new BurnPreparationError(
      "The requested burn amount exceeds the selected token balance."
    );
  }

  const signingContext = await getLeviBurnSigningContext();
  const transaction = createBurnTransaction({
    wallet,
    mint,
    programId: token.programId,
    decimals: token.decimals,
    tokenAccounts: token.sources,
    amountRaw,
    blockhash: signingContext.blockhash,
  });
  const transactionBase64 = transaction
    .serialize({ requireAllSignatures: false, verifySignatures: false })
    .toString("base64");

  return {
    wallet,
    mint,
    amountRaw: amountRaw.toString(),
    decimals: token.decimals,
    symbol: token.symbol,
    programId: token.programId,
    isLeviAi,
    transactionBase64,
  };
}
