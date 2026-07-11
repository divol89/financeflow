import Head from "next/head";
import { BarChart3, ShieldCheck } from "lucide-react";
import { LeviShell } from "@/components/levi/LeviShell";
import { PortfolioDashboard } from "@/components/levi/PortfolioDashboard";

export default function PortfolioPage() {
  return (
    <LeviShell>
      <Head>
        <title>Portfolio | LEVI Sentinel</title>
        <meta name="description" content="Private SOL, LEVI and LEVI AI balance history, investigations and decision journal." />
      </Head>
      <section className="levi-product-page levi-portfolio-page">
        <div className="levi-container">
          <header className="levi-product-hero">
            <div>
              <p className="levi-section-label"><BarChart3 className="h-4 w-4" /> Portfolio</p>
              <h1>See what your wallet is actually doing.</h1>
              <p>Track project balances, review classified movements and keep the thesis beside the decision.</p>
            </div>
            <div className="levi-product-hero-proof"><ShieldCheck className="h-4 w-4" /><span>Private to your signed wallet session</span></div>
          </header>
          <PortfolioDashboard />
        </div>
      </section>
    </LeviShell>
  );
}
