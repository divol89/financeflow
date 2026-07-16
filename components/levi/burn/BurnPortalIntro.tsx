import { AlertTriangle, Flame, ShieldCheck, WalletCards } from "lucide-react";

export function BurnPortalIntro() {
  return (
    <div className="levi-burn-portal-copy">
      <div className="levi-section-label">
        <Flame className="h-4 w-4" />
        Universal Solana burner
      </div>
      <h1 id="levi-burn-title">
        Choose the token.
        <span>Burn it for real.</span>
      </h1>
      <p className="levi-burn-portal-lede">
        Choose any supported Solana token from your wallet, select the amount,
        review the exact mint, and approve a permanent <code>BurnChecked</code>{" "}
        transaction in Phantom or Solflare.
      </p>

      <div className="levi-burn-principles">
        <div>
          <WalletCards className="h-4 w-4" />
          <div>
            <strong>Your wallet, your assets</strong>
            <p>The portal discovers positive SPL and Token-2022 balances you control.</p>
          </div>
        </div>
        <div>
          <Flame className="h-4 w-4" />
          <div>
            <strong>Canonical supply reduction</strong>
            <p>BurnChecked reduces both your token balance and that mint&apos;s supply.</p>
          </div>
        </div>
        <div>
          <ShieldCheck className="h-4 w-4" />
          <div>
            <strong>K9 holder utility</strong>
            <p>
              K9 burns have no access threshold. Other tokens require at least
              1,000,000 K9 in the signing wallet.
            </p>
          </div>
        </div>
      </div>

      <div className="levi-burn-portal-note">
        <AlertTriangle className="h-4 w-4" />
        <p>
          Burns are irreversible. Verify the complete mint before signing. Native SOL
          and frozen token accounts cannot be burned through this portal.
        </p>
      </div>
    </div>
  );
}
