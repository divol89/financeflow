import { useCallback, useEffect, useState } from "react";
import bs58 from "bs58";
import type { LeviAccessState, LeviSession } from "@/types/levi";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import {
  notifyLeviAuthStateChange,
  subscribeToLeviAuthStateChange,
} from "@/lib/levi/authEvents";
import { useInjectedSolanaWallet } from "./useInjectedSolanaWallet";

interface MeResponse {
  authenticated: boolean;
  session?: LeviSession;
  access?: LeviAccessState;
  error?: string;
}

export function useLeviAuth() {
  const wallet = useInjectedSolanaWallet();
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
        "Wallet access is temporarily unavailable. Try again in a moment."
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

  useEffect(() => {
    return subscribeToLeviAuthStateChange(() => {
      void refresh({ showErrors: false });
    });
  }, [refresh]);

  const connectWallet = useCallback(async () => {
    setError(null);

    try {
      const connected = await wallet.connect();
      if (!connected) return null;
      notifyLeviAuthStateChange(connected.address);
      return connected;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
      throw err;
    }
  }, [wallet.connect]);

  const signIn = useCallback(async () => {
    setError(null);
    setIsSigning(true);

    try {
      const provider = wallet.provider;
      const connected =
        provider && wallet.address
          ? { provider, address: wallet.address }
          : await connectWallet();
      if (!connected) return;

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
      notifyLeviAuthStateChange(connected.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsSigning(false);
    }
  }, [connectWallet, refresh, wallet.address, wallet.provider]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to log out");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log out");
      return;
    }

    try {
      await wallet.disconnect();
    } catch {
      // The signed session is already cleared even if the extension disconnect fails.
    }

    setSession(null);
    setAccess(null);
    notifyLeviAuthStateChange(null);
  }, [wallet.disconnect]);

  const sessionMatchesWallet =
    !wallet.address || !session || session.wallet === wallet.address;
  const activeSession = sessionMatchesWallet ? session : null;
  const activeAccess = activeSession ? access : null;

  return {
    walletAddress: wallet.address,
    session: activeSession,
    access: activeAccess,
    isLoading,
    isSigning,
    error: error || wallet.error,
    connectWallet,
    refresh,
    signIn,
    logout,
  };
}
