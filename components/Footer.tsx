import React from "react";
import { Send, Twitter } from "lucide-react";
import { AGENT_K9_TELEGRAM_URL, AGENT_K9_X_URL } from "@/lib/agentK9/brand";

export default function Footer() {
  const open = (url: string) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="flex flex-col items-center justify-center space-y-4 px-4 py-10 text-white">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => open(AGENT_K9_X_URL)}
          className="rounded-full bg-gradient-to-r from-red-700 to-amber-500 p-2 text-white opacity-80 transition-opacity hover:opacity-100"
          aria-label="Twitter"
        >
          <Twitter size={24} />
        </button>
        <button
          type="button"
          onClick={() => open(AGENT_K9_TELEGRAM_URL)}
          className="rounded-full bg-gradient-to-r from-red-700 to-amber-500 p-2 text-white opacity-80 transition-opacity hover:opacity-100"
          aria-label="Telegram"
        >
          <Send size={24} />
        </button>
      </div>
      <p className="text-center text-sm text-gray-400">© 2026 Flow-Finance Adventures. All rights reserved.</p>
      <p className="max-w-2xl text-center text-xs text-gray-500">
        Disclaimer: Cryptocurrency investments are subject to high market risks. Flow-Finance Adventures is not responsible for losses resulting from decisions based on the information provided. Research independently and trade with caution.
      </p>
    </footer>
  );
}
