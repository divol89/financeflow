import { useCallback, useEffect, useState } from "react";
import bs58 from "bs58";
import type { LeviAccessState, LeviSession } from "@/types/levi";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import {
  getInjectedSolanaProvider,
  type InjectedSolanaProvider,
} from "./useInjectedSolanaWallet";

interface MeResponse {
  authenticated: boolean;
  session?: LeviSession;
  access?: LeviAccessState;
  error?: string;
}

export function useLeviAuth() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [session, setSession] = useState<LeviSession | null>(null);
  const [access, setAccess] = useState<LeviAccessState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (options?: { showErrors?: boolean }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/me");
      const data = await readJsonResponse<MeResponse>(
        response,
        "LEVI access is temporarily unavailable. Try again in a moment."
      );

      if (!response.ok) {
        setSession(null);
        setAccess(null);
        setError(options?.showErrors ? data.error || "Unable to load session" : null);
        return;
      }

      setSession(data.session || null);
      setAccess(data.access || null);
      setError(options?.showErrors ? data.error || null : null);
    } catch (err) {
      setSession(null);
      setAccess(null);
      setError(
        options?.showErrors
          ? err instanceof Error
            ? err.message
            : "Unable to load session"
          : null
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh({ showErrors: false });
  }, [refresh]);

  const getProvider = useCallback((): InjectedSolanaProvider | null => {
    return getInjectedSolanaProvider();
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    const provider = getProvider();
    if (!provider) {
      const message = "Install Phantom or Solflare to connect a Solana wallet.";
      setError(message);
      throw new Error(message);
    }

    try {
      const connected = await provider.connect();
      const address = connected.publicKey.toBase58();
      setWalletAddress(address);
      return { provider, address };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
      throw err;
    }
  }, [getProvider]);

  const signIn = useCallback(async () => {
    setError(null);
    setIsSigning(true);

    try {
      const provider = getProvider();
      const connected =
        provider?.publicKey && walletAddress
          ? { provider, address: walletAddress }
          : await connectWallet();

      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: connected.address }),
      });
      const noncePayload = await readJsonResponse<{ message?: string; error?: string }>(
        nonceResponse,
        "Unable to create auth nonce"
      );
      if (!nonceResponse.ok) {
        throw new Error(noncePayload.error || "Unable to create auth nonce");
      }
      if (!noncePayload.message) {
        throw new Error("Unable to create auth nonce");
      }

      const messageBytes = new TextEncoder().encode(noncePayload.message);
      const signed = await connected.provider.signMessage(messageBytes, "utf8");
      const signatureBytes = signed instanceof Uint8Array ? signed : signed.signature;
      const signature = bs58.encode(signatureBytes);

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: connected.address,
          message: noncePayload.message,
          signature,
        }),
      });
      const verifyPayload = await readJsonResponse<{ error?: string }>(
        verifyResponse,
        "Wallet signature rejected"
      );
      if (!verifyResponse.ok) {
        throw new Error(verifyPayload.error || "Wallet signature rejected");
      }

      await refresh({ showErrors: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsSigning(false);
    }
  }, [connectWallet, getProvider, refresh, walletAddress]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await getProvider()?.disconnect?.();
    setWalletAddress(null);
    setSession(null);
    setAccess(null);
  }, [getProvider]);

  return {
    walletAddress,
    session,
    access,
    isLoading,
    isSigning,
    error,
    connectWallet,
    refresh,
    signIn,
    logout,
  };
}
