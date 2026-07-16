import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, KeyRound, ShieldCheck, X } from "lucide-react";
import { LeviAuthPanel } from "./LeviAuthPanel";

export function WalletAccessSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose(): void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="levi-access-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="levi-access-sheet" role="dialog" aria-modal="true" aria-labelledby="wallet-access-title">
        <header>
          <div className="levi-access-sheet-mark"><ShieldCheck className="h-5 w-5" /></div>
          <div><p className="levi-section-label">Holder access</p><h2 id="wallet-access-title">Prove ownership. Keep custody.</h2></div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close holder access"><X className="h-5 w-5" /></button>
        </header>
        <p className="levi-access-sheet-lede">K9 holdings control product limits. They do not secure your wallet or authorize trading.</p>
        <LeviAuthPanel onConnectionGuideOpened={onClose} />
        <div className="levi-access-sheet-safety"><KeyRound className="h-4 w-4" /><span>The signature contains a login message only. Agent K9 cannot move your assets.</span></div>
        <div className="levi-access-sheet-links">
          <Link href="/scanner" onClick={onClose}>Open Scanner <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/portfolio" onClick={onClose}>Open Portfolio <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
