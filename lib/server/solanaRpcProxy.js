const DEFAULT_RPC_URLS = ["https://solana-rpc.publicnode.com", "https://api.mainnet-beta.solana.com"];

const ALLOWED_METHODS = new Set([
  "getSignaturesForAddress",
  "getTransaction",
  "getTokenLargestAccounts",
  "getTokenSupply",
  "getMultipleAccounts",
]);

function configuredRpcUrls() {
  const configured = String(process.env.SOLANA_RPC_PROXY_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  return [...new Set([...configured, ...DEFAULT_RPC_URLS])];
}

function allowedHostPatterns() {
  const configured = String(process.env.MATRIX_DASHBOARD_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return new Set([
    "flow-finance.xyz",
    "www.flow-finance.xyz",
    "financeflow-three.vercel.app",
    "financeflow-divol89s-projects.vercel.app",
    "localhost",
    "127.0.0.1",
    ...configured,
  ]);
}

function hostnameFromHeader(value) {
  if (!value) return "";
  if (!String(value).includes("://")) {
    return String(value).split(":")[0].toLowerCase();
  }

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return String(value).split(":")[0].toLowerCase();
  }
}

function assertDashboardHost(req) {
  const allowedHosts = allowedHostPatterns();
  const host = hostnameFromHeader(req.headers.host);
  const origin = hostnameFromHeader(req.headers.origin);
  const referer = hostnameFromHeader(req.headers.referer);

  if (!allowedHosts.has(host) && !host.endsWith(".vercel.app")) {
    const error = new Error("Dashboard host is not allowed");
    error.statusCode = 403;
    throw error;
  }

  if (origin && !allowedHosts.has(origin) && !origin.endsWith(".vercel.app")) {
    const error = new Error("Dashboard origin is not allowed");
    error.statusCode = 403;
    throw error;
  }

  if (referer && !allowedHosts.has(referer) && !referer.endsWith(".vercel.app")) {
    const error = new Error("Dashboard referer is not allowed");
    error.statusCode = 403;
    throw error;
  }
}

function assertRpcPayload(method, params) {
  if (!ALLOWED_METHODS.has(method)) {
    const error = new Error("Solana RPC method is not allowed");
    error.statusCode = 403;
    throw error;
  }

  if (!Array.isArray(params)) {
    const error = new Error("Solana RPC params must be an array");
    error.statusCode = 400;
    throw error;
  }
}

async function postRpc(rpcUrl, method, params) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: `${method}-${Date.now()}`, method, params }),
      signal: controller.signal,
    });
    const text = await response.text();
    const json = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const error = new Error(`Solana RPC upstream failed with ${response.status}`);
      error.statusCode = response.status === 429 ? 429 : 502;
      throw error;
    }

    if (json.error) {
      const message = json.error.message || "Solana RPC upstream error";
      const error = new Error(message);
      error.statusCode = String(message).toLowerCase().includes("too many requests") ? 429 : 502;
      throw error;
    }

    return json.result ?? null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function callSolanaRpcFromDashboard(req, { method, params = [] }) {
  assertDashboardHost(req);
  assertRpcPayload(method, params);

  let lastError;
  for (const rpcUrl of configuredRpcUrls()) {
    try {
      return await postRpc(rpcUrl, method, params);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Solana RPC proxy failed");
}
