import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ShimmerPrice from "./shimmerprice/Shimmerprice";
import Modal from "./Modal";
import AdminLogin from "./AdminLogin";
import { TokenContextProvider } from "../contexts/TokenContext";
import Image from "next/image";

interface NavBarItemProps {
  title: string;
  classprops: string;
  onClick: () => void;
}

const NavBarItem: FC<NavBarItemProps> = ({ title, classprops, onClick }) => (
  <li className={`mx-4 ${classprops} text-flow-gradient`} onClick={onClick}>
    {title}
  </li>
);

const Navbar: FC = () => {
  const router = useRouter();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setToggleMenu(false);
  };

  return (
    <nav className="flex flex-col lg:flex-row items-center lg:items-center justify-between w-full px-4 lg:px-24 py-4">
      <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
        <TokenContextProvider>
          <AdminLogin />
        </TokenContextProvider>
      </Modal>

      <div className="flex justify-between items-center w-full lg:w-auto">
        <div className="lg:mr-auto">
          <Image
            src="/img/logotipo.png"
            alt="logo"
            width={150}
            height={150}
            className="lg:ml-4"
          />
        </div>
        <div className="lg:hidden">
          {!toggleMenu ? (
            <HiMenuAlt3
              fontSize={28}
              className="text-white cursor-pointer"
              onClick={() => setToggleMenu(true)}
            />
          ) : (
            <HiMenuAlt4
              fontSize={28}
              className="text-white cursor-pointer"
              onClick={() => setToggleMenu(false)}
            />
          )}
        </div>
      </div>

      <ul className="text-white cursor-pointer hidden lg:flex list-none items-center space-x-6 text-2xl">
        <div className="text-sm pr-10">
          <ShimmerPrice />
        </div>
        <NavBarItem
          title="Docs"
          classprops="font-extrabold hover:text-yellow-400 transition-colors duration-300"
          onClick={() => handleMenuItemClick("/whitepaper")}
        />
        <NavBarItem
          title="MagicSale"
          classprops="font-extrabold hover:text-yellow-400 transition-colors duration-300"
          onClick={() => handleMenuItemClick("/MagicSale")}
        />
        <NavBarItem
          title="MagicLauncher"
          classprops="font-extrabold hover:text-yellow-400 transition-colors duration-300"
          onClick={() => handleMenuItemClick("/MagicLauncher")}
        />
        <li
          className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-2 px-4 rounded hover:from-purple-500 hover:to-pink-600 transition-all duration-300 cursor-pointer"
          onClick={() => handleMenuItemClick("/MagicPump")}
        >
          MagicPump
        </li>
      </ul>

      {toggleMenu && (
        <div className="fixed top-0 left-0 w-full h-auto z-50 blue-glassmorphism">
          <div className="flex justify-end p-4">
            <AiOutlineCloseCircle
              onClick={() => setToggleMenu(false)}
              className="text-white text-2xl cursor-pointer"
            />
          </div>
          <ul className="flex flex-wrap justify-center items-center p-4">
            <NavBarItem
              title="Docs"
              classprops="m-2 text-lg bg-gray-800 px-4 py-2 rounded"
              onClick={() => handleMenuItemClick("/whitepaper")}
            />
            <NavBarItem
              title="MagicSale"
              classprops="m-2 text-lg bg-gray-800 px-4 py-2 rounded"
              onClick={() => handleMenuItemClick("/MagicSale")}
            />
            <NavBarItem
              title="MagicLauncher"
              classprops="m-2 text-lg bg-gray-800 px-4 py-2 rounded"
              onClick={() => handleMenuItemClick("/MagicLauncher")}
            />
            <li
              className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-2 px-4 rounded hover:from-purple-500 hover:to-pink-600 transition-all duration-300 cursor-pointer m-2 text-lg"
              onClick={() => handleMenuItemClick("/MagicPump")}
            >
              MagicPump
            </li>
          </ul>
          <div className="flex justify-center mt-4 pb-4">
            <ShimmerPrice />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
