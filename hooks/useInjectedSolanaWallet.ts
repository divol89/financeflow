import { useCallback, useState } from "react";

export interface InjectedSolanaProvider {
  publicKey?: { toBase58(): string };
  connect(): Promise<{ publicKey: { toBase58(): string } }>;
  disconnect?(): Promise<void>;
  signMessage(
    message: Uint8Array,
    encoding?: string
  ): Promise<Uint8Array | { signature: Uint8Array }>;
}

declare global {
  interface Window {
    solana?: InjectedSolanaProvider;
    solflare?: InjectedSolanaProvider;
  }
}

export function getInjectedSolanaProvider(): InjectedSolanaProvider | null {
  if (typeof window === "undefined") return null;
  return window.solana || window.solflare || null;
}

export function useInjectedSolanaWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<InjectedSolanaProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const injected = getInjectedSolanaProvider();
      if (!injected) {
        throw new Error("Install Phantom or Solflare to connect Solana.");
      }

      const connected = await injected.connect();
      const nextAddress = connected.publicKey.toBase58();
      setProvider(injected);
      setAddress(nextAddress);
      return { provider: injected, address: nextAddress };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Solana wallet connection failed";
      setError(message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await provider?.disconnect?.();
    setProvider(null);
    setAddress(null);
  }, [provider]);

  return {
    address,
    provider,
    isConnected: Boolean(address),
    isConnecting,
    error,
    connect,
    disconnect,
  };
}
