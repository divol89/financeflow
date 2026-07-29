import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Radar,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import {
  BULLISH_MULE_HERO_IMAGE_PATH,
  BULLISH_MULE_MINT_ADDRESS,
  BULLISH_MULE_SOLSCAN_URL,
} from "@/lib/bullishMule/brand";
import { truncateSolanaAddress } from "@/lib/levi/wallet";

export function MuleHero() {
  return (
    <section className="mule-hero" aria-labelledby="mule-hero-title">
      <Image
        src={BULLISH_MULE_HERO_IMAGE_PATH}
        alt="Bullish Mule standing confidently before a rising market chart"
        fill
        priority
        className="mule-hero-media"
        sizes="100vw"
      />
      <div className="mule-hero-shade" aria-hidden="true" />
      <div className="mule-hero-grid" aria-hidden="true" />

      <div className="levi-container mule-hero-content">
        <p className="flow-kicker">
          <Sparkles className="h-4 w-4" /> Bullish Mule / Solana
        </p>
        <h1 id="mule-hero-title">
          Strong mind.
          <span>Bullish moves.</span>
        </h1>
        <p className="mule-hero-lede">
          Research wallets and tokens, manage risk with clearer evidence, burn
          supported assets and unlock holder-first fair-launch discovery from
          one noncustodial MULE workspace.
        </p>

        <div className="flow-hero-actions">
          <Link href="/fair-launches" className="flow-primary-button">
            Open MULE Launchpad <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/scanner" className="flow-secondary-button">
            <Radar className="h-4 w-4" /> Run Scanner
          </Link>
        </div>

        <div className="mule-hero-proof">
          <span><WalletCards className="h-4 w-4" /> Holder-first access</span>
          <span><ShieldCheck className="h-4 w-4" /> User-approved wallet actions</span>
          <a href={BULLISH_MULE_SOLSCAN_URL} target="_blank" rel="noreferrer">
            <code>{truncateSolanaAddress(BULLISH_MULE_MINT_ADDRESS, 6)}</code>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mule-hero-edge" aria-hidden="true">
        <span>MULE POWER</span>
        <span>DISCIPLINE</span>
        <span>VERIFY FIRST</span>
      </div>
    </section>
  );
}
