import { FormEvent, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/router";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Info,
  Loader2,
  LockKeyhole,
  Radar,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { AGENT_K9_MINT_ADDRESS } from "@/lib/agentK9/brand";
import { useTokenSniffer } from "@/hooks/useTokenSniffer";
import type { TokenSnifferRiskTone } from "@/types/tokenSniffer";

const loadingMessages = [
  "Checking the token report",
  "Reading warning signals",
  "Turning technical data into plain language",
];

function RiskIcon({ tone }: { tone: TokenSnifferRiskTone }) {
  if (tone === "danger") return <ShieldAlert className="h-5 w-5" />;
  if (tone === "warn") return <AlertTriangle className="h-5 w-5" />;
  return <Info className="h-5 w-5" />;
}

export function TokenSnifferPanel() {
  const router = useRouter();
  const sniffer = useTokenSniffer();
  const [mint, setMint] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    const queryMint = Array.isArray(router.query.mint)
      ? router.query.mint[0]
      : router.query.mint;
    if (queryMint) setMint(queryMint);
  }, [router.isReady, router.query.mint]);

  useEffect(() => {
    if (!sniffer.isLoading) {
      setLoadingStep(0);
      return;
    }
    const timer = window.setInterval(
      () => setLoadingStep((current) => (current + 1) % loadingMessages.length),
      900
    );
    return () => window.clearInterval(timer);
  }, [sniffer.isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sniffer.inspect(mint);
  }

  const report = sniffer.report;

  return (
    <div className="levi-sniffer-workspace">
      <section className="levi-sniffer-intro" aria-label="How Token Sniffer works">
        <article><span>01</span><Search className="h-5 w-5" /><strong>Paste the mint</strong><p>Use the token contract, not a wallet or transaction address.</p></article>
        <article><span>02</span><Radar className="h-5 w-5" /><strong>Read the signals</strong><p>We translate the provider report into clear warning checks.</p></article>
        <article><span>03</span><CheckCircle2 className="h-5 w-5" /><strong>Verify before acting</strong><p>Open the evidence and combine it with your own research.</p></article>
      </section>

      <form className="levi-sniffer-form" onSubmit={handleSubmit}>
        <div>
          <p className="levi-section-label"><Sparkles className="h-4 w-4" /> One-minute token check</p>
          <h2>What token do you want to inspect?</h2>
          <p>No wallet connection or signature is required. This tool only reads public information.</p>
        </div>
        <label>
          Solana token mint
          <div className="levi-sniffer-input-row">
            <input
              value={mint}
              onChange={(event) => setMint(event.target.value)}
              placeholder="Paste a Solana token mint"
              autoComplete="off"
              spellCheck={false}
              disabled={sniffer.isLoading}
              aria-describedby="token-sniffer-hint"
            />
            <button
              type="submit"
              className="levi-primary-button"
              disabled={sniffer.isLoading || mint.trim().length < 32}
            >
              {sniffer.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              {sniffer.isLoading ? "Sniffing..." : "Sniff this token"}
            </button>
          </div>
          <small id="token-sniffer-hint">Example: a mint ending in <code>pump</code>, or any SPL/Token-2022 mint.</small>
        </label>
        <button
          type="button"
          className="levi-sniffer-sample"
          onClick={() => setMint(AGENT_K9_MINT_ADDRESS)}
          disabled={sniffer.isLoading}
        >
          Try it with K9
        </button>
      </form>

      {sniffer.isLoading ? (
        <div className="levi-sniffer-loading" role="status" aria-live="polite">
          <div><Radar className="h-7 w-7" /><i /></div>
          <strong>{loadingMessages[loadingStep]}</strong>
          <span>One provider request is running. The result is cached to protect the free API.</span>
        </div>
      ) : null}

      {sniffer.error ? (
        <div className="levi-sniffer-error" role="alert">
          <AlertTriangle className="h-5 w-5" />
          <div><strong>We could not complete this check.</strong><p>{sniffer.error}</p></div>
        </div>
      ) : null}

      {report ? (
        <section className={`levi-sniffer-result is-${report.verdict.tone}`} aria-labelledby="token-sniffer-result-title">
          <header>
            <div>
              <p className="levi-section-label"><Gauge className="h-4 w-4" /> Token report</p>
              <h2 id="token-sniffer-result-title">{report.verdict.label}</h2>
              <p>{report.verdict.summary}</p>
              <code>{report.mint}</code>
            </div>
            <div className="levi-sniffer-score" style={{ "--sniffer-score": report.scoreNormalized } as CSSProperties}>
              <strong>{report.scoreNormalized}</strong>
              <span>/100 warnings</span>
              <small>Lower is better</small>
            </div>
          </header>

          <div className="levi-sniffer-metrics">
            <article><ShieldAlert className="h-5 w-5" /><span>Signals found</span><strong>{report.risks.length}</strong><small>Read every item below</small></article>
            <article><LockKeyhole className="h-5 w-5" /><span>Reported LP lock</span><strong>{report.lpLockedPercent.toFixed(1)}%</strong><small>Provider-recognized liquidity lock</small></article>
            <article><Radar className="h-5 w-5" /><span>Token standard</span><strong>{report.tokenProgramLabel}</strong><small>{report.tokenProgram ? "Program identified" : "Program not identified"}</small></article>
          </div>

          <div className="levi-sniffer-explanation">
            <div>
              <p className="levi-section-label">Plain-language review</p>
              <h3>What needs your attention</h3>
              <p>A warning is a reason to investigate, not proof that the creator is malicious.</p>
            </div>
            <div className="levi-sniffer-risk-list">
              {report.risks.length ? report.risks.map((risk) => (
                <article key={risk.id} className={`is-${risk.tone}`}>
                  <RiskIcon tone={risk.tone} />
                  <div><strong>{risk.name}</strong><p>{risk.description}</p>{risk.value ? <small>{risk.value}</small> : null}</div>
                </article>
              )) : (
                <article className="is-info"><CheckCircle2 className="h-5 w-5" /><div><strong>No provider warning returned</strong><p>This means fewer known signals were detected, not that the token is guaranteed to be safe.</p></div></article>
              )}
            </div>
          </div>

          <div className="levi-sniffer-next-steps">
            <div><p className="levi-section-label">Before you trade</p><h3>Use the report in this order</h3></div>
            <ol>
              <li><span>1</span><div><strong>Confirm the mint</strong><p>Compare this exact address with the project&apos;s official channels.</p></div></li>
              <li><span>2</span><div><strong>Read every warning</strong><p>Concentration and liquidity warnings can matter more than the headline score.</p></div></li>
              <li><span>3</span><div><strong>Inspect the chain</strong><p>Review holders and recent transactions before making a decision.</p></div></li>
            </ol>
          </div>

          <footer>
            <div><Info className="h-4 w-4" /><span>{report.source}{report.cached ? report.stale ? " · stored fallback" : " · cached result" : " · fresh result"}</span></div>
            <div>
              <a href={`https://solscan.io/token/${report.mint}`} target="_blank" rel="noreferrer">Solscan <ExternalLink className="h-4 w-4" /></a>
              <a href={`https://rugcheck.xyz/tokens/${report.mint}`} target="_blank" rel="noreferrer">Full RugCheck <ExternalLink className="h-4 w-4" /></a>
            </div>
          </footer>
        </section>
      ) : null}
    </div>
  );
}
