import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import ShimmerPrice from "./shimmerprice/Shimmerprice";
import Image from "next/image";
import { FaBook, FaRocket, FaShieldAlt, FaTerminal } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import NavbarWalletButton from "./NavbarWalletButton";

interface NavbarProps {
  openModal: () => void;
}

const Navbar: FC<NavbarProps> = ({ openModal }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setMenuOpen(false);
  };

  const handleLaunchApp = () => {
    openModal();
    setMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 ${
          isScrolled
            ? "bg-black/40 backdrop-blur-xl shadow-lg h-20"
            : "bg-transparent backdrop-blur-sm h-24"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center lg:w-1/3">
              <div className="relative w-[80px] h-[24px] mr-2 transition-transform hover:scale-105">
                <Image
                  src="/img/logotipo.png"
                  alt="logo"
                  layout="fill"
                  objectFit="contain"
                  className="drop-shadow-glow"
                />
              </div>
              <h1 className="ml-4 text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient tracking-tight">
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
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:from-green-500 hover:to-blue-600 transition-all duration-300 cursor-pointer flex items-center text-sm"
                  onClick={() => handleMenuItemClick("/validation")}
                >
                  <FaShieldAlt className="mr-1" />
                  Validate
                </li>
                <li
                  className="bg-[#00e47a] text-black font-bold py-2 px-4 rounded-full hover:bg-[#63ff9b] transition-all duration-300 cursor-pointer flex items-center text-sm shadow-[0_0_18px_rgba(0,228,122,0.35)]"
                  onClick={() => handleMenuItemClick("/matrix")}
                >
                  <FaTerminal className="mr-1" />
                  Matrix
                </li>
                <li
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer flex items-center text-sm"
                  onClick={handleLaunchApp}
                >
                  <FaRocket className="mr-1" />
                  App
                </li>
                <NavbarWalletButton
                  variant="desktop"
                  onClick={handleLaunchApp}
                />
              </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none p-2"
              >
                <HiMenuAlt3 className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 lg:hidden"
            style={{
              zIndex: 99999,
              background:
                "linear-gradient(180deg, #0a0a0a 0%, #1a0a20 50%, #0a0a15 100%)",
              height: "100vh",
              width: "100vw",
            }}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <HiX className="h-6 w-6 text-white" />
            </button>

            {/* Content */}
            <div className="h-full w-full flex flex-col px-8 pt-24 pb-8 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center justify-center mb-10">
                <div className="relative w-14 h-14 mr-4">
                  <Image
                    src="/img/logotipo.png"
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  Flow Finance
                </span>
              </div>

              {/* Price Display */}
              <div className="mb-8 p-5 bg-white/10 rounded-2xl border border-white/20">
                <ShimmerPrice />
              </div>

              {/* Navigation Links */}
              <div className="space-y-4 flex-1">
                <button
                  onClick={() => handleMenuItemClick("/whitepaper")}
                  className="w-full flex items-center p-5 rounded-2xl bg-white/15 border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-500/30 flex items-center justify-center mr-4">
                    <FaBook className="text-purple-300 text-xl" />
                  </div>
                  <span className="text-white font-semibold text-xl">
                    Documentación
                  </span>
                </button>

                <button
                  onClick={() => handleMenuItemClick("/validation")}
                  className="w-full flex items-center p-5 rounded-2xl bg-white/15 border border-white/20 hover:bg-white/20 transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 rounded-full bg-blue-500/30 flex items-center justify-center mr-4">
                    <FaShieldAlt className="text-blue-300 text-xl" />
                  </div>
                  <span className="text-white font-semibold text-xl">
                    Validar Token
                  </span>
                </button>

                <button
                  onClick={() => handleMenuItemClick("/matrix")}
                  className="w-full flex items-center p-5 rounded-2xl bg-[#00e47a]/20 border border-[#00e47a]/50 hover:bg-[#00e47a]/30 transition-all active:scale-[0.98] shadow-[0_0_22px_rgba(0,228,122,0.18)]"
                >
                  <div className="w-14 h-14 rounded-full bg-[#00e47a]/30 flex items-center justify-center mr-4">
                    <FaTerminal className="text-[#63ff9b] text-xl" />
                  </div>
                  <span className="text-white font-semibold text-xl">
                    Matrix Tracker
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mt-8">
                <button
                  onClick={handleLaunchApp}
                  className="w-full py-6 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-purple-500/40 hover:shadow-purple-500/60 transition-all active:scale-[0.98]"
                >
                  <FaRocket className="text-xl" />
                  Abrir Aplicación
                </button>

                <NavbarWalletButton
                  variant="mobile"
                  onClick={handleLaunchApp}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
