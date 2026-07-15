import React from "react";
import { ArrowUpRight, AtSign, Send } from "lucide-react";
import {
  LEVI_COMMUNITY_LINKS,
  type LeviCommunityLinkId,
} from "@/lib/levi/communityLinks";

type LeviCommunityLinksVariant = "prominent" | "compact" | "mobile";

interface LeviCommunityLinksProps {
  variant?: LeviCommunityLinksVariant;
  onNavigate?: () => void;
}

function CommunityIcon({ id }: { id: LeviCommunityLinkId }) {
  return id === "telegram" ? (
    <Send className="h-4 w-4" aria-hidden="true" />
  ) : (
    <AtSign className="h-4 w-4" aria-hidden="true" />
  );
}

export function LeviCommunityLinks({
  variant = "prominent",
  onNavigate,
}: LeviCommunityLinksProps) {
  return (
    <div
      className={`levi-community-links is-${variant}`}
      aria-label="Official White Bull Agent community channels"
    >
      {LEVI_COMMUNITY_LINKS.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`levi-community-link is-${channel.id}`}
          onClick={onNavigate}
        >
          <span className="levi-community-link-icon">
            <CommunityIcon id={channel.id} />
          </span>
          <span className="levi-community-link-copy">
            <small>{channel.label}</small>
            <strong>{variant === "prominent" ? channel.action : channel.handle}</strong>
          </span>
          <ArrowUpRight className="levi-community-link-arrow h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
