import Head from "next/head";
import { BurnLedger } from "@/components/flow/BurnLedger";
import { LeviBurnPortal } from "@/components/levi/LeviBurnPortal";
import { LeviShell } from "@/components/levi/LeviShell";

export default function BurnPage() {
  return (
    <LeviShell>
      <Head>
        <title>Solana Burn Studio | Flow-Finance Adventures</title>
        <meta
          name="description"
          content="Choose and permanently burn supported SPL or Token-2022 assets from your Solana wallet, then verify every portal burn in the public ledger."
        />
      </Head>

      <div className="levi-burn-page">
        <div className="levi-burn-page-grid" aria-hidden="true" />
        <div className="levi-container">
          <LeviBurnPortal />
          <BurnLedger />
        </div>
      </div>
    </LeviShell>
  );
}
