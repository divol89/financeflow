import { LogOut, PlugZap, ShieldCheck, Signature } from "lucide-react";
import { AccessBadge } from "./AccessBadge";
import { useLeviAuth } from "@/hooks/useLeviAuth";

export function LeviAuthPanel() {
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

  return (
    <div className="rounded-lg border border-white/10 bg-black/65 p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">LEVI Access</p>
            <p className="mt-1 text-sm text-slate-400">
              Sign once to unlock the scanner with your token balance.
            </p>
          </div>
          {access ? <AccessBadge tier={access.tier} /> : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              void connectWallet().catch(() => undefined);
            }}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <PlugZap className="h-4 w-4" />
            {walletAddress
              ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
              : "Connect Solana"}
          </button>
          <button
            type="button"
            onClick={signIn}
            disabled={isSigning || isLoading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Signature className="h-4 w-4" />
            {isSigning ? "Signing..." : "Sign Access"}
          </button>
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>

        {access ? (
          <div className="grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-slate-500">Balance</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {access.balance.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                LEVI
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Access Tier</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {access.tier}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Dashboard</p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                {access.limits.fullDashboard ? "Full" : "Basic"}
              </p>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-md border border-red-400/25 bg-red-950/60 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
