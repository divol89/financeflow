import { SOLANA_RPC_URL } from "./constants";

const MAX_RPC_ATTEMPTS = 3;
const RPC_RETRY_BASE_MS = 700;

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
  return status === 429 || status === 503 || status === 504;
}

function isRetryableRpcCode(code?: number): boolean {
  return code === 429 || code === -32005;
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

export async function solanaRpc<T>(
  method: string,
  params: unknown[] = []
): Promise<T> {
  for (let attempt = 0; attempt < MAX_RPC_ATTEMPTS; attempt += 1) {
    const response = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params,
      }),
    });

    if (!response.ok) {
      if (
        attempt < MAX_RPC_ATTEMPTS - 1 &&
        isRetryableRpcStatus(response.status)
      ) {
        await waitBeforeRetry(attempt);
        continue;
      }

      throw new SolanaRpcError(
        method,
        `Solana RPC ${method} failed with ${response.status}`,
        { status: response.status }
      );
    }

    const payload = (await response.json()) as RpcResponse<T>;
    if (payload.error) {
      if (
        attempt < MAX_RPC_ATTEMPTS - 1 &&
        isRetryableRpcCode(payload.error.code)
      ) {
        await waitBeforeRetry(attempt);
        continue;
      }

      throw new SolanaRpcError(
        method,
        `Solana RPC ${method} error ${payload.error.code}: ${payload.error.message}`,
        { code: payload.error.code }
      );
    }

    return payload.result as T;
  }

  throw new SolanaRpcError(method, `Solana RPC ${method} failed`);
}

export async function solanaRpcBatch<T>(
  requests: Array<{ method: string; params?: unknown[] }>
): Promise<Array<T | null>> {
  if (requests.length === 0) return [];
  const method = "batch";

  for (let attempt = 0; attempt < MAX_RPC_ATTEMPTS; attempt += 1) {
    const response = await fetch(SOLANA_RPC_URL, {
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
    });

    if (!response.ok) {
      if (
        attempt < MAX_RPC_ATTEMPTS - 1 &&
        isRetryableRpcStatus(response.status)
      ) {
        await waitBeforeRetry(attempt);
        continue;
      }

      throw new SolanaRpcError(
        method,
        `Solana RPC batch failed with ${response.status}`,
        { status: response.status }
      );
    }

    const payload = (await response.json()) as Array<RpcResponse<T>>;
    const rateLimited = payload.find((item) =>
      isRetryableRpcCode(item.error?.code)
    );

    if (rateLimited?.error) {
      if (attempt < MAX_RPC_ATTEMPTS - 1) {
        await waitBeforeRetry(attempt);
        continue;
      }

      throw new SolanaRpcError(
        method,
        `Solana RPC batch error ${rateLimited.error.code}: ${rateLimited.error.message}`,
        { code: rateLimited.error.code }
      );
    }

    return payload.map((item) => {
      if (item.error) return null;
      return item.result ?? null;
    });
  }

  throw new SolanaRpcError(method, "Solana RPC batch failed");
}
