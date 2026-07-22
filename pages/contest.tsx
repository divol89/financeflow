import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  Link2,
  LockKeyhole,
  Megaphone,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { LeviReveal } from "@/components/levi/LeviReveal";
import { LeviShell } from "@/components/levi/LeviShell";
import { useLeviAuth } from "@/hooks/useLeviAuth";
import { readJsonResponse } from "@/lib/levi/fetchJson";
import { getDefaultContestCampaign } from "@/lib/contest/constants";
import { formatContestHolding } from "@/lib/contest/formatting";
import type {
  ContestEligibilityResponse,
  ContestPublicResponse,
  ContestSubmissionResponse,
  LeviSocialContestCampaign,
} from "@/types/contest";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function shortenWallet(wallet: string) {
  return wallet.length > 12 ? `${wallet.slice(0, 5)}...${wallet.slice(-5)}` : wallet;
}

export default function ContestPage() {
  const auth = useLeviAuth();
  const [campaign, setCampaign] = useState<LeviSocialContestCampaign>(
    getDefaultContestCampaign()
  );
  const [entries, setEntries] = useState<ContestPublicResponse["entries"]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [eligibility, setEligibility] = useState<ContestEligibilityResponse | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [postUrl, setPostUrl] = useState("");
  const [isLoadingContest, setIsLoadingContest] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contestError, setContestError] = useState<string | null>(null);
  const [eligibilityError, setEligibilityError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadContest() {
      try {
        const response = await fetch("/api/contest");
        const payload = await readJsonResponse<ContestPublicResponse>(
          response,
          "Contest data is temporarily unavailable."
        );
        if (cancelled) return;

        if (payload.campaign) setCampaign(payload.campaign);
        setEntries(payload.entries || []);
        setTotalEntries(payload.totalEntries || 0);
        setStorageAvailable(payload.storageAvailable !== false);
        setContestError(response.ok ? null : payload.error || "Contest data is temporarily unavailable.");
      } catch {
        if (!cancelled) {
          setStorageAvailable(false);
          setContestError("Contest data is temporarily unavailable.");
        }
      } finally {
        if (!cancelled) setIsLoadingContest(false);
      }
    }

    loadContest();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!auth.session) {
      setEligibility(null);
      setEligibilityError(null);
      return;
    }

    let cancelled = false;
    setEligibility(null);
    setEligibilityError(null);

    async function loadEligibility() {
      try {
        const response = await fetch("/api/contest/eligibility");
        const payload = await readJsonResponse<ContestEligibilityResponse>(
          response,
          "Unable to read contest holder balances."
        );
        if (cancelled) return;
        if (!response.ok) {
          setEligibilityError(payload.error || "Unable to read contest holder balances.");
          return;
        }
        setEligibility(payload);
      } catch {
        if (!cancelled) setEligibilityError("Unable to read contest holder balances.");
      }
    }

    loadEligibility();
    return () => {
      cancelled = true;
    };
  }, [auth.session]);

  const campaignOpen =
    campaign.status === "open" && new Date(campaign.closesAt).getTime() > Date.now();
  const contestTokens = campaign.eligibleTokens.map((token) => token.symbol).join(" or ");
  const minimumHolding = campaign.tiers[0]?.minimumHolding || 500;
  const tierLabels = campaign.tiers
    .map((tier) => `${formatContestHolding(tier.minimumHolding)}+`)
    .join(" / ");
  const isEligible = Boolean(eligibility?.eligible);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitMessage(null);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contest/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl }),
      });
      const payload = await readJsonResponse<ContestSubmissionResponse>(
        response,
        "Unable to submit this post right now."
      );

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit this post right now.");
      }

      setPostUrl("");
      setTotalEntries((current) => payload.totalEntries ?? current + 1);
      setSubmitMessage(
        "Your post has been received and is now in the review queue. It will appear publicly after approval."
      );
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit this post right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LeviShell>
      <Head>
        <title>K9 Social Quest | Flow-Finance Adventures</title>
        <meta
          name="description"
          content="A holder-gated K9 community contest for thoughtful posts on X."
        />
      </Head>

      <div className="levi-contest-page">
        <div className="levi-contest-grid" aria-hidden="true" />
        <div className="levi-contest-light" aria-hidden="true" />

        <section className="levi-container levi-contest-hero">
          <LeviReveal>
            <div className="levi-contest-copy">
              <p className="levi-eyebrow">
                <Megaphone className="h-3.5 w-3.5" /> K9 Social
              </p>
              <h1 className="levi-contest-title">
                Post with purpose.
                <span>Move the signal.</span>
              </h1>
              <p className="levi-contest-lede">
                Share a considered Agent K9 post on X, submit the direct link and
                unlock a surprise reward tier through your K9 holding.
              </p>
              <div className="levi-contest-proof">
                <span>
                  <ShieldCheck className="h-4 w-4" /> Holder-gated
                </span>
                <span>
                  <Sparkles className="h-4 w-4" /> Human-reviewed
                </span>
                <span>
                  <LockKeyhole className="h-4 w-4" /> Prize reveal pending
                </span>
              </div>
            </div>
          </LeviReveal>

          <LeviReveal>
            <aside className="levi-contest-signal" aria-label="Campaign status">
              <div className="levi-contest-signal-icon">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="levi-section-label">Campaign status</p>
              <p className="levi-contest-signal-title">
                {campaignOpen ? "Open for entries" : "Campaign closed"}
              </p>
              <div className="levi-contest-signal-row">
                <span>Closes</span>
                <strong>{formatDate(campaign.closesAt)}</strong>
              </div>
              <div className="levi-contest-signal-row">
                <span>Requirement</span>
                <strong>{formatContestHolding(minimumHolding)}+ {contestTokens}</strong>
              </div>
              <div className="levi-contest-signal-row">
                <span>Reward tiers</span>
                <strong>{tierLabels}</strong>
              </div>
              <div className="levi-contest-signal-lock">
                <LockKeyhole className="h-4 w-4" />
                <span>{campaign.prizeRevealed ? campaign.prizeLabel : "Prize reveal pending"}</span>
              </div>
            </aside>
          </LeviReveal>
        </section>

        <section className="levi-container levi-contest-stats" aria-label="Contest overview">
          <div className="levi-contest-stat">
            <span>Entries received</span>
            <strong>{totalEntries}</strong>
          </div>
          <div className="levi-contest-stat">
            <span>Access threshold</span>
            <strong>{formatContestHolding(minimumHolding)}+ {contestTokens}</strong>
          </div>
          <div className="levi-contest-stat">
            <span>Surprise tiers</span>
            <strong>{tierLabels}</strong>
          </div>
        </section>

        <section className="levi-container levi-contest-workspace">
          <LeviReveal>
            <div className="levi-contest-submit levi-panel">
              <div className="levi-panel-header">
                <div>
                  <p className="levi-section-label">
                    <Link2 className="h-3.5 w-3.5" /> Submit your post
                  </p>
                  <h2 className="levi-panel-title">Put your signal on record.</h2>
                  <p className="levi-panel-copy">
                    One direct X post per wallet. Entries are reviewed for relevance,
                    originality and the reach they create for K9.
                  </p>
                </div>
                <div className="levi-contest-requirement">
                  <BadgeCheck className="h-5 w-5" />
                  <span>{formatContestHolding(minimumHolding)}+ {contestTokens}</span>
                </div>
              </div>

              <div className="levi-contest-form-area">
                {auth.isLoading || isLoadingContest || (auth.session && !eligibility && !eligibilityError) ? (
                  <div className="levi-contest-state">
                    <span className="levi-contest-spinner" aria-hidden="true" />
                    Loading campaign access...
                  </div>
                ) : !auth.session ? (
                  <div className="levi-contest-state">
                    <div className="levi-contest-state-icon">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>Connect your Solana wallet</h3>
                      <p>Sign once to verify ownership and unlock the submission form.</p>
                      <button
                        type="button"
                        className="levi-primary-button mt-5"
                        onClick={() => auth.signIn()}
                        disabled={auth.isSigning}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {auth.isSigning ? "Waiting for signature" : "Connect & sign access"}
                      </button>
                    </div>
                  </div>
                ) : eligibilityError ? (
                  <div className="levi-contest-state is-error">
                    <div className="levi-contest-state-icon is-red">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>Holder check temporarily unavailable</h3>
                      <p>{eligibilityError}</p>
                    </div>
                  </div>
                ) : !isEligible ? (
                  <div className="levi-contest-state">
                    <div className="levi-contest-state-icon is-amber">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>Reach a surprise reward tier</h3>
                      <p>
                        Hold at least {formatContestHolding(minimumHolding)} {contestTokens} to participate.
                        The available tiers are {tierLabels}.
                      </p>
                    </div>
                  </div>
                ) : !campaignOpen ? (
                  <div className="levi-contest-state">
                    <div className="levi-contest-state-icon is-amber">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>This campaign is closed</h3>
                      <p>The team is reviewing entries. The winner and prize will be revealed later.</p>
                    </div>
                  </div>
                ) : !storageAvailable ? (
                  <div className="levi-contest-state is-error">
                    <div className="levi-contest-state-icon is-red">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3>Submissions are temporarily paused</h3>
                      <p>{contestError || "The campaign storage is not available yet."}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="levi-contest-tier-status">
                      <Sparkles className="h-4 w-4" />
                      Current reward tier: <strong>{eligibility?.tier?.label}</strong>. Surprise revealed later.
                    </p>
                    <form onSubmit={handleSubmit} className="levi-contest-form">
                    <label htmlFor="post-url">Direct X post link</label>
                    <div className="levi-contest-input-row">
                      <input
                        id="post-url"
                        type="url"
                        className="levi-form-input"
                        value={postUrl}
                        onChange={(event) => setPostUrl(event.target.value)}
                        placeholder="https://x.com/username/status/..."
                        required
                        inputMode="url"
                        autoComplete="url"
                      />
                      <button
                        type="submit"
                        className="levi-primary-button levi-contest-submit-button"
                        disabled={isSubmitting || !postUrl.trim()}
                      >
                        <Send className="h-4 w-4" />
                        {isSubmitting ? "Submitting" : "Submit post"}
                      </button>
                    </div>
                    <p className="levi-contest-form-note">
                      Your wallet: <strong>{shortenWallet(auth.session.wallet)}</strong>. Use a direct X post URL such as <code>https://x.com/account/status/1234567890</code>.
                    </p>
                    {submitMessage ? (
                      <p className="levi-contest-feedback is-success" role="status">
                        <CheckCircle2 className="h-4 w-4" /> {submitMessage}
                      </p>
                    ) : null}
                    {submitError ? (
                      <p className="levi-contest-feedback is-error" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    </form>
                  </>
                )}
                {auth.error ? <p className="levi-contest-feedback is-error" role="alert">{auth.error}</p> : null}
                {contestError && storageAvailable ? (
                  <p className="levi-contest-feedback is-error" role="alert">{contestError}</p>
                ) : null}
              </div>
            </div>
          </LeviReveal>

          <LeviReveal>
            <aside className="levi-contest-rules levi-panel">
              <p className="levi-section-label">
                <Sparkles className="h-3.5 w-3.5" /> How it works
              </p>
              <h2 className="levi-panel-title">Good signal compounds.</h2>
              <ol className="levi-contest-steps">
                <li>
                  <span>01</span>
                  <div>
                    <strong>Hold K9</strong>
                    <p>Keep the tier amount in the K9 wallet you use to enter. Holdings are checked on-chain.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>Reach a tier</strong>
                    <p>{tierLabels} unlock different surprise reward levels.</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Post and submit</strong>
                    <p>The team reviews relevance, originality and social impact manually.</p>
                  </div>
                </li>
              </ol>
              <p className="levi-contest-disclaimer">
                The prize is intentionally undisclosed until the campaign closes. This is a community campaign, not an automated payout.
              </p>
            </aside>
          </LeviReveal>
        </section>

        <section className="levi-container levi-contest-feed-section">
          <LeviReveal>
            <div className="levi-contest-feed-header">
              <div>
                <p className="levi-section-label">
                  <BadgeCheck className="h-3.5 w-3.5" /> Community signal
                </p>
                <h2 className="levi-panel-title">Approved posts.</h2>
                <p className="levi-panel-copy">
                  Entries are counted when received. Only approved posts are published here.
                </p>
              </div>
              <div className="levi-contest-feed-status">
                <span className="levi-contest-status-dot" />
                {entries.length} approved {entries.length === 1 ? "entry" : "entries"}
              </div>
            </div>

            {entries.length ? (
              <div className="levi-contest-feed">
                {entries.map((entry) => (
                  <a
                    key={entry.id}
                    href={entry.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="levi-contest-entry"
                  >
                    <div className="levi-contest-entry-icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <strong>{entry.walletLabel}</strong>
                      <span>{formatDate(entry.submittedAt)}</span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="levi-contest-empty">
                <Trophy className="h-5 w-5" />
                <span>Approved entries will appear here after review.</span>
              </div>
            )}
          </LeviReveal>
        </section>

        <div className="levi-container levi-contest-footer-rail" aria-hidden="true">
          <span>K9 SOCIAL / 01</span>
          <div />
          <span>Human review. Community reach.</span>
        </div>
      </div>
    </LeviShell>
  );
}
