import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Check, Copy, Flame, LockKeyhole, ShieldAlert, X } from "lucide-react";
import {
  AGENT_K9_MINT_ADDRESS,
  SOLANA_INCINERATOR_ADDRESS,
  SOLANA_INCINERATOR_URL,
} from "@/lib/levi/communityBurn";
import { AGENT_K9_IMAGE_PATH } from "@/lib/agentK9/brand";

const BANNER_SESSION_KEY = "agent-k9-community-lock-banner-dismissed";

function getPageScrollY() {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

export function CommunityBurnBanner() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (router.pathname !== "/") return;
    if (window.sessionStorage.getItem(BANNER_SESSION_KEY) === "true") return;
    const timer = window.setTimeout(() => {
      if (getPageScrollY() < 32) setIsOpen(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [router.pathname]);

  useEffect(() => {
    if (router.pathname !== "/") setIsOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (!isOpen) return;

    function collapseBanner() {
      window.sessionStorage.setItem(BANNER_SESSION_KEY, "true");
      setIsOpen(false);
    }

    function collapseOnScroll() {
      if (getPageScrollY() >= 32) collapseBanner();
    }

    window.addEventListener("scroll", collapseOnScroll, { passive: true });
    window.addEventListener("wheel", collapseBanner, { passive: true });
    window.addEventListener("touchmove", collapseBanner, { passive: true });

    return () => {
      window.removeEventListener("scroll", collapseOnScroll);
      window.removeEventListener("wheel", collapseBanner);
      window.removeEventListener("touchmove", collapseBanner);
    };
  }, [isOpen]);

  function closeBanner() {
    window.sessionStorage.setItem(BANNER_SESSION_KEY, "true");
    setIsOpen(false);
  }

  async function copyIncineratorAddress() {
    try {
      await navigator.clipboard.writeText(SOLANA_INCINERATOR_ADDRESS);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (router.pathname === "/burn") return null;

  if (!isOpen) {
    return (
      <button
        type="button"
        className="levi-burn-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open K9 community lock information"
      >
        <Flame className="h-4 w-4" />
        <span>K9 lock</span>
      </button>
    );
  }

  return (
    <aside className="levi-burn-banner" aria-label="K9 community lock information">
      <div className="levi-burn-banner-topline">
        <div className="levi-burn-brand">
          <Image src={AGENT_K9_IMAGE_PATH} alt="Agent K9" width={42} height={42} />
          <div>
            <span>Agent K9</span>
            <strong>K9 community lock</strong>
          </div>
        </div>
        <button
          type="button"
          className="levi-burn-close"
          onClick={closeBanner}
          aria-label="Dismiss K9 community lock information"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="levi-burn-signal">
        <div>
          <Flame className="h-5 w-5" />
          <span>Holder-led supply lock</span>
        </div>
        <strong>Choose deliberately. Sign independently. Verify on-chain.</strong>
      </div>

      <div className="levi-burn-steps" aria-label="Community lock steps">
        <span>01 Review</span>
        <span>02 Copy</span>
        <span>03 Verify</span>
      </div>

      <div className="levi-burn-address">
        <span>Community lock destination</span>
        <code>{SOLANA_INCINERATOR_ADDRESS}</code>
        <button type="button" onClick={() => void copyIncineratorAddress()}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Address copied" : "Copy destination"}
        </button>
      </div>

      <div className="levi-burn-token">
        <LockKeyhole className="h-4 w-4" />
        <span>K9 mint</span>
        <code>{AGENT_K9_MINT_ADDRESS}</code>
      </div>

      <div className="levi-burn-notice">
        <ShieldAlert className="h-4 w-4" />
        <div>
          <strong>Dead-wallet lock is not a mint supply burn.</strong>
          <details>
            <summary>Read the permanent transfer warning</summary>
            <p>
              Sending K9 to this destination is an irreversible community lock,
              but it does not reduce the mint&apos;s recorded on-chain supply. A true
              supply burn requires a Token-2022 <code>BurnChecked</code> transaction
              signed by the holder.
            </p>
          </details>
        </div>
      </div>

      <a href={SOLANA_INCINERATOR_URL} target="_blank" rel="noreferrer" className="levi-burn-solscan-link">
        Verify the destination on Solscan
      </a>
      <Link href="/#live-burn-tracker" className="levi-burn-tracker-link">
        View real burn tracker
      </Link>
    </aside>
  );
}
