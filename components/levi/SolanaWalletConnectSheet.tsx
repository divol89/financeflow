import { useEffect, useRef } from "react";
import {
  Download,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import { PHANTOM_DOWNLOAD_URL } from "@/lib/levi/solanaWallet";

interface SolanaWalletConnectSheetProps {
  error: string | null;
  isMobile: boolean;
  isOpen: boolean;
  isRetrying: boolean;
  phantomBrowseUrl: string;
  onClose(): void;
  onRetry(): void;
}

export function SolanaWalletConnectSheet({
  error,
  isMobile,
  isOpen,
  isRetrying,
  phantomBrowseUrl,
  onClose,
  onRetry,
}: SolanaWalletConnectSheetProps) {
  const primaryActionRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primaryActionRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="levi-wallet-connect-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="levi-wallet-connect-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="levi-wallet-connect-title"
      >
        <button
          type="button"
          className="levi-wallet-connect-close"
          onClick={onClose}
          aria-label="Close wallet connection options"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="levi-wallet-connect-mark" aria-hidden="true">
          <WalletCards className="h-6 w-6" />
        </div>
        <p className="levi-wallet-connect-eyebrow">Solana wallet</p>
        <h2 id="levi-wallet-connect-title">
          {isMobile ? "Continue inside Phantom" : "Connect the Phantom extension"}
        </h2>
        <p className="levi-wallet-connect-copy">
          {isMobile
            ? "Open this exact page in Phantom's secure browser, then connect and approve the request there."
            : "Install or enable Phantom for this site. If it is already enabled, retry detection without reloading the page."}
        </p>

        <div className="levi-wallet-connect-actions">
          {isMobile ? (
            <a
              ref={primaryActionRef}
              href={phantomBrowseUrl}
              className="levi-wallet-connect-primary"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Phantom
            </a>
          ) : (
            <a
              ref={primaryActionRef}
              href={PHANTOM_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="levi-wallet-connect-primary"
            >
              <Download className="h-4 w-4" />
              Install Phantom
            </a>
          )}

          <button
            type="button"
            className="levi-wallet-connect-secondary"
            onClick={onRetry}
            disabled={isRetrying}
          >
            <RefreshCw className={`h-4 w-4${isRetrying ? " animate-spin" : ""}`} />
            {isRetrying ? "Detecting wallet" : "Retry detection"}
          </button>
        </div>

        {error ? (
          <p className="levi-wallet-connect-status" role="status" aria-live="polite">
            {error}
          </p>
        ) : null}

        {isMobile ? (
          <a
            href={PHANTOM_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
            className="levi-wallet-connect-download"
          >
            Phantom not installed? Get the app
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}

        <div className="levi-wallet-connect-safety">
          <ShieldCheck className="h-4 w-4" />
          <span>This site never receives your seed phrase or private key.</span>
        </div>
      </section>
    </div>
  );
}
