import type { AccountInfo } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import {
  ExtensionType,
  getExtensionData,
  TOKEN_2022_PROGRAM_ID,
  unpackMint,
} from "@solana/spl-token";
import { solanaRpc } from "@/lib/levi/rpc";

const METAPLEX_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const MAX_RPC_ACCOUNTS = 100;
const METADATA_CACHE_TTL_MS = 60 * 60 * 1_000;
const MISSING_METADATA_CACHE_TTL_MS = 10 * 60 * 1_000;
const MAX_METADATA_CACHE_ENTRIES = 1_000;
const MAX_METADATA_NAME_LENGTH = 48;
const MAX_METADATA_SYMBOL_LENGTH = 16;
const MAX_ENCODED_STRING_LENGTH = 4_096;

const BURN_METADATA_RPC_POLICY = {
  maxAttempts: 1,
  requestTimeoutMs: 10_000,
  deadlineMs: 16_000,
} as const;

export interface BurnTokenMetadata {
  name: string | null;
  symbol: string | null;
}

export interface BurnMetadataTokenInput {
  mint: string;
  programId: string;
}

interface RpcAccountValue {
  data?: [string, string];
  executable?: boolean;
  lamports?: number;
  owner?: string;
  rentEpoch?: number;
}

interface MultipleAccountsResponse {
  value: Array<RpcAccountValue | null>;
}

interface MetadataLookup {
  mint: string;
  programId: string;
  address: string;
  kind: "metaplex" | "token-2022-mint";
}

interface MetadataCandidate {
  metadata: BurnTokenMetadata;
  priority: number;
}

interface MetadataCacheEntry {
  metadata: BurnTokenMetadata | null;
  expiresAt: number;
}

const metadataCache = new Map<string, MetadataCacheEntry>();

function metadataCacheKey(token: BurnMetadataTokenInput): string {
  return `${token.programId}:${token.mint}`;
}

function truncateMetadataText(value: string, maxLength: number): string {
  const characters = Array.from(value);
  if (characters.length <= maxLength) return value;
  return `${characters.slice(0, Math.max(1, maxLength - 3)).join("")}...`;
}

export function sanitizeBurnMetadataText(
  input: string,
  maxLength: number
): string | null {
  const normalized = input
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  return truncateMetadataText(normalized, maxLength);
}

function readLengthPrefixedString(
  data: Buffer,
  offset: number
): { value: string; nextOffset: number } | null {
  if (offset < 0 || offset + 4 > data.length) return null;
  const length = data.readUInt32LE(offset);
  const start = offset + 4;
  const end = start + length;
  if (length > MAX_ENCODED_STRING_LENGTH || end > data.length) return null;
  return { value: data.subarray(start, end).toString("utf8"), nextOffset: end };
}

function parseMetadataFields(
  data: Buffer,
  expectedMint: PublicKey,
  mintOffset: number,
  fieldsOffset: number
): BurnTokenMetadata | null {
  if (data.length < fieldsOffset + 8) return null;
  if (!data.subarray(mintOffset, mintOffset + 32).equals(expectedMint.toBuffer())) {
    return null;
  }

  const nameField = readLengthPrefixedString(data, fieldsOffset);
  if (!nameField) return null;
  const symbolField = readLengthPrefixedString(data, nameField.nextOffset);
  if (!symbolField) return null;

  const name = sanitizeBurnMetadataText(
    nameField.value,
    MAX_METADATA_NAME_LENGTH
  );
  const symbol = sanitizeBurnMetadataText(
    symbolField.value,
    MAX_METADATA_SYMBOL_LENGTH
  );
  return name || symbol ? { name, symbol } : null;
}

export function parseMetaplexBurnMetadata(
  data: Buffer,
  expectedMint: PublicKey
): BurnTokenMetadata | null {
  return parseMetadataFields(data, expectedMint, 33, 65);
}

export function parseToken2022BurnMetadataExtension(
  data: Buffer,
  expectedMint: PublicKey
): BurnTokenMetadata | null {
  return parseMetadataFields(data, expectedMint, 32, 64);
}

function decodeAccountData(account: RpcAccountValue): Buffer | null {
  const [encoded, encoding] = account.data || [];
  if (!encoded || encoding !== "base64") return null;
  try {
    return Buffer.from(encoded, "base64");
  } catch {
    return null;
  }
}

function parseToken2022MintMetadata(
  lookup: MetadataLookup,
  account: RpcAccountValue,
  data: Buffer
): BurnTokenMetadata | null {
  if (account.owner !== lookup.programId) return null;
  try {
    const mint = new PublicKey(lookup.mint);
    const owner = new PublicKey(account.owner);
    const accountInfo: AccountInfo<Buffer> = {
      data,
      executable: Boolean(account.executable),
      lamports: account.lamports || 0,
      owner,
      rentEpoch: account.rentEpoch || 0,
    };
    const mintInfo = unpackMint(mint, accountInfo, TOKEN_2022_PROGRAM_ID);
    const metadataData = getExtensionData(
      ExtensionType.TokenMetadata,
      mintInfo.tlvData
    );
    return metadataData
      ? parseToken2022BurnMetadataExtension(metadataData, mint)
      : null;
  } catch {
    return null;
  }
}

function parseMetadataLookup(
  lookup: MetadataLookup,
  account: RpcAccountValue | null
): BurnTokenMetadata | null {
  if (!account) return null;
  const data = decodeAccountData(account);
  if (!data) return null;

  if (lookup.kind === "metaplex") {
    if (account.owner !== METAPLEX_METADATA_PROGRAM_ID.toBase58()) return null;
    return parseMetaplexBurnMetadata(data, new PublicKey(lookup.mint));
  }

  return parseToken2022MintMetadata(lookup, account, data);
}

function createMetadataLookups(
  tokens: BurnMetadataTokenInput[]
): MetadataLookup[] {
  const lookups: MetadataLookup[] = [];
  for (const token of tokens) {
    const mint = new PublicKey(token.mint);
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METAPLEX_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      METAPLEX_METADATA_PROGRAM_ID
    );
    lookups.push({
      ...token,
      address: metadataAddress.toBase58(),
      kind: "metaplex",
    });
    if (token.programId === TOKEN_2022_PROGRAM_ID.toBase58()) {
      lookups.push({ ...token, address: token.mint, kind: "token-2022-mint" });
    }
  }
  return lookups;
}

function readCachedMetadata(
  token: BurnMetadataTokenInput,
  now: number
): MetadataCacheEntry | null {
  const key = metadataCacheKey(token);
  const cached = metadataCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= now) {
    metadataCache.delete(key);
    return null;
  }
  return cached;
}

function writeCachedMetadata(
  token: BurnMetadataTokenInput,
  metadata: BurnTokenMetadata | null,
  now: number
): void {
  const key = metadataCacheKey(token);
  metadataCache.delete(key);
  metadataCache.set(key, {
    metadata,
    expiresAt:
      now + (metadata ? METADATA_CACHE_TTL_MS : MISSING_METADATA_CACHE_TTL_MS),
  });

  while (metadataCache.size > MAX_METADATA_CACHE_ENTRIES) {
    const oldestKey = metadataCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    metadataCache.delete(oldestKey);
  }
}

export async function resolveBurnTokenMetadata(
  inputTokens: BurnMetadataTokenInput[],
  now = Date.now()
): Promise<Map<string, BurnTokenMetadata>> {
  const tokens = [
    ...new Map(inputTokens.map((token) => [token.mint, token])).values(),
  ];
  const resolved = new Map<string, BurnTokenMetadata>();
  const unresolved: BurnMetadataTokenInput[] = [];

  for (const token of tokens) {
    const cached = readCachedMetadata(token, now);
    if (!cached) {
      unresolved.push(token);
    } else if (cached.metadata) {
      resolved.set(token.mint, cached.metadata);
    }
  }
  if (unresolved.length === 0) return resolved;

  const lookups = createMetadataLookups(unresolved);
  const expectedAttempts = new Map<string, number>();
  const completedAttempts = new Map<string, number>();
  const candidates = new Map<string, MetadataCandidate>();
  for (const lookup of lookups) {
    expectedAttempts.set(lookup.mint, (expectedAttempts.get(lookup.mint) || 0) + 1);
  }

  for (let offset = 0; offset < lookups.length; offset += MAX_RPC_ACCOUNTS) {
    const chunk = lookups.slice(offset, offset + MAX_RPC_ACCOUNTS);
    let response: MultipleAccountsResponse;
    try {
      response = await solanaRpc<MultipleAccountsResponse>(
        "getMultipleAccounts",
        [
          chunk.map((lookup) => lookup.address),
          { encoding: "base64", commitment: "confirmed" },
        ],
        BURN_METADATA_RPC_POLICY
      );
    } catch {
      continue;
    }
    if (!Array.isArray(response.value)) continue;

    chunk.forEach((lookup, index) => {
      completedAttempts.set(
        lookup.mint,
        (completedAttempts.get(lookup.mint) || 0) + 1
      );
      const metadata = parseMetadataLookup(lookup, response.value[index] || null);
      if (!metadata) return;
      const priority = lookup.kind === "token-2022-mint" ? 2 : 1;
      const current = candidates.get(lookup.mint);
      if (!current || priority > current.priority) {
        candidates.set(lookup.mint, { metadata, priority });
      }
    });
  }

  for (const token of unresolved) {
    const candidate = candidates.get(token.mint)?.metadata || null;
    if (candidate) {
      resolved.set(token.mint, candidate);
      writeCachedMetadata(token, candidate, now);
    } else if (
      completedAttempts.get(token.mint) === expectedAttempts.get(token.mint)
    ) {
      writeCachedMetadata(token, null, now);
    }
  }

  return resolved;
}
