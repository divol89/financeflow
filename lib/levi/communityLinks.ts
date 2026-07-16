import {
  AGENT_K9_TELEGRAM_HANDLE,
  AGENT_K9_TELEGRAM_URL,
  AGENT_K9_X_HANDLE,
  AGENT_K9_X_URL,
} from "@/lib/agentK9/brand";

export const LEVI_COMMUNITY_LINKS = [
  {
    id: "telegram",
    label: "Telegram",
    action: "Join FinanceFlowx",
    handle: AGENT_K9_TELEGRAM_HANDLE,
    href: AGENT_K9_TELEGRAM_URL,
  },
  {
    id: "x",
    label: "X",
    action: "Follow Agent K9",
    handle: AGENT_K9_X_HANDLE,
    href: AGENT_K9_X_URL,
  },
] as const;

export type LeviCommunityLinkId = (typeof LEVI_COMMUNITY_LINKS)[number]["id"];
