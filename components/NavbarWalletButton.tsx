import React from "react";
import { AiOutlineWallet } from "react-icons/ai";

type NavbarWalletButtonVariant = "desktop" | "mobile";

interface NavbarWalletButtonProps {
  variant: NavbarWalletButtonVariant;
  onClick: () => void;
}

const desktopClassName =
  "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer flex items-center text-sm";

const mobileClassName =
  "w-full py-6 px-6 rounded-2xl bg-white/20 border-2 border-white/30 text-white font-semibold text-xl flex items-center justify-center gap-3 hover:bg-white/30 transition-all active:scale-[0.98]";

const NavbarWalletButton: React.FC<NavbarWalletButtonProps> = ({
  variant,
  onClick,
}) => {
  if (variant === "desktop") {
    return (
      <li className={desktopClassName} onClick={onClick}>
        <AiOutlineWallet className="mr-1" />
        <span className="whitespace-nowrap">Connect Wallet</span>
      </li>
    );
  }

  return (
    <button onClick={onClick} className={mobileClassName}>
      <AiOutlineWallet className="text-2xl" />
      Conectar Wallet
    </button>
  );
};

export default NavbarWalletButton;
