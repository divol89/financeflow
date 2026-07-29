import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  BadgeCheck,
  CircleAlert,
  Coins,
  ExternalLink,
  KeyRound,
  LockKeyhole,
  Radar,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { FairLaunchAdminPanel } from "@/components/fairLaunch/FairLaunchAdminPanel";
import { FairLaunchCard } from "@/components/fairLaunch/FairLaunchCard";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { useFairLaunchCatalog } from "@/hooks/useFairLaunchCatalog";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import {
  BULLISH_MULE_MINT,
  BULLISH_MULE_SOLSCAN_URL,
  BULLISH_MULE_SYMBOL,
} from "@/lib/fairLaunch/constants";

function formatBalance(value: number | null): string {
  if (value === null) return "Unavailable";
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}

export default function FairLaunchesPage() {
  const auth = useLeviAuth();
  const catalog = useFairLaunchCatalog(auth.session?.wallet);
  const { data } = catalog;
  const visibleLaunches = data.isAdmin
    ? data.launches
    : data.launches.filter((project) => project.isPublished);

  return (
    <LeviShell>
      <Head>
        <title>Bullish Mule Fair Launches | Flow-Finance Adventures</title>
        <meta
          name="description"
          content="A holder-first board for independently reviewing supported Solana memecoin fair launches. No purchases or investment advice."
        />
        <meta property="og:image" content="/bullish-mule-moon.webp" />
      </Head>

      <div className="mule-launch-page">
        <div className="mule-launch-stars" aria-hidden="true" />

        <section className="levi-container mule-launch-hero">
          <LeviReveal>
            <div className="mule-launch-hero-copy">
              <p className="mule-launch-kicker">
                <Sparkles className="h-4 w-4" /> Bullish Mule holder access
              </p>
              <h1>
                Fair launches,
                <span>seen before the crowd.</span>
              </h1>
              <p>
                Hold any positive balance of Bullish Mule, connect the same
                wallet and review the official token mints that Flow-Finance
                currently supports. The board informs; it never buys for you.
              </p>
              <div className="mule-launch-hero-actions">
                <Link href="#holder-access" className="flow-primary-button">
                  Check holder access <ArrowDown className="h-4 w-4" />
                </Link>
                <Link
                  href={BULLISH_MULE_SOLSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flow-secondary-button"
                >
                  Verify Bullish Mule <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              <div className="mule-launch-proof">
                <span>
                  <ShieldCheck className="h-4 w-4" /> Server-side holding check
                </span>
                <span>
                  <KeyRound className="h-4 w-4" /> Login signature only
                </span>
                <span>
                  <CircleAlert className="h-4 w-4" /> No investment advice
                </span>
              </div>
            </div>
          </LeviReveal>

          <LeviReveal>
            <div className="mule-launch-hero-visual">
              <div className="mule-launch-hero-image">
                <Image
                  src="/bullish-mule-moon.webp"
                  alt="Bullish Mule standing in front of a golden moon"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 520px"
                />
              </div>
              <div className="mule-launch-logo-badge">
                <Image
                  src="/bullish-mule-logo.webp"
                  alt=""
                  fill
                  sizes="84px"
                />
              </div>
              <span className="mule-launch-live-chip">
                <span aria-hidden="true" /> Holder board online
              </span>
            </div>
          </LeviReveal>
        </section>

        <section
          id="holder-access"
          className="levi-container mule-launch-access"
          aria-labelledby="mule-access-title"
        >
          <header>
            <div>
              <p className="mule-launch-kicker">
                <WalletCards className="h-4 w-4" /> Access checkpoint
              </p>
              <h2 id="mule-access-title">Prove the wallet. Keep custody.</h2>
              <p>
                The signed message proves wallet ownership. It cannot transfer
                tokens, approve spending or join a launch automatically.
              </p>
            </div>
            <Link
              href={BULLISH_MULE_SOLSCAN_URL}
              target="_blank"
              rel="noreferrer"
              className="mule-launch-holder-token"
            >
              <span>{BULLISH_MULE_SYMBOL}</span>
              <code>{BULLISH_MULE_MINT}</code>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </header>

          <div className="mule-launch-access-state">
            {auth.isLoading ? (
              <div className="mule-launch-state-message">
                <span className="mule-launch-spinner" aria-hidden="true" />
                <div>
                  <strong>Checking the signed session</strong>
                  <p>This should only take a moment.</p>
                </div>
              </div>
            ) : !auth.session ? (
              <div className="mule-launch-state-message">
                <div className="mule-launch-state-icon">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <strong>Connect and sign to check access</strong>
                  <p>
                    Use the wallet that holds Bullish Mule. Any positive token
                    balance qualifies.
                  </p>
                </div>
                <button
                  type="button"
                  className="flow-primary-button"
                  onClick={() => void auth.signIn()}
                  disabled={auth.isSigning}
                >
                  <WalletCards className="h-4 w-4" />
                  {auth.isSigning ? "Waiting for signature" : "Connect & sign"}
                </button>
              </div>
            ) : catalog.isLoading ? (
              <div className="mule-launch-state-message">
                <span className="mule-launch-spinner" aria-hidden="true" />
                <div>
                  <strong>Reading the Bullish Mule balance</strong>
                  <p>The check runs on Solana through the server.</p>
                </div>
              </div>
            ) : !data.accessCheckAvailable && !data.isAdmin ? (
              <div className="mule-launch-state-message is-warning">
                <div className="mule-launch-state-icon">
                  <CircleAlert className="h-5 w-5" />
                </div>
                <div>
                  <strong>Holder check temporarily unavailable</strong>
                  <p>
                    Access was not denied. Retry when the public Solana RPC
                    becomes available.
                  </p>
                </div>
                <button
                  type="button"
                  className="flow-secondary-button"
                  onClick={() => void catalog.refresh()}
                >
                  <RefreshCw className="h-4 w-4" /> Retry check
                </button>
              </div>
            ) : data.accessGranted ? (
              <div className="mule-launch-state-message is-granted">
                <div className="mule-launch-state-icon">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <strong>
                    {data.holderEligible
                      ? "Bullish Mule holder access confirmed"
                      : "Launch administrator access confirmed"}
                  </strong>
                  <p>
                    {data.holderEligible
                      ? `${formatBalance(data.balance)} ${BULLISH_MULE_SYMBOL} detected in the signed wallet.`
                      : "This configured admin wallet can manage the catalog without a holder balance."}
                  </p>
                </div>
                <button
                  type="button"
                  className="flow-secondary-button"
                  onClick={() => void catalog.refresh()}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
              </div>
            ) : (
              <div className="mule-launch-state-message is-locked">
                <div className="mule-launch-state-icon">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <strong>No Bullish Mule balance detected</strong>
                  <p>
                    This wallet currently holds {formatBalance(data.balance)}{" "}
                    {BULLISH_MULE_SYMBOL}. The board unlocks with any positive
                    balance.
                  </p>
                </div>
                <Link
                  href={BULLISH_MULE_SOLSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flow-secondary-button"
                >
                  Verify the official mint <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {auth.error || catalog.error ? (
            <p className="mule-launch-page-error" role="alert">
              {auth.error || catalog.error}
            </p>
          ) : null}
        </section>

        <section
          className="levi-container mule-launch-catalog"
          aria-labelledby="launch-catalog-title"
        >
          <header className="mule-launch-section-heading">
            <div>
              <p className="mule-launch-kicker">
                <Radar className="h-4 w-4" /> Supported launch board
              </p>
              <h2 id="launch-catalog-title">Verify first. Decide for yourself.</h2>
              <p>
                Every listing identifies the official mint and source. A listing
                means the launch is supported for community discovery, not that
                returns or safety are guaranteed.
              </p>
            </div>
            {data.accessGranted ? (
              <span>
                {visibleLaunches.length}{" "}
                {visibleLaunches.length === 1 ? "launch" : "launches"}
              </span>
            ) : (
              <span className="is-locked">
                <LockKeyhole className="h-4 w-4" /> Holder access
              </span>
            )}
          </header>

          {data.accessGranted && data.catalogAvailable ? (
            visibleLaunches.length > 0 ? (
              <div className="mule-launch-card-grid">
                {visibleLaunches.map((project) => (
                  <FairLaunchCard
                    key={project.id}
                    project={project}
                    showPublicationState={data.isAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className="mule-launch-empty">
                <Rocket className="h-7 w-7" />
                <h3>The board is ready for the next supported launch.</h3>
                <p>
                  No project is currently published. Official mints will appear
                  here after the team verifies and adds them.
                </p>
              </div>
            )
          ) : (
            <div className="mule-launch-locked-preview" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </section>

        {data.isAdmin ? (
          <div className="levi-container">
            <FairLaunchAdminPanel
              launches={data.launches}
              onCreate={catalog.createLaunch}
              onUpdate={catalog.updateLaunch}
              onDelete={catalog.deleteLaunch}
            />
          </div>
        ) : null}

        <section className="levi-container mule-launch-safety">
          <div className="mule-launch-safety-visual">
            <Image
              src="/bullish-mule-rocket.webp"
              alt="Bullish Mule riding a token rocket through space"
              fill
              sizes="(max-width: 800px) 100vw, 430px"
            />
          </div>
          <div>
            <p className="mule-launch-kicker">
              <ShieldCheck className="h-4 w-4" /> Participation stays optional
            </p>
            <h2>No buy button by design.</h2>
            <p>
              Flow-Finance only presents verified addresses and official
              sources. You decide whether to visit an external launch, how much
              research to do and whether to participate at all.
            </p>
            <ul>
              <li>Verify the full mint on Solscan and official channels.</li>
              <li>Review liquidity, authorities, distribution and launch terms.</li>
              <li>Assume every memecoin can lose all of its value.</li>
            </ul>
            <p className="mule-launch-disclaimer">
              This board is educational and informational. It is not financial,
              legal or investment advice, an endorsement, an allocation, or a
              promise of profit.
            </p>
          </div>
        </section>
      </div>
    </LeviShell>
  );
}
