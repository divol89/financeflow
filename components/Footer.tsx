import React from "react";
import { FaTwitter, FaTelegram } from "react-icons/fa";

const Footer: React.FC = () => {
  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="w-full h-full   text-white">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="flex  space-x-4">
          <button
            onClick={() => handleSocialClick("https://x.com/financeflowx")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 p-2  rounded-full hover:opacity-80 transition-opacity opacity-70"
            aria-label="Twitter"
          >
            <FaTwitter size={24} />
          </button>
          <button
            onClick={() => handleSocialClick("https://t.me/FinanceFlowx/1")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full hover:opacity-80 transition-opacity opacity-70"
            aria-label="Telegram"
          >
            <FaTelegram size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center">
          © 2024 Flow Finance. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 text-center max-w-2xl">
          Disclaimer: Cryptocurrency investments are subject to high market
          risks. Flow Finance is not responsible for any direct, indirect or
          consequential losses as a result of the investments made based on the
          information provided. Please be aware of the risks involved and trade
          with caution.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
