import type { LeviAccessState } from "@/types/levi";
import { LEVI_DECIMALS, LEVI_MINT_ADDRESS } from "./constants";
import { getAccessLimits, getAccessReason, getAccessTier, uiTokenAmount } from "./access";
import { solanaRpc } from "./rpc";
import { normalizeSolanaAddress } from "./wallet";

interface TokenAccountsResponse {
  value: Array<{
    account: {
      data: {
        parsed?: {
          info?: {
            mint?: string;
            tokenAmount?: {
              amount?: string;
              decimals?: number;
            };
          };
        };
      };
    };
  }>;
}

export interface TokenBalance {
  mint: string;
  raw: bigint;
  decimals: number;
  balance: number;
}

export async function getTokenBalanceForMint(
  inputWallet: string,
  inputMint: string
): Promise<TokenBalance> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const mint = normalizeSolanaAddress(inputMint);
  const result = await solanaRpc<TokenAccountsResponse>(
    "getTokenAccountsByOwner",
    [
      wallet,
      { mint },
      {
        encoding: "jsonParsed",
      },
    ]
  );

  const tokenAmount = result.value.reduce(
    (acc, item) => {
      const info = item.account.data.parsed?.info;
      if (info?.mint !== mint) return acc;

      const amount = BigInt(info.tokenAmount?.amount || "0");
      return {
        raw: acc.raw + amount,
        decimals: info.tokenAmount?.decimals ?? acc.decimals,
      };
    },
    { raw: BigInt(0), decimals: LEVI_DECIMALS }
  );

  return {
    mint,
    ...tokenAmount,
    balance: uiTokenAmount(tokenAmount.raw, tokenAmount.decimals),
  };
}

export async function getLeviAccessForWallet(
  inputWallet: string
): Promise<LeviAccessState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const tokenBalance = await getTokenBalanceForMint(wallet, LEVI_MINT_ADDRESS);
  const { raw: balanceRaw, decimals, balance } = tokenBalance;
  const tier = getAccessTier(balance);

  return {
    wallet,
    mint: LEVI_MINT_ADDRESS,
    balance,
    balanceRaw: balanceRaw.toString(),
    decimals,
    tier,
    limits: getAccessLimits(tier),
    checkedAt: new Date().toISOString(),
    reason: getAccessReason(tier),
  };
}
