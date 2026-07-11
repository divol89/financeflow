import Head from "next/head";
import { LeviBurnPortal } from "@/components/levi/LeviBurnPortal";
import { LeviShell } from "@/components/levi/LeviShell";

export default function BurnPage() {
  return (
    <LeviShell>
      <Head>
        <title>Burn LEVI AI | White Bull Agent</title>
        <meta
          name="description"
          content="Burn LEVI AI directly from a Solana wallet with a holder-signed Token-2022 transaction."
        />
      </Head>

      <div className="levi-burn-page">
        <div className="levi-burn-page-grid" aria-hidden="true" />
        <div className="levi-container">
          <LeviBurnPortal />
        </div>
      </div>
    </LeviShell>
  );
}
