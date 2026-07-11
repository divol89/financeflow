import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SolanaWalletConnectSheet } from "@/components/levi/SolanaWalletConnectSheet";
import {
  FLOW_FINANCE_ORIGIN,
  getInjectedSolanaProvider,
  getProviderAddress,
  getSafePhantomBrowseUrl,
  getSolanaWalletErrorMessage,
  isLikelyMobileWalletBrowser,
  waitForInjectedSolanaProvider,
  type ConnectedSolanaWallet,
  type InjectedSolanaProvider,
} from "@/lib/levi/solanaWallet";

interface SolanaWalletContextValue {
  address: string | null;
  provider: InjectedSolanaProvider | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect(): Promise<ConnectedSolanaWallet | null>;
  disconnect(): Promise<void>;
  openConnectionGuide(): void;
  clearError(): void;
}

const SolanaWalletContext = createContext<SolanaWalletContextValue | null>(null);

function readCurrentWindow() {
  return typeof window === "undefined" ? null : window;
}

function readAddressFromEvent(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const publicKey = value as { toBase58?: () => string };
  try {
    return typeof publicKey.toBase58 === "function" ? publicKey.toBase58() : null;
  } catch {
    return null;
  }
}

export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<InjectedSolanaProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [phantomBrowseUrl, setPhantomBrowseUrl] = useState(
    getSafePhantomBrowseUrl(FLOW_FINANCE_ORIGIN)
  );

  const syncProvider = useCallback((next?: InjectedSolanaProvider | null) => {
    const detected = next === undefined ? getInjectedSolanaProvider() : next;
    setProvider(detected);
    setAddress(getProviderAddress(detected));
    return detected;
  }, []);

  const closeConnectionGuide = useCallback(() => {
    setIsGuideOpen(false);
  }, []);

  const openConnectionGuide = useCallback(() => {
    if (typeof window !== "undefined") {
      setPhantomBrowseUrl(getSafePhantomBrowseUrl(window.location.href));
      setIsMobile(isLikelyMobileWalletBrowser(window));
    }
    setError(null);
    setIsGuideOpen(true);
  }, []);

  const connectToProvider = useCallback(
    async (nextProvider: InjectedSolanaProvider): Promise<ConnectedSolanaWallet> => {
      setIsConnecting(true);
      setError(null);
      try {
        const connected = await nextProvider.connect();
        const nextAddress = connected.publicKey.toBase58();
        if (!nextAddress) throw new Error("The wallet did not return a Solana address.");

        setProvider(nextProvider);
        setAddress(nextAddress);
        setIsGuideOpen(false);
        return { provider: nextProvider, address: nextAddress };
      } catch (reason) {
        const message = getSolanaWalletErrorMessage(reason);
        setError(message);
        throw new Error(message);
      } finally {
        setIsConnecting(false);
      }
    },
    []
  );

  const connect = useCallback(async (): Promise<ConnectedSolanaWallet | null> => {
    const detected = getInjectedSolanaProvider() || provider;
    if (!detected) {
      openConnectionGuide();
      return null;
    }

    return connectToProvider(detected);
  }, [connectToProvider, openConnectionGuide, provider]);

  const retryConnection = useCallback(async () => {
    setIsRetrying(true);
    setError(null);
    try {
      const detected = await waitForInjectedSolanaProvider({
        readScope: readCurrentWindow,
        delays: [0, 160, 480],
      });
      if (!detected) {
        setError("Phantom is still unavailable. Enable it for this site, then retry.");
        return;
      }

      syncProvider(detected);
      await connectToProvider(detected);
    } catch {
      // connectToProvider exposes the normalized error through context.
    } finally {
      setIsRetrying(false);
    }
  }, [connectToProvider, syncProvider]);

  const disconnect = useCallback(async () => {
    try {
      await provider?.disconnect?.();
    } finally {
      setAddress(null);
      setProvider(null);
      setError(null);
      setIsGuideOpen(false);
    }
  }, [provider]);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    let cancelled = false;

    async function discoverProvider() {
      const detected = await waitForInjectedSolanaProvider({
        readScope: readCurrentWindow,
      });
      if (cancelled || !detected) return;

      syncProvider(detected);
      if (detected.isPhantom === true && !getProviderAddress(detected)) {
        try {
          const trusted = await detected.connect({ onlyIfTrusted: true });
          if (!cancelled) {
            setProvider(detected);
            setAddress(trusted.publicKey.toBase58());
          }
        } catch {
          // A trusted connection is optional and must never open a prompt on load.
        }
      }
    }

    const refreshEnvironment = () => {
      if (typeof window === "undefined") return;
      setIsMobile(isLikelyMobileWalletBrowser(window));
      const detected = getInjectedSolanaProvider();
      if (detected) syncProvider(detected);
    };

    refreshEnvironment();
    void discoverProvider();
    window.addEventListener("focus", refreshEnvironment);
    window.addEventListener("resize", refreshEnvironment, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshEnvironment);
      window.removeEventListener("resize", refreshEnvironment);
    };
  }, [syncProvider]);

  useEffect(() => {
    if (!provider?.on) return;

    const handleConnect = (...args: unknown[]) => {
      setAddress(readAddressFromEvent(args[0]) || getProviderAddress(provider));
      setError(null);
    };
    const handleDisconnect = () => {
      setAddress(null);
      setError(null);
    };
    const handleAccountChanged = (...args: unknown[]) => {
      setAddress(readAddressFromEvent(args[0]));
      setError(null);
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);
    provider.on("accountChanged", handleAccountChanged);

    return () => {
      const remove = provider.off || provider.removeListener;
      remove?.call(provider, "connect", handleConnect);
      remove?.call(provider, "disconnect", handleDisconnect);
      remove?.call(provider, "accountChanged", handleAccountChanged);
    };
  }, [provider]);

  const value = useMemo<SolanaWalletContextValue>(
    () => ({
      address,
      provider,
      isConnected: Boolean(address),
      isConnecting,
      error,
      connect,
      disconnect,
      openConnectionGuide,
      clearError,
    }),
    [
      address,
      clearError,
      connect,
      disconnect,
      error,
      isConnecting,
      openConnectionGuide,
      provider,
    ]
  );

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
      <SolanaWalletConnectSheet
        error={error}
        isMobile={isMobile}
        isOpen={isGuideOpen}
        isRetrying={isRetrying}
        phantomBrowseUrl={phantomBrowseUrl}
        onClose={closeConnectionGuide}
        onRetry={() => void retryConnection()}
      />
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWalletContext(): SolanaWalletContextValue {
  const value = useContext(SolanaWalletContext);
  if (!value) {
    throw new Error("useSolanaWalletContext must be used inside SolanaWalletProvider.");
  }
  return value;
}
