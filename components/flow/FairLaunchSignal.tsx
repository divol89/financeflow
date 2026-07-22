import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CircleCheckBig,
  Radio,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const FAIR_LAUNCH_SIGNAL_STEPS = [
  {
    icon: BellRing,
    title: "Receive the signal",
    body: "A small amount of the new Adventure token appears in an eligible community wallet before the participation window opens publicly.",
  },
  {
    icon: SearchCheck,
    title: "Verify the launch",
    body: "Match the mint with this website and the official channels. Ignore lookalike tokens and unsolicited links.",
  },
  {
    icon: Sparkles,
    title: "Review the adventure",
    body: "Read the launch terms, on-chain evidence and project documentation before taking any action.",
  },
  {
    icon: CircleCheckBig,
    title: "Choose freely",
    body: "Join the early participation window or do nothing. Receiving the signal never enrolls a wallet automatically.",
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
            <Radio className="h-4 w-4" /> Adventure Launch Signal
          </p>
          <h2 id={`flow-launch-signal-${variant}-title`}>
            {isDocs
              ? "How the fair-launch notification will work."
              : "The next fair launch can reach your wallet first."}
          </h2>
          <p>
            {isDocs
              ? "The planned airdrop system will send a small amount of the new Adventure token as an on-chain notification when a fair memecoin launch is ready for community review. Recipients will be among the first invited to inspect the launch and may decide whether to participate."
              : "We are building an airdrop-based alert for new Adventure memecoins. When your wallet receives the signal, you will be among the first informed and can independently decide whether the launch is right for you."}
          </p>
        </div>
        <span className="flow-launch-status"><span aria-hidden="true" /> In development</span>
      </header>

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
            A signal is an early notice, not a recommendation, allocation or promise of
            returns. Participation is always optional and every mint must be verified.
          </p>
        </div>
        {isDocs ? null : (
          <Link href="/docs#fair-launch-signal" className="flow-secondary-button">
            How it will work <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </footer>
    </section>
  );
}
