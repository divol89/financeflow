export const LEVI_COMMUNITY_LINKS = [
  {
    id: "telegram",
    label: "Telegram",
    action: "Join FinanceFlowx",
    handle: "FinanceFlowx",
    href: "https://t.me/FinanceFlowx",
  },
  {
    id: "x",
    label: "X",
    action: "Follow White Bull Agent",
    handle: "@WhiteBullAgent",
    href: "https://x.com/WhiteBullAgent",
  },
] as const;

export type LeviCommunityLinkId = (typeof LEVI_COMMUNITY_LINKS)[number]["id"];
