import Link from "next/link";
import { ArrowRight, Blocks, CircleCheck, Network } from "lucide-react";
import { LeviReveal } from "@/components/levi/LeviReveal";

export function BitcoinLearningLink() {
  return (
    <section className="levi-container levi-bitcoin-link-section">
      <LeviReveal>
        <div className="levi-bitcoin-link">
          <div className="levi-bitcoin-link-copy">
            <p className="levi-section-label">
              <Blocks className="h-3.5 w-3.5" /> New learning module
            </p>
            <h2>Bitcoin, explained through the original whitepaper.</h2>
            <p>
              Follow the original ideas behind digital ownership, shared validation and
              proof of work through an interactive field guide built inside Agent K9 Learn.
            </p>
            <Link href="/learn/bitcoin" className="levi-primary-button mt-7">
              Explore Bitcoin from first principles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="levi-bitcoin-link-map" aria-label="Bitcoin learning module overview">
            <div>
              <Network className="h-5 w-5" />
              <span>5 guided chapters</span>
            </div>
            <div>
              <Blocks className="h-5 w-5" />
              <span>One payment walkthrough</span>
            </div>
            <div>
              <CircleCheck className="h-5 w-5" />
              <span>Interactive knowledge check</span>
            </div>
          </div>
        </div>
      </LeviReveal>
    </section>
  );
}
