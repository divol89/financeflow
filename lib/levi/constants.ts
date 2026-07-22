export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

export const MOCK_SOLANA = process.env.MOCK_SOLANA === "1";

export const LEVI_DECIMALS = 6;

export const TOKEN_PROGRAM_ID =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const TOKEN_2022_PROGRAM_ID =
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

export const SESSION_COOKIE = "agent_k9_session";
export const NONCE_COOKIE = "agent_k9_nonce";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12;
export const NONCE_TTL_MS = 1000 * 60 * 5;

export const FULL_SCAN_LIMIT = 100;
export const SCANNER_TRANSACTION_BATCH_SIZE = 6;
export const SCANNER_MAX_TOKEN_ACCOUNT_SOURCES = 6;
