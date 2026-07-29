import React from "react";
import { Send, Twitter } from "lucide-react";
import {
  BULLISH_MULE_TELEGRAM_URL,
  BULLISH_MULE_X_URL,
} from "@/lib/bullishMule/brand";

export default function Footer() {
  const open = (url: string) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="flex flex-col items-center justify-center space-y-4 px-4 py-10 text-white">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => open(BULLISH_MULE_X_URL)}
          className="rounded-full bg-gradient-to-r from-lime-500 to-amber-400 p-2 text-black opacity-90 transition-opacity hover:opacity-100"
          aria-label="Bullish Mule on X"
        >
          <Twitter size={24} />
        </button>
        <button
          type="button"
          onClick={() => open(BULLISH_MULE_TELEGRAM_URL)}
          className="rounded-full bg-gradient-to-r from-lime-500 to-amber-400 p-2 text-black opacity-90 transition-opacity hover:opacity-100"
          aria-label="Bullish Mule on Telegram"
        >
          <Send size={24} />
        </button>
      </div>
      <p className="text-center text-sm text-gray-400">© 2026 Bullish Mule. All rights reserved.</p>
      <p className="max-w-2xl text-center text-xs text-gray-500">
        Memecoins are highly volatile. Bullish Mule provides informational tools,
        not investment advice. Verify every mint and make independent decisions.
      </p>
    </footer>
  );
}
