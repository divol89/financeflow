import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Radio,
} from "lucide-react";
import type { FairLaunchProject } from "@/types/fairLaunch";

const STATUS_LABELS = {
  announced: "Announced",
  open: "Launch window open",
  closed: "Window closed",
} as const;

function displaySymbol(symbol: string): string {
  return symbol.startsWith("$") ? symbol : `$${symbol}`;
}

function formatLaunchDate(value: string | null): string {
  if (!value) return "Timing to be announced";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function FairLaunchCard({
  project,
  showPublicationState = false,
}: {
  project: FairLaunchProject;
  showPublicationState?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1_800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyMint() {
    await navigator.clipboard.writeText(project.mint);
    setCopied(true);
  }

  return (
    <article className={`mule-launch-card is-${project.status}`}>
      <header>
        <div className="mule-launch-token-mark" aria-hidden="true">
          {project.symbol.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p>{displaySymbol(project.symbol)}</p>
          <h3>{project.name}</h3>
        </div>
        <span className={`mule-launch-status is-${project.status}`}>
          <span aria-hidden="true" />
          {STATUS_LABELS[project.status]}
        </span>
      </header>

      <p className="mule-launch-card-summary">{project.summary}</p>

      <dl className="mule-launch-card-facts">
        <div>
          <dt>
            <CalendarClock className="h-4 w-4" /> Launch timing
          </dt>
          <dd>{formatLaunchDate(project.launchAt)}</dd>
        </div>
        <div>
          <dt>
            <Radio className="h-4 w-4" /> Listing status
          </dt>
          <dd>
            {showPublicationState
              ? project.isPublished
                ? "Visible to holders"
                : "Admin draft"
              : "Curated launch signal"}
          </dd>
        </div>
      </dl>

      <div className="mule-launch-mint">
        <span>Official mint</span>
        <code>{project.mint}</code>
        <button
          type="button"
          onClick={() => void copyMint()}
          aria-label={`Copy ${project.name} mint`}
          title="Copy mint"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <footer>
        <Link
          href={`https://solscan.io/token/${project.mint}`}
          target="_blank"
          rel="noreferrer"
          className="flow-primary-button"
        >
          Verify on Solscan <ExternalLink className="h-4 w-4" />
        </Link>
        {project.officialUrl ? (
          <Link
            href={project.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="flow-secondary-button"
          >
            Official launch source <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {project.xUrl ? (
          <Link
            href={project.xUrl}
            target="_blank"
            rel="noreferrer"
            className="mule-launch-icon-link"
            aria-label={`${project.name} on X`}
            title="Open X"
          >
            X
          </Link>
        ) : null}
        {project.telegramUrl ? (
          <Link
            href={project.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="mule-launch-icon-link"
            aria-label={`${project.name} on Telegram`}
            title="Open Telegram"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
