export type ScannerChartGuideTone =
  | "positive"
  | "negative"
  | "neutral"
  | "cumulative";

export interface ScannerChartGuideItem {
  id: string;
  label: string;
  meaning: string;
  tone: ScannerChartGuideTone;
}

export interface ScannerChartGuideContent {
  items: ScannerChartGuideItem[];
  usage: string[];
  limitation: string;
}

export function buildScannerChartGuide(
  routed: boolean
): ScannerChartGuideContent {
  if (routed) {
    return {
      items: [
        {
          id: "routed-buy",
          label: "Buy-side route",
          meaning:
            "The initiating signer finished the swap with more of the inspected token. It does not mean the program address bought tokens for itself.",
          tone: "positive",
        },
        {
          id: "routed-sell",
          label: "Sell-side route",
          meaning:
            "The initiating signer finished with fewer target tokens. The quantity is routed through the program, not sold from the program's own balance.",
          tone: "negative",
        },
        {
          id: "routed-neutral",
          label: "Undirected route",
          meaning:
            "Token volume crossed the inspected account, but the available signer balances do not prove which side initiated the trade.",
          tone: "neutral",
        },
        {
          id: "routed-cumulative",
          label: "Cumulative route balance",
          meaning:
            "Running buy-side volume minus sell-side volume in the loaded window. This is neither wallet balance nor profit and loss.",
          tone: "cumulative",
        },
      ],
      usage: [
        "Check transaction coverage before interpreting the slope.",
        "Compare repeated route direction and volume, not a single spike.",
        "Open the classified rows and Solscan links to verify large movements.",
      ],
      limitation:
        "The chart describes observed program flow. It cannot assign human intent to a router or predict the token price.",
    };
  }

  return {
    items: [
      {
        id: "wallet-buy",
        label: "Verified buy",
        meaning:
          "The inspected token entered the wallet while a quote asset left through a known swap venue.",
        tone: "positive",
      },
      {
        id: "wallet-sell",
        label: "Verified sell",
        meaning:
          "The inspected token left while SOL, USDC or another supported quote asset entered through a known swap venue.",
        tone: "negative",
      },
      {
        id: "wallet-other",
        label: "Transfer / burn",
        meaning:
          "A token movement occurred without enough swap evidence to call it a trade. Burns remain separate from transfers.",
        tone: "neutral",
      },
      {
        id: "wallet-cumulative",
        label: "Cumulative net flow",
        meaning:
          "Running target-token inflow minus outflow across loaded events. It is token movement, not USD profit and loss.",
        tone: "cumulative",
      },
    ],
    usage: [
      "Check coverage and the observed time window first.",
      "Compare trade size, frequency and the cumulative slope for a pattern.",
      "Verify important events in the transaction table and on Solscan.",
    ],
    limitation:
      "This is on-chain evidence from the loaded window, not financial advice, a price forecast or proof of future intent.",
  };
}
