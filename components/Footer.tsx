import React from "react";
import { Send, Twitter } from "lucide-react";

export default function Footer() {
  const open = (url: string) => {
    if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="flex flex-col items-center justify-center space-y-4 px-4 py-10 text-white">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => open("https://x.com/financeflowx")}
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-2 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Twitter"
        >
          <Twitter size={24} />
        </button>
        <button
          type="button"
          onClick={() => open("https://t.me/FinanceFlowx/1")}
          className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-2 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Telegram"
        >
          <Send size={24} />
        </button>
      </div>
      <p className="text-center text-sm text-gray-400">© 2024 Flow Finance. All rights reserved.</p>
      <p className="max-w-2xl text-center text-xs text-gray-500">
        Disclaimer: Cryptocurrency investments are subject to high market risks. Flow Finance is not responsible for any direct, indirect or consequential losses as a result of the investments made based on the information provided. Please be aware of the risks involved and trade with caution.
      </p>
    </footer>
  );
}
