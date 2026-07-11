import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Flame,
  Loader2,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { useLeviBurn } from "@/hooks/useLeviBurn";
import { formatRawTokenAmount } from "@/lib/levi/burnTracker/calculations";
import {
  formatLeviBurnAmount,
  parseLeviBurnAmount,
} from "@/lib/levi/burn/validation";
import { truncateSolanaAddress } from "@/lib/levi/wallet";

function formatSolBalance(lamports: string): string {
  const raw = BigInt(lamports);
  const divisor = BigInt(1_000_000_000);
  const whole = raw / divisor;
  const fraction = (raw % divisor)
    .toString()
    .padStart(9, "0")
    .replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export function LeviBurnPortal() {
  const {
    address,
    isConnected,
    isConnecting,
    quote,
    isLoadingQuote,
    isBurning,
    error,
    submission,
    connectWallet,
    refreshQuote,
    burn,
  } = useLeviBurn();
  const [amount, setAmount] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const amountState = useMemo(() => {
    if (!amount.trim() || !quote) return { amountRaw: null, error: null };

    try {
      return {
        amountRaw: parseLeviBurnAmount(amount, quote.decimals),
        error: null,
      };
    } catch (reason) {
      return {
        amountRaw: null,
        error:
          reason instanceof Error ? reason.message : "Enter a valid LEVI AI amount.",
      };
    }
  }, [amount, quote]);

  const exceedsBalance = Boolean(
    amountState.amountRaw && quote && amountState.amountRaw > BigInt(quote.availableRaw)
  );
  const amountError = exceedsBalance
    ? "The requested burn amount exceeds your available LEVI AI balance."
    : amountState.error;
  const canBurn = Boolean(
    quote &&
      amountState.amountRaw &&
      !amountError &&
      acknowledged &&
      !isBurning &&
      !isLoadingQuote
  );

  async function handleConnect() {
    try {
      await connectWallet();
    } catch {
      // The hook retains the wallet error for the inline status region.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canBurn) return;

    try {
      const result = await burn(amount);
      if (result) {
        setAmount("");
        setAcknowledged(false);
      }
    } catch {
      // The hook retains the transaction error for the inline status region.
    }
  }

  function useMaximumBalance() {
    if (!quote) return;
    setAmount(formatLeviBurnAmount(quote.availableRaw, quote.decimals));
  }

  return (
    <section className="levi-burn-portal" aria-labelledby="levi-burn-title">
      <div className="levi-burn-portal-copy">
        <div className="levi-section-label">
          <Flame className="h-4 w-4" />
          LEVI AI / Token-2022
        </div>
        <h1 id="levi-burn-title">
          Burn supply.
          <span>Keep control.</span>
        </h1>
        <p className="levi-burn-portal-lede">
          A real burn removes LEVI AI from the selected token account and reduces the
          mint supply through a wallet-signed <code>BurnChecked</code> instruction.
          Nothing is sent to a project wallet.
        </p>

        <div className="levi-burn-principles">
          <div>
            <ShieldCheck className="h-4 w-4" />
            <div>
              <strong>Holder-signed</strong>
              <p>Your wallet reviews and signs the exact transaction.</p>
            </div>
          </div>
          <div>
            <Flame className="h-4 w-4" />
            <div>
              <strong>Supply-reducing</strong>
              <p>The Token-2022 mint supply falls by the confirmed amount.</p>
            </div>
          </div>
          <div>
            <WalletCards className="h-4 w-4" />
            <div>
              <strong>Non-custodial</strong>
              <p>This site never receives your tokens, seed phrase, or private key.</p>
            </div>
          </div>
        </div>

        <div className="levi-burn-portal-note">
          <AlertTriangle className="h-4 w-4" />
          <p>
            This action is permanent. The 100 LEVI AI already sent to the community
            lock remain locked and cannot be converted into a token-program burn.
          </p>
        </div>
      </div>

      <form className="levi-burn-tool" onSubmit={handleSubmit}>
        <div className="levi-burn-tool-heading">
          <div>
            <span>Burn from your wallet</span>
            <h2>Confirm the amount in Phantom or Solflare.</h2>
          </div>
          <Flame className="h-5 w-5" />
        </div>

        {!isConnected ? (
          <div className="levi-burn-connect-state">
            <p>Connect a Solana wallet to read the LEVI AI accounts you control.</p>
            <button
              type="button"
              className="levi-primary-button"
              onClick={() => void handleConnect()}
              disabled={isConnecting}
            >
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <WalletCards className="h-4 w-4" />}
              {isConnecting ? "Connecting" : "Connect wallet"}
            </button>
          </div>
        ) : (
          <>
            <div className="levi-burn-wallet-row">
              <div>
                <span>Connected wallet</span>
                <strong>{address ? truncateSolanaAddress(address, 6) : "Loading"}</strong>
              </div>
              <button
                type="button"
                className="levi-burn-refresh"
                onClick={() => void refreshQuote()}
                disabled={isLoadingQuote}
              >
                <RefreshCw className={`h-3.5 w-3.5${isLoadingQuote ? " animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {isLoadingQuote && !quote ? (
              <div className="levi-burn-loading" role="status">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reading your LEVI AI balance.
              </div>
            ) : quote ? (
              <>
                <div className="levi-burn-balance-row">
                  <div>
                    <span>Available to burn</span>
                    <strong>{formatRawTokenAmount(quote.availableRaw)} LEVI AI</strong>
                  </div>
                  <span>{formatSolBalance(quote.solBalanceLamports)} SOL for network fees</span>
                </div>

                <label className="levi-burn-amount-field">
                  <span>LEVI AI amount</span>
                  <div>
                    <input
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      aria-describedby="levi-burn-amount-help"
                      aria-invalid={Boolean(amountError)}
                    />
                    <button
                      type="button"
                      onClick={useMaximumBalance}
                      disabled={quote.availableRaw === "0"}
                    >
                      Max
                    </button>
                  </div>
                  <small id="levi-burn-amount-help">
                    Your wallet will display the final transaction before it is submitted.
                  </small>
                </label>

                {amountError ? (
                  <p className="levi-burn-inline-error" role="alert">
                    <AlertTriangle className="h-4 w-4" />
                    {amountError}
                  </p>
                ) : null}

                <label className="levi-burn-acknowledgement">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                  />
                  <span>
                    I understand that this permanently reduces my LEVI AI balance and
                    the LEVI AI mint supply. This cannot be reversed.
                  </span>
                </label>

                <button type="submit" className="levi-burn-submit" disabled={!canBurn}>
                  {isBurning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
                  {isBurning ? "Waiting for confirmation" : "Burn LEVI AI"}
                </button>
              </>
            ) : (
              <div className="levi-burn-connect-state">
                <p>We could not load your token accounts. Refresh to try the free Solana RPC again.</p>
                <button type="button" className="levi-secondary-button" onClick={() => void refreshQuote()}>
                  <RefreshCw className="h-4 w-4" />
                  Refresh balance
                </button>
              </div>
            )}
          </>
        )}

        {error ? (
          <p className="levi-burn-error" role="alert">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        ) : null}

        {submission ? (
          <div className="levi-burn-success" role="status">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <strong>Burn transaction confirmed.</strong>
              <p>
                {formatRawTokenAmount(submission.amountRaw)} LEVI AI was submitted to
                the Token-2022 burn instruction.
              </p>
              <div>
                <a href={submission.solscanUrl} target="_blank" rel="noreferrer">
                  View transaction <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Link href="/#live-burn-tracker">
                  Open tracker <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <p className="levi-burn-tool-footnote">
          The tracker records finalized supply changes on its next scheduled cache refresh.
          Your confirmed Solscan transaction is the immediate proof of a burn.
        </p>
      </form>
    </section>
  );
}
