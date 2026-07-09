import type { NextApiRequest, NextApiResponse } from "next";

export function getClientKey(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return ip?.trim() || req.socket.remoteAddress || "unknown";
}

export function parseCookies(req: NextApiRequest): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};

  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...value] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(value.join("="));
    return acc;
  }, {});
}

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  maxAgeSeconds: number
) {
  const cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  const existing = res.getHeader("Set-Cookie");
  if (!existing) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }

  res.setHeader("Set-Cookie", [
    ...(Array.isArray(existing) ? existing : [String(existing)]),
    cookie,
  ]);
}

export function clearCookie(res: NextApiResponse, name: string) {
  setCookie(res, name, "", 0);
}
