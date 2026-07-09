import React from "react";

export default function FinanceFlowWhitepaper() {
  return (
    <section className="rounded-xl border border-cyan-500/30 bg-slate-950/70 p-6 text-cyan-50 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-cyan-300">FinanceFlow Whitepaper</h2>
      <p className="mb-3 text-sm text-slate-200">
        FinanceFlow combines community voting, token discovery, dynamic staking,
        project validation, and IOTA EVM tools into one launch and participation platform.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>Vote funding and project listing for community-driven opportunities.</li>
        <li>MagicLauncher for token launch and initial liquidity.</li>
        <li>MagicPump for voting/power pools and visibility.</li>
        <li>Game modules such as Crazy Dice recovered from the legacy app.</li>
      </ul>
    </section>
  );
}
