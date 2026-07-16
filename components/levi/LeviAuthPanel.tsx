import { KeyRound, LogOut, PlugZap, ShieldCheck, Signature } from "lucide-react";
import { AccessBadge } from "./AccessBadge";
import { useLeviAuth } from "@/hooks/useLeviAuth";

export function LeviAuthPanel({
  compact = false,
  onConnectionGuideOpened,
}: {
  compact?: boolean;
  onConnectionGuideOpened?: () => void;
}) {
  const {
    access,
    connectWallet,
    error,
    isLoading,
    isSigning,
    session,
    signIn,
    logout,
    walletAddress,
  } = useLeviAuth();

  const nextThreshold =
    access?.tier === "blocked" ? 3_000 : access?.tier === "basic" ? 50_000 : null;
  const progress =
    access && nextThreshold
      ? Math.min(100, Math.max(0, (access.balance / nextThreshold) * 100))
      : 100;
  const displayWallet = session?.wallet || walletAddress;

  return (
    <div className={`levi-auth-panel${compact ? " is-compact" : ""}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">K9 Access</p>
            <p className="mt-1 text-sm text-slate-400">
              {session
                ? "Wallet ownership verified for this session."
                : "Connect and sign a message to prove wallet ownership."}
            </p>
          </div>
          {access ? <AccessBadge tier={access.tier} /> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {session ? (
            <>
              <div className="levi-secondary-button" aria-label={`Verified wallet ${session.wallet}`}>
                <PlugZap className="h-4 w-4" />
                {`${session.wallet.slice(0, 4)}...${session.wallet.slice(-4)}`}
              </div>
              <button
                type="button"
                onClick={logout}
                className="levi-secondary-button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  void connectWallet()
                    .then((connected) => {
                      if (!connected) onConnectionGuideOpened?.();
                    })
                    .catch(() => undefined);
                }}
                className="levi-secondary-button"
              >
                <PlugZap className="h-4 w-4" />
                {displayWallet
                  ? `${displayWallet.slice(0, 4)}...${displayWallet.slice(-4)}`
                  : "Connect Solana"}
              </button>
              <button
                type="button"
                onClick={signIn}
                disabled={isSigning || isLoading}
                className="levi-primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Signature className="h-4 w-4" />
                {isSigning ? "Signing..." : "Sign Access"}
              </button>
            </>
          )}
        </div>

        {access ? (
          <div className="levi-access-summary grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-slate-500">Balance</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {access.balance.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                K9
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Access Tier</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {access.tier}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Portfolio</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                {access.limits.fullDashboard ? "Full" : "Basic"}
              </p>
            </div>
          </div>
        ) : null}

        {access && nextThreshold ? (
          <div className="levi-access-progress">
            <div>
              <span>Progress to {access.tier === "blocked" ? "Basic" : "Full"}</span>
              <strong>{Math.max(0, nextThreshold - access.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} K9 remaining</strong>
            </div>
            <div className="levi-access-progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
        ) : null}

        <p className="levi-access-safety">
          <KeyRound className="h-4 w-4" />
          Message signing only. No token transfer, approval, custody or transaction.
        </p>

        {error ? (
          <p className="border-l border-red-400/60 bg-red-950/30 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
