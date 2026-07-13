import Head from "next/head";
import { Radar, ShieldCheck } from "lucide-react";
import { LeviShell } from "@/components/levi/LeviShell";
import { TokenSnifferPanel } from "@/components/levi/TokenSnifferPanel";

export default function TokenSnifferPage() {
  return (
    <LeviShell>
      <Head>
        <title>Token Sniffer | LEVI Sentinel</title>
        <meta
          name="description"
          content="A beginner-friendly Solana token risk check powered by RugCheck data through FluxRPC."
        />
      </Head>
      <section className="levi-product-page levi-sniffer-page">
        <div className="levi-container">
          <header className="levi-product-hero levi-sniffer-hero">
            <div>
              <p className="levi-section-label"><Radar className="h-4 w-4" /> Token Sniffer</p>
              <h1>Check a token before you trade.</h1>
              <p>Paste a Solana mint and get a clear explanation of the warning signals, without technical jargon or a wallet connection.</p>
            </div>
            <div className="levi-product-hero-proof"><ShieldCheck className="h-4 w-4" /><span>Read-only · no signature required</span></div>
          </header>
          <TokenSnifferPanel />
        </div>
      </section>
    </LeviShell>
  );
}
