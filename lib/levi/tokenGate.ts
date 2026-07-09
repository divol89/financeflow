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

async function fetchLeviBalanceRaw(
  wallet: string
): Promise<{ raw: bigint; decimals: number }> {
  const result = await solanaRpc<TokenAccountsResponse>(
    "getTokenAccountsByOwner",
    [
      wallet,
      { mint: LEVI_MINT_ADDRESS },
      {
        encoding: "jsonParsed",
      },
    ]
  );

  return result.value.reduce(
    (acc, item) => {
      const info = item.account.data.parsed?.info;
      if (info?.mint !== LEVI_MINT_ADDRESS) return acc;

      const amount = BigInt(info.tokenAmount?.amount || "0");
      return {
        raw: acc.raw + amount,
        decimals: info.tokenAmount?.decimals ?? acc.decimals,
      };
    },
    { raw: BigInt(0), decimals: LEVI_DECIMALS }
  );
}

export async function getLeviAccessForWallet(
  inputWallet: string
): Promise<LeviAccessState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const { raw: balanceRaw, decimals } = await fetchLeviBalanceRaw(wallet);
  const balance = uiTokenAmount(balanceRaw, decimals);
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
