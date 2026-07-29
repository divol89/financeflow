import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CircleCheckBig,
  Coins,
  KeyRound,
  Radio,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import {
  BULLISH_MULE_MINT,
  BULLISH_MULE_SOLSCAN_URL,
} from "@/lib/fairLaunch/constants";

export const FAIR_LAUNCH_SIGNAL_STEPS = [
  {
    icon: Coins,
    title: "Hold Bullish Mule",
    body: "Any positive MULE balance in the signed wallet unlocks the curated holder board.",
  },
  {
    icon: KeyRound,
    title: "Connect and sign",
    body: "A login message proves wallet ownership without transferring tokens, granting approvals or joining a launch.",
  },
  {
    icon: SearchCheck,
    title: "Verify every mint",
    body: "Compare the full address on the board, Solscan and official project channels before taking any action.",
  },
  {
    icon: CircleCheckBig,
    title: "Choose freely",
    body: "Open an official source externally or do nothing. Flow-Finance never buys, swaps or enrolls the wallet automatically.",
  },
] as const;

interface FairLaunchSignalProps {
  variant?: "home" | "docs";
}

export function FairLaunchSignal({ variant = "home" }: FairLaunchSignalProps) {
  const isDocs = variant === "docs";

  return (
    <section
      id="fair-launch-signal"
      className={`flow-launch-signal is-${variant}`}
      aria-labelledby={`flow-launch-signal-${variant}-title`}
    >
      <header className="flow-launch-signal-heading">
        <div>
          <p className="flow-kicker">
            <Radio className="h-4 w-4" /> Bullish Mule Launch Signal
          </p>
          <h2 id={`flow-launch-signal-${variant}-title`}>
            {isDocs
              ? "How holder-first launch access works."
              : "Bullish Mule holders get a quieter first look."}
          </h2>
          <p>
            {isDocs
              ? "The live Bullish Mule board verifies a positive MULE balance from the signed Solana wallet, then reveals the supported token mints and official sources currently published by Flow-Finance. It never executes a purchase."
              : "Connect the wallet holding MULE to unlock a curated board of supported fair launches. Inspect official mints and sources, then independently decide whether any launch deserves your attention."}
          </p>
        </div>
        <div className="flow-launch-brand">
          <span>
            <Image
              src="/bullish-mule-logo.webp"
              alt=""
              fill
              sizes="52px"
            />
          </span>
          <div>
            <strong>Bullish Mule</strong>
            <small>Holder board</small>
          </div>
          <em className="flow-launch-status">
            <span aria-hidden="true" /> Live
          </em>
        </div>
      </header>

      {isDocs ? (
        <div className="flow-launch-contract">
          <span>Holder-access token</span>
          <code>{BULLISH_MULE_MINT}</code>
          <Link href={BULLISH_MULE_SOLSCAN_URL} target="_blank" rel="noreferrer">
            Verify mint
          </Link>
        </div>
      ) : null}

      <div className="flow-launch-signal-steps">
        {FAIR_LAUNCH_SIGNAL_STEPS.map(({ icon: Icon, title, body }, index) => (
          <article key={title}>
            <span className="flow-launch-step-number">{String(index + 1).padStart(2, "0")}</span>
            <Icon className="h-5 w-5" aria-hidden="true" />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>

      <footer className="flow-launch-signal-footer">
        <div>
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          <p>
            Holder access is an information service, not a recommendation,
            allocation, safety guarantee or promise of returns. Every mint and
            source must be independently verified.
          </p>
        </div>
        <Link href="/fair-launches" className="flow-secondary-button">
          Open MULE Launchpad <ArrowRight className="h-4 w-4" />
        </Link>
      </footer>
    </section>
  );
}
