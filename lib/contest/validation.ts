const SOCIAL_HOSTS = new Set([
  "x.com",
  "www.x.com",
  "twitter.com",
  "www.twitter.com",
]);

export class ContestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContestValidationError";
  }
}

export function normalizePostUrl(input: string): string {
  const value = input.trim();
  if (!value || value.length > 400) {
    throw new ContestValidationError("Enter a valid X post link.");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new ContestValidationError("Enter a valid X post link.");
  }

  if (parsed.protocol !== "https:" || !SOCIAL_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new ContestValidationError("Only x.com or twitter.com post links are accepted.");
  }

  const isStatusPath = /^\/[^/]+\/status\/\d+\/?$/.test(parsed.pathname);
  const isWebStatusPath = /^\/i\/web\/status\/\d+\/?$/.test(parsed.pathname);
  if (!isStatusPath && !isWebStatusPath) {
    throw new ContestValidationError("Use a direct post link, not a profile or search link.");
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = parsed.pathname.replace(/\/$/, "");
  return `https://${hostname}${pathname}`;
}

export function abbreviatedWallet(wallet: string): string {
  if (wallet.length <= 12) return wallet;
  return `${wallet.slice(0, 5)}...${wallet.slice(-5)}`;
}
