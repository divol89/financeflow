import {
  FLOW_FINANCE_TELEGRAM_HANDLE,
  FLOW_FINANCE_TELEGRAM_URL,
  FLOW_FINANCE_X_HANDLE,
  FLOW_FINANCE_X_URL,
} from "@/lib/flowFinance/brand";

export const LEVI_COMMUNITY_LINKS = [
  {
    id: "telegram",
    label: "Telegram",
    action: "Join FinanceFlowx",
    handle: FLOW_FINANCE_TELEGRAM_HANDLE,
    href: FLOW_FINANCE_TELEGRAM_URL,
  },
  {
    id: "x",
    label: "X",
    action: "Follow the adventures",
    handle: FLOW_FINANCE_X_HANDLE,
    href: FLOW_FINANCE_X_URL,
  },
] as const;

export type LeviCommunityLinkId = (typeof LEVI_COMMUNITY_LINKS)[number]["id"];
