import type { ScannerTokenSnapshot } from "@/types/levi";
import { solanaRpc, type SolanaRpcRequestOptions } from "@/lib/levi/rpc";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { PublicKey } from "@solana/web3.js";
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
    pubkey?: string;
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

export interface ScannerTokenContext {
  snapshot: ScannerTokenSnapshot;
  tokenAccounts: string[];
  accountDiscoveryComplete: boolean;
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

export async function getScannerTokenContext(
  inputWallet: string,
  inputMint: string,
  rpcOptions?: SolanaRpcRequestOptions
): Promise<ScannerTokenContext> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const mint = normalizeSolanaAddress(inputMint);
  const [mintResult, accountsResult, solResult] = await Promise.allSettled([
    solanaRpc<MintAccountResponse>(
      "getAccountInfo",
      [mint, { encoding: "jsonParsed", commitment: "confirmed" }],
      rpcOptions
    ),
    solanaRpc<TokenAccountsResponse>(
      "getTokenAccountsByOwner",
      [wallet, { mint }, { encoding: "jsonParsed", commitment: "confirmed" }],
      rpcOptions
    ),
    solanaRpc<BalanceResponse>(
      "getBalance",
      [wallet, { commitment: "confirmed" }],
      rpcOptions
    ),
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
    snapshot: {
      mint,
      addressKind: PublicKey.isOnCurve(new PublicKey(wallet).toBytes())
        ? "signer-wallet"
        : "programmatic-address",
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
    },
    tokenAccounts: accounts
      .map((item) => item.pubkey)
      .filter((pubkey): pubkey is string => Boolean(pubkey)),
    accountDiscoveryComplete: accountsResult.status === "fulfilled",
  };
}

export async function getScannerTokenSnapshot(
  inputWallet: string,
  inputMint: string,
  rpcOptions?: SolanaRpcRequestOptions
): Promise<ScannerTokenSnapshot> {
  return (
    await getScannerTokenContext(inputWallet, inputMint, rpcOptions)
  ).snapshot;
}
