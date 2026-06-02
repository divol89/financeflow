const ALLOWED_GET_PATHS = new Set([
  "/api/bot/status",
  "/api/bot/cockpit",
  "/api/bot/watcher-state",
  "/api/bot/top-holders",
  "/api/hermes/capabilities",
]);

const ALLOWED_POST_PATHS = new Set([
  "/api/bot/whales/discover",
]);

const DEFAULT_LOCAL_BOT_API = "http://127.0.0.1:8787";

function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/$/, "");
}

function targetPath(req) {
  const parts = Array.isArray(req.query.path) ? req.query.path : [];
  return `/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

export default async function handler(req, res) {
  const method = req.method || "GET";
  const path = targetPath(req);
  const allowed = method === "GET" ? ALLOWED_GET_PATHS : method === "POST" ? ALLOWED_POST_PATHS : null;

  if (!allowed?.has(path)) {
    return res.status(405).json({
      error: "IO bot proxy endpoint is read-only for the public dashboard",
      path,
      method,
    });
  }

  const baseUrl = normalizeBaseUrl(process.env.IO_BOT_API_BASE_URL || process.env.BOT_API_BASE_URL || DEFAULT_LOCAL_BOT_API);
  if (!baseUrl) {
    return res.status(503).json({ error: "IO_BOT_API_BASE_URL is not configured" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const upstream = await fetch(`${baseUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: method === "POST" ? JSON.stringify(req.body || {}) : undefined,
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Cache-Control", path === "/api/bot/top-holders" ? "s-maxage=300, stale-while-revalidate=300" : "no-store");
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (error) {
    const message = error?.name === "AbortError" ? "IO bot backend timeout" : "IO bot backend unavailable";
    return res.status(502).json({ error: message, detail: error?.message || String(error) });
  } finally {
    clearTimeout(timeout);
  }
}
