import type { Transaction } from "@solana/web3.js";

export const FLOW_FINANCE_ORIGIN = "https://flow-finance.xyz";
export const PHANTOM_DOWNLOAD_URL = "https://phantom.app/download";
const PHANTOM_BROWSE_URL = "https://phantom.app/ul/browse";

export interface SolanaPublicKeyLike {
  toBase58(): string;
}

export interface InjectedSolanaProvider {
  publicKey?: SolanaPublicKeyLike | null;
  isConnected?: boolean;
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{
    publicKey: SolanaPublicKeyLike;
  }>;
  disconnect?(): Promise<void>;
  signMessage(
    message: Uint8Array,
    encoding?: string
  ): Promise<Uint8Array | { signature: Uint8Array }>;
  signTransaction?(transaction: Transaction): Promise<Transaction>;
  signAndSendTransaction?(
    transaction: Transaction
  ): Promise<string | { signature: string }>;
  on?(event: "connect" | "disconnect" | "accountChanged", listener: (...args: unknown[]) => void): void;
  off?(event: "connect" | "disconnect" | "accountChanged", listener: (...args: unknown[]) => void): void;
  removeListener?(
    event: "connect" | "disconnect" | "accountChanged",
    listener: (...args: unknown[]) => void
  ): void;
}

export interface SolanaWalletWindow {
  phantom?: { solana?: InjectedSolanaProvider };
  solana?: InjectedSolanaProvider;
  solflare?: InjectedSolanaProvider;
}

declare global {
  interface Window extends SolanaWalletWindow {}
}

export interface ConnectedSolanaWallet {
  provider: InjectedSolanaProvider;
  address: string;
}

function hasProviderCapabilities(
  provider: InjectedSolanaProvider | null | undefined
): provider is InjectedSolanaProvider {
  return Boolean(
    provider &&
      typeof provider.connect === "function" &&
      typeof provider.signMessage === "function"
  );
}

export function getInjectedSolanaProvider(
  scope: SolanaWalletWindow | null = typeof window === "undefined" ? null : window
): InjectedSolanaProvider | null {
  if (!scope) return null;

  const phantom = scope.phantom?.solana;
  if (hasProviderCapabilities(phantom) && phantom.isPhantom === true) {
    return phantom;
  }

  if (hasProviderCapabilities(scope.solflare)) {
    return scope.solflare;
  }

  return hasProviderCapabilities(scope.solana) ? scope.solana : null;
}

export function getProviderAddress(
  provider: InjectedSolanaProvider | null | undefined
): string | null {
  try {
    const address = provider?.publicKey?.toBase58();
    return address && address.length > 0 ? address : null;
  } catch {
    return null;
  }
}

function pause(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function waitForInjectedSolanaProvider(options: {
  readScope: () => SolanaWalletWindow | null;
  delays?: number[];
  wait?: (milliseconds: number) => Promise<void>;
}): Promise<InjectedSolanaProvider | null> {
  const delays = options.delays || [0, 120, 360, 900, 1_800];
  const wait = options.wait || pause;

  for (const delay of delays) {
    if (delay > 0) await wait(delay);
    const provider = getInjectedSolanaProvider(options.readScope());
    if (provider) return provider;
  }

  return null;
}

function isAllowedFlowFinanceSource(url: URL): boolean {
  if (
    url.origin === FLOW_FINANCE_ORIGIN ||
    url.origin === "https://www.flow-finance.xyz"
  ) {
    return true;
  }

  return (
    (url.hostname === "localhost" || url.hostname === "127.0.0.1") &&
    url.protocol === "http:"
  );
}

export function buildPhantomBrowseUrl(currentUrl: string): string {
  const source = new URL(currentUrl, FLOW_FINANCE_ORIGIN);
  if (!isAllowedFlowFinanceSource(source)) {
    throw new Error("Phantom browse targets must stay on the Flow-Finance Adventures website.");
  }

  const target = new URL(
    `${source.pathname}${source.search}${source.hash}`,
    FLOW_FINANCE_ORIGIN
  );

  return `${PHANTOM_BROWSE_URL}/${encodeURIComponent(target.toString())}?ref=${encodeURIComponent(
    FLOW_FINANCE_ORIGIN
  )}`;
}

export function getSafePhantomBrowseUrl(currentUrl: string): string {
  try {
    return buildPhantomBrowseUrl(currentUrl);
  } catch {
    return buildPhantomBrowseUrl(FLOW_FINANCE_ORIGIN);
  }
}

export function isLikelyMobileWalletBrowser(scope: {
  innerWidth?: number;
  navigator?: { maxTouchPoints?: number };
  matchMedia?: (query: string) => { matches: boolean };
}): boolean {
  try {
    const width = typeof scope.innerWidth === "number" ? scope.innerWidth : Infinity;
    if (width <= 768) return true;
    if (scope.matchMedia?.("(pointer: coarse)").matches === true) return true;
    return width <= 1_024 && (scope.navigator?.maxTouchPoints || 0) > 0;
  } catch {
    return false;
  }
}

export function getSolanaWalletErrorMessage(error: unknown): string {
  const candidate = error as { code?: number; message?: string } | null;
  const code = candidate?.code;
  const message = candidate?.message || "";

  if (code === 4001 || /user rejected|cancelled|canceled/i.test(message)) {
    return "Wallet connection was cancelled.";
  }
  if (code === -32002 || /already.*pending|already.*open/i.test(message)) {
    return "A wallet request is already open. Approve or close it, then retry.";
  }
  if (code === 4100) {
    return "This site is not authorized in the wallet. Reconnect and approve access.";
  }
  if (code === 4900) {
    return "The wallet is disconnected from Solana. Check the wallet and retry.";
  }

  return message || "Solana wallet connection failed.";
}
