import React, { useState } from "react";

type StatsDropdownProps = {
  unclaimedRewards?: unknown[];
  claimReward?: (round: number) => Promise<void> | void;
  claimAllRewards?: () => Promise<void> | void;
};

export default function StatsDropdown({ unclaimedRewards = [], claimAllRewards }: StatsDropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-cyan-500/40 bg-slate-900 px-3 py-2 text-sm text-cyan-100"
      >
        {open ? "Hide Stats" : "View Stats"}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200 shadow-xl">
          <p className="font-semibold text-cyan-300">MagicPump Stats</p>
          <p className="mt-2">Unclaimed rewards: {unclaimedRewards.length}</p>
          <button
            type="button"
            onClick={() => claimAllRewards?.()}
            className="mt-3 rounded bg-cyan-700 px-3 py-1 text-xs text-white"
          >
            Claim all
          </button>
        </div>
      )}
    </div>
  );
}
