import { SOLANA_RPC_URL } from "./constants";

const MAX_RPC_ATTEMPTS = 3;
const RPC_RETRY_BASE_MS = 700;
const RPC_TIMEOUT_MS = 18_000;
const DEFAULT_PUBLIC_RPC_URLS = [
  "https://solana-rpc.publicnode.com",
  "https://api.mainnet-beta.solana.com",
];

interface RpcResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class SolanaRpcError extends Error {
  method: string;
  status?: number;
  code?: number;

  constructor(
    method: string,
    message: string,
    details: { status?: number; code?: number } = {}
  ) {
    super(message);
    this.name = "SolanaRpcError";
    this.method = method;
    this.status = details.status;
    this.code = details.code;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableRpcStatus(status: number): boolean {
  return [429, 500, 502, 503, 504].includes(status);
}

function isRetryableRpcCode(code?: number): boolean {
  return code === 429 || code === -32005 || code === -32603;
}

export function isSolanaRpcRateLimitError(error: unknown): boolean {
  if (!(error instanceof SolanaRpcError)) return false;
  return (
    error.status === 429 ||
    error.code === 429 ||
    /too many requests|rate limit|429/i.test(error.message)
  );
}

async function waitBeforeRetry(attempt: number): Promise<void> {
  await sleep(RPC_RETRY_BASE_MS * (attempt + 1));
}

export function getSolanaRpcUrls(): string[] {
  const configuredFallbacks = String(process.env.SOLANA_RPC_PROXY_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  return [...new Set([SOLANA_RPC_URL, ...configuredFallbacks, ...DEFAULT_PUBLIC_RPC_URLS])];
}

function shouldRetryRpcError(error: SolanaRpcError): boolean {
  return (
    (typeof error.status === "number" && isRetryableRpcStatus(error.status)) ||
    isRetryableRpcCode(error.code)
  );
}

async function postRpc<T>(
  rpcUrl: string,
  method: string,
  params: unknown[]
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method,
          params,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      throw new SolanaRpcError(
        method,
        error instanceof Error ? error.message : `Solana RPC ${method} network failure`,
        { status: 503 }
      );
    }

    if (!response.ok) {
      throw new SolanaRpcError(
        method,
        `Solana RPC ${method} failed with ${response.status}`,
        { status: response.status }
      );
    }

    const payload = (await response.json()) as RpcResponse<T>;
    if (payload.error) {
      throw new SolanaRpcError(
        method,
        `Solana RPC ${method} error ${payload.error.code}: ${payload.error.message}`,
        { code: payload.error.code }
      );
    }

    return payload.result as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function solanaRpc<T>(
  method: string,
  params: unknown[] = []
): Promise<T> {
  const rpcUrls = getSolanaRpcUrls();
  let lastError: SolanaRpcError | null = null;

  for (let attempt = 0; attempt < MAX_RPC_ATTEMPTS; attempt += 1) {
    let retryableFailure = false;
    for (const rpcUrl of rpcUrls) {
      try {
        return await postRpc<T>(rpcUrl, method, params);
      } catch (error) {
        const rpcError =
          error instanceof SolanaRpcError
            ? error
            : new SolanaRpcError(method, "Solana RPC request failed", { status: 503 });
        lastError = rpcError;
        retryableFailure = retryableFailure || shouldRetryRpcError(rpcError);
      }
    }

    if (!retryableFailure || attempt === MAX_RPC_ATTEMPTS - 1) break;
    await waitBeforeRetry(attempt);
  }

  throw lastError || new SolanaRpcError(method, `Solana RPC ${method} failed`);
}

async function postRpcBatch<T>(
  rpcUrl: string,
  requests: Array<{ method: string; params?: unknown[] }>
): Promise<Array<T | null>> {
  const method = "batch";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          requests.map((request, index) => ({
            jsonrpc: "2.0",
            id: index + 1,
            method: request.method,
            params: request.params || [],
          }))
        ),
        signal: controller.signal,
      });
    } catch (error) {
      throw new SolanaRpcError(
        method,
        error instanceof Error ? error.message : "Solana RPC batch network failure",
        { status: 503 }
      );
    }

    if (!response.ok) {
      throw new SolanaRpcError(
        method,
        `Solana RPC batch failed with ${response.status}`,
        { status: response.status }
      );
    }

    const payload = (await response.json()) as Array<RpcResponse<T>>;
    const rateLimited = payload.find((item) => isRetryableRpcCode(item.error?.code));
    if (rateLimited?.error) {
      throw new SolanaRpcError(
        method,
        `Solana RPC batch error ${rateLimited.error.code}: ${rateLimited.error.message}`,
        { code: rateLimited.error.code }
      );
    }

    return payload.map((item) => (item.error ? null : item.result ?? null));
  } finally {
    clearTimeout(timeout);
  }
}

export async function solanaRpcBatch<T>(
  requests: Array<{ method: string; params?: unknown[] }>
): Promise<Array<T | null>> {
  if (requests.length === 0) return [];
  const method = "batch";
  const rpcUrls = getSolanaRpcUrls();
  let lastError: SolanaRpcError | null = null;

  for (let attempt = 0; attempt < MAX_RPC_ATTEMPTS; attempt += 1) {
    let retryableFailure = false;
    for (const rpcUrl of rpcUrls) {
      try {
        return await postRpcBatch<T>(rpcUrl, requests);
      } catch (error) {
        const rpcError =
          error instanceof SolanaRpcError
            ? error
            : new SolanaRpcError(method, "Solana RPC batch failed", { status: 503 });
        lastError = rpcError;
        retryableFailure = retryableFailure || shouldRetryRpcError(rpcError);
      }
    }

    if (!retryableFailure || attempt === MAX_RPC_ATTEMPTS - 1) break;
    await waitBeforeRetry(attempt);
  }

  throw lastError || new SolanaRpcError(method, "Solana RPC batch failed");
}
