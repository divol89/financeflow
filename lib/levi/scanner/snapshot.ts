import type { ScannerTokenSnapshot } from "@/types/levi";
import { solanaRpc } from "@/lib/levi/rpc";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { formatRawAmount, percentageOf, rawAmountValue } from "./amounts";

interface ParsedMintInfo {
  decimals?: number;
  supply?: string;
  mintAuthority?: string | null;
  freezeAuthority?: string | null;
  extensions?: Array<{
    extension?: string;
    state?: {
      name?: string;
      symbol?: string;
    };
  }>;
}

interface MintAccountResponse {
  value: {
    owner?: string;
    data?: {
      parsed?: {
        info?: ParsedMintInfo;
      };
    };
  } | null;
}

interface BalanceResponse {
  value: number;
}

interface TokenAccountsResponse {
  value: Array<{
    account?: {
      data?: {
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

function readTokenMetadata(info: ParsedMintInfo): {
  name: string | null;
  symbol: string | null;
} {
  const metadata = info.extensions?.find(
    (extension) => extension.extension === "tokenMetadata"
  )?.state;
  return {
    name: typeof metadata?.name === "string" ? metadata.name.trim() : null,
    symbol: typeof metadata?.symbol === "string" ? metadata.symbol.trim() : null,
  };
}

export async function getScannerTokenSnapshot(
  inputWallet: string,
  inputMint: string
): Promise<ScannerTokenSnapshot> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const mint = normalizeSolanaAddress(inputMint);
  const [mintResult, accountsResult, solResult] = await Promise.allSettled([
    solanaRpc<MintAccountResponse>("getAccountInfo", [
      mint,
      { encoding: "jsonParsed", commitment: "confirmed" },
    ]),
    solanaRpc<TokenAccountsResponse>("getTokenAccountsByOwner", [
      wallet,
      { mint },
      { encoding: "jsonParsed", commitment: "confirmed" },
    ]),
    solanaRpc<BalanceResponse>("getBalance", [wallet, { commitment: "confirmed" }]),
  ]);

  const mintAccount = mintResult.status === "fulfilled" ? mintResult.value.value : null;
  const mintInfo = mintAccount?.data?.parsed?.info || {};
  const accounts =
    accountsResult.status === "fulfilled" ? accountsResult.value.value : [];
  const walletAmount = accounts.reduce(
    (total, item) => {
      const info = item.account?.data?.parsed?.info;
      if (info?.mint !== mint) return total;
      return {
        raw: total.raw + BigInt(info.tokenAmount?.amount || "0"),
        decimals: info.tokenAmount?.decimals ?? total.decimals,
      };
    },
    { raw: BigInt(0), decimals: mintInfo.decimals || 0 }
  );
  const supplyRaw = BigInt(mintInfo.supply || "0");
  const decimals = mintInfo.decimals ?? walletAmount.decimals;
  const metadata = readTokenMetadata(mintInfo);
  const solLamports =
    solResult.status === "fulfilled"
      ? BigInt(Math.trunc(solResult.value.value))
      : null;
  const complete =
    mintResult.status === "fulfilled" &&
    Boolean(mintAccount) &&
    accountsResult.status === "fulfilled" &&
    solResult.status === "fulfilled";

  return {
    mint,
    name: metadata.name,
    symbol: metadata.symbol,
    tokenProgram: mintAccount?.owner || null,
    walletBalance: rawAmountValue(walletAmount.raw, decimals),
    currentSupply: rawAmountValue(supplyRaw, decimals),
    walletSharePercent: percentageOf(walletAmount.raw, supplyRaw),
    walletSolLamports: solLamports?.toString() || null,
    walletSol: solLamports === null ? null : formatRawAmount(solLamports, 9),
    tokenAccountCount: accounts.length,
    mintAuthority:
      typeof mintInfo.mintAuthority === "string" ? mintInfo.mintAuthority : null,
    freezeAuthority:
      typeof mintInfo.freezeAuthority === "string" ? mintInfo.freezeAuthority : null,
    authoritiesRevoked:
      mintResult.status === "fulfilled" &&
      Boolean(mintAccount) &&
      !mintInfo.mintAuthority &&
      !mintInfo.freezeAuthority,
    complete,
  };
}
