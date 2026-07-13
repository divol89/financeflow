import {
  NATIVE_MINT,
  NATIVE_MINT_2022,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { solanaRpc } from "@/lib/levi/rpc";
import { normalizeSolanaAddress } from "@/lib/levi/wallet";
import { LEVI_AI_MINT_ADDRESS } from "@/lib/levi/communityBurn";
import { LEVI_AI_DECIMALS, LEVI_AI_SYMBOL } from "@/lib/levi/burnTracker/constants";
import {
  EXTERNAL_BURN_THRESHOLD_RAW,
  MAX_BURN_SOURCE_ACCOUNTS,
  MAX_BURN_TOKEN_OPTIONS,
  getBurnTokenProgram,
  isLeviAiMint,
} from "./constants";
import { resolveBurnTokenMetadata } from "./metadata";
import type {
  BurnTokenOption,
  BurnWalletInventory,
} from "@/types/leviBurn";

interface ParsedTokenAccountResponse {
  value: Array<{
    pubkey?: string;
    account?: {
      owner?: string;
      data?: {
        parsed?: {
          info?: {
            mint?: string;
            isNative?: boolean;
            state?: string;
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

interface SolBalanceResponse {
  value: number;
}

export interface BurnSourceAccount {
  address: string;
  amountRaw: string;
}

export interface BurnTokenRecord extends BurnTokenOption {
  sources: BurnSourceAccount[];
  totalBalanceRaw: string;
}

export interface BurnWalletState {
  inventory: BurnWalletInventory;
  records: BurnTokenRecord[];
}

interface MutableTokenRecord {
  mint: string;
  programId: string;
  decimals: number;
  totalBalanceRaw: bigint;
  sources: Array<{ address: string; amountRaw: bigint }>;
  hasFrozenBalance: boolean;
  isNative: boolean;
}

const BURN_INVENTORY_RPC_POLICY = {
  maxAttempts: 2,
  requestTimeoutMs: 8_000,
  deadlineMs: 15_000,
} as const;

function compareTokenValue(a: BurnTokenRecord, b: BurnTokenRecord): number {
  if (a.isLeviAi !== b.isLeviAi) return a.isLeviAi ? -1 : 1;
  const aNormalized = BigInt(a.availableRaw) * BigInt(`1${"0".repeat(b.decimals)}`);
  const bNormalized = BigInt(b.availableRaw) * BigInt(`1${"0".repeat(a.decimals)}`);
  if (aNormalized === bNormalized) return a.mint.localeCompare(b.mint);
  return aNormalized > bNormalized ? -1 : 1;
}

function collectTokenAccounts(
  groups: Map<string, MutableTokenRecord>,
  response: ParsedTokenAccountResponse,
  fallbackProgramId: string
): void {
  for (const item of response.value) {
    const info = item.account?.data?.parsed?.info;
    const mint = info?.mint;
    const address = item.pubkey;
    const amountRaw = info?.tokenAmount?.amount;
    const decimals = info?.tokenAmount?.decimals;
    const programId = item.account?.owner || fallbackProgramId;
    if (
      !mint ||
      !address ||
      typeof amountRaw !== "string" ||
      typeof decimals !== "number" ||
      !getBurnTokenProgram(programId)
    ) {
      continue;
    }

    const amount = BigInt(amountRaw);
    if (amount <= BigInt(0)) continue;
    const key = `${programId}:${mint}`;
    const current = groups.get(key) || {
      mint,
      programId,
      decimals,
      totalBalanceRaw: BigInt(0),
      sources: [],
      hasFrozenBalance: false,
      isNative:
        mint === NATIVE_MINT.toBase58() || mint === NATIVE_MINT_2022.toBase58(),
    };

    current.totalBalanceRaw += amount;
    current.hasFrozenBalance ||= info?.state === "frozen";
    if (info?.state === "initialized" && !info.isNative && !current.isNative) {
      current.sources.push({ address, amountRaw: amount });
    }
    groups.set(key, current);
  }
}

function toBurnTokenRecord(record: MutableTokenRecord): BurnTokenRecord {
  const program = getBurnTokenProgram(record.programId);
  if (!program) throw new Error("Unsupported Solana token program.");

  const sources = [...record.sources]
    .sort((a, b) => (a.amountRaw === b.amountRaw ? 0 : a.amountRaw > b.amountRaw ? -1 : 1))
    .slice(0, MAX_BURN_SOURCE_ACCOUNTS);
  const availableRaw = sources.reduce(
    (total, source) => total + source.amountRaw,
    BigInt(0)
  );
  const isLeviAi = isLeviAiMint(record.mint);
  const blockedReason = record.isNative
    ? "Native SOL and wrapped native accounts cannot be burned. Close the account instead."
    : availableRaw <= BigInt(0)
      ? record.hasFrozenBalance
        ? "This token balance is frozen and cannot be burned by the holder."
        : "No initialized token account is available to burn."
      : null;

  return {
    mint: record.mint,
    name: isLeviAi ? "The White Bull Agent" : null,
    symbol: isLeviAi ? LEVI_AI_SYMBOL : null,
    program,
    programId: record.programId,
    decimals: record.decimals,
    availableRaw: availableRaw.toString(),
    totalBalanceRaw: record.totalBalanceRaw.toString(),
    accountCount: sources.length,
    isLeviAi,
    burnable: !blockedReason,
    blockedReason,
    warning:
      record.decimals === 0
        ? "Zero-decimal asset: verify that this is not an NFT before burning."
        : null,
    sources: sources.map((source) => ({
      address: source.address,
      amountRaw: source.amountRaw.toString(),
    })),
  };
}

function toPublicTokenOption(record: BurnTokenRecord): BurnTokenOption {
  return {
    mint: record.mint,
    name: record.name,
    symbol: record.symbol,
    program: record.program,
    programId: record.programId,
    decimals: record.decimals,
    availableRaw: record.availableRaw,
    accountCount: record.accountCount,
    isLeviAi: record.isLeviAi,
    burnable: record.burnable,
    blockedReason: record.blockedReason,
    warning: record.warning,
  };
}

export async function loadBurnWalletState(
  inputWallet: string
): Promise<BurnWalletState> {
  const wallet = normalizeSolanaAddress(inputWallet);
  const [legacyAccounts, token2022Accounts, solBalance] = await Promise.all([
    solanaRpc<ParsedTokenAccountResponse>(
      "getTokenAccountsByOwner",
      [
        wallet,
        { programId: TOKEN_PROGRAM_ID.toBase58() },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ],
      BURN_INVENTORY_RPC_POLICY
    ),
    solanaRpc<ParsedTokenAccountResponse>(
      "getTokenAccountsByOwner",
      [
        wallet,
        { programId: TOKEN_2022_PROGRAM_ID.toBase58() },
        { encoding: "jsonParsed", commitment: "confirmed" },
      ],
      BURN_INVENTORY_RPC_POLICY
    ),
    solanaRpc<SolBalanceResponse>(
      "getBalance",
      [wallet, { commitment: "confirmed" }],
      BURN_INVENTORY_RPC_POLICY
    ),
  ]);

  const groups = new Map<string, MutableTokenRecord>();
  collectTokenAccounts(groups, legacyAccounts, TOKEN_PROGRAM_ID.toBase58());
  collectTokenAccounts(groups, token2022Accounts, TOKEN_2022_PROGRAM_ID.toBase58());
  const records = [...groups.values()].map(toBurnTokenRecord).sort(compareTokenValue);
  const leviAiBalanceRaw = records
    .filter((record) => record.mint === LEVI_AI_MINT_ADDRESS)
    .reduce((total, record) => total + BigInt(record.totalBalanceRaw), BigInt(0));
  const visibleRecords = records.slice(0, MAX_BURN_TOKEN_OPTIONS);

  return {
    inventory: {
      wallet,
      tokens: visibleRecords.map(toPublicTokenOption),
      totalTokenCount: records.length,
      truncated: records.length > visibleRecords.length,
      solBalanceLamports: String(solBalance.value),
      leviAiBalanceRaw: leviAiBalanceRaw.toString(),
      leviAiDecimals: LEVI_AI_DECIMALS,
      externalBurnThresholdRaw: EXTERNAL_BURN_THRESHOLD_RAW,
      externalBurnEligible:
        leviAiBalanceRaw >= BigInt(EXTERNAL_BURN_THRESHOLD_RAW),
    },
    records,
  };
}

export async function getBurnWalletInventory(
  wallet: string
): Promise<BurnWalletInventory> {
  const { inventory } = await loadBurnWalletState(wallet);
  const metadata = await resolveBurnTokenMetadata(
    inventory.tokens.map((token) => ({
      mint: token.mint,
      programId: token.programId,
    }))
  );

  return {
    ...inventory,
    tokens: inventory.tokens.map((token) => {
      if (token.isLeviAi) return token;
      const identity = metadata.get(token.mint);
      return identity
        ? {
            ...token,
            name: identity.name,
            symbol: identity.symbol,
          }
        : token;
    }),
  };
}
