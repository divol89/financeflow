import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { AiOutlineWallet } from "react-icons/ai";
import ShimmerPrice from "./shimmerprice/Shimmerprice";
import Image from "next/image";
import {
  useWeb3ModalAccount,
  useWeb3Modal,
  useDisconnect,
} from "@web3modal/ethers5/react";
import { FaBook, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";

interface NavbarProps {
  openModal: () => void;
}

const Navbar: FC<NavbarProps> = ({ openModal }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { address, isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        console.log(
          "Scroll position:",
          window.scrollY,
          "isScrolled:",
          scrolled
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Verifica el estado inicial

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setMenuOpen(false);
  };

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await open();
      } catch (error) {
        console.error("Failed to open wallet modal:", error);
      }
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLaunchApp = () => {
    openModal();
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black bg-opacity-70" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center lg:w-1/3">
            <Image
              src="/img/logotipo.png"
              alt="logo"
              width={80}
              height={24}
              className="mr-2"
            />
            <h1 className="text-2xl medium:ml-[2rem] medium:text-5xl mediumlarge:ml-[5rem] extralargo:ml-6 mediumbig:ml-[11rem] mt-10 lg:mt-0 md:ml-[1rem] md:items-center md:text-center md:text-3xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient">
              Flow Finance
            </h1>
          </div>
          <div className="hidden text-white lg:ml-[4rem] lg:scale-75 lg:flex items-center justify-center lg:w-1/2">
            <ShimmerPrice />
          </div>
          <div className="hidden lg:flex items-center justify-end lg:w-1/3">
            <ul className="flex items-center space-x-4">
              <li
                className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-2 px-4 rounded-full hover:from-blue-500 hover:to-purple-600 transition-all duration-300 cursor-pointer flex items-center text-sm"
                onClick={() => handleMenuItemClick("/whitepaper")}
              >
                <FaBook className="mr-1" />
                Docs
              </li>
              <li
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer flex items-center text-sm"
                onClick={handleLaunchApp}
              >
                <FaRocket className="mr-1" />
                App
              </li>
              <li
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer flex items-center text-sm"
                onClick={handleWalletConnection}
              >
                <AiOutlineWallet className="mr-1" />
                <span className="whitespace-nowrap">
                  {isConnected
                    ? truncateAddress(address || "")
                    : "Connect Wallet"}
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              <HiMenuAlt3 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <motion.div
        className="lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-full bg-gray-900 bg-opacity-70 shadow-lg"
        initial={{ x: "100%" }}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full p-10 overflow-y-auto">
          <div className="flex justify-end mb-8">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white focus:outline-none"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
          <ul className="space-y-6 flex flex-col items-center">
            <div className="mb-[6rem] text-white py-10 space-y-4">
              <ShimmerPrice />
            </div>
            <li
              className="bg-gradient-to-r from-purple-500 to-purple-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-500 hover:to-purple-600 transition-all duration-300 cursor-pointer flex items-center"
              onClick={() => handleMenuItemClick("/whitepaper")}
            >
              <FaBook className="mr-2" />
              Docs
            </li>
            <li
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer flex items-center justify-center"
              onClick={handleLaunchApp}
            >
              <FaRocket className="mr-2" />
              Launch App
            </li>
          </ul>

          <div className="mt-[10rem] ">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold py-1 px-4 rounded-lg shadow-md hover:from-purple-500 hover:to-pink-600 transition-all duration-300"
              onClick={handleWalletConnection}
            >
              <AiOutlineWallet className="inline-block mr-2" />
              {isConnected ? truncateAddress(address || "") : "Connect Wallet"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
