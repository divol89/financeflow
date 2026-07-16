import Head from "next/head";
import { LeviBurnPortal } from "@/components/levi/LeviBurnPortal";
import { LeviShell } from "@/components/levi/LeviShell";

export default function BurnPage() {
  return (
    <LeviShell>
      <Head>
        <title>Universal Solana Token Burner | Agent K9</title>
        <meta
          name="description"
          content="Choose and permanently burn supported SPL or Token-2022 assets from your Solana wallet with a holder-signed transaction."
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
