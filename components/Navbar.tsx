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
  <li className={`mx-4 ${classprops}`} onClick={onClick}>
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
    <nav className="flex lg:flex-wrap  justify-center md:flex-row  w-full  h-full z-5 ">
      <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
        <TokenContextProvider>
          <AdminLogin />
        </TokenContextProvider>
      </Modal>

      <Image src="/img/logotipo.png" alt="logo" width={200} height={200} />
      <ul className="text-white cursor-pointer hidden lg:flex list-none justify-end items-center flex-none pl-14 text-1xl space-x-6 text-2xl col-start-2">
        <div className="text-sm pr-10">
          <ShimmerPrice />
        </div>

        {/* <NavBarItem
          title="Listing"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => setShowModal(true)}
        /> */}
        {/* <NavBarItem
              title="Parchisi"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/play")}
            /> */}
        <NavBarItem
          title="FlowSwap"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/swap")}
        />
        <NavBarItem
          title="Docs"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/whitepaper")}
        />
        <NavBarItem
          title="Presale"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/tokenflow")}
        />
        <NavBarItem
          title="FlowFarm"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/flowfarm")}
        />
      </ul>

      <div className="flex h-full w-full justify-end mt-12 mr-4 md:pt-10">
        {!toggleMenu && (
          <HiMenuAlt3
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul className="font-bold z-10 fixed top-0 right-0 mt-4 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-wrap wrap  items-end justify-center rounded-2xl bg-gradient-to-r from-yellow-600  to-red-400   bg-cover text-white">
            <li className="text-xl pl-2 w-full my-2">
              <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
            </li>

            <NavBarItem
              title="FlowSwap"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/swap")}
            />
            {/* <NavBarItem
              title="Parchis"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/play")}
            /> */}
            <NavBarItem
              title="Docs"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/whitepaper")}
            />
            <NavBarItem
              title="Presale"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/tokenflow")}
            />
            <NavBarItem
              title="FlowFarm"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/flowfarm")}
            />
            {/* <NavBarItem
              title="Listing"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => setShowModal(true)}
            /> */}
            <div>
              <ShimmerPrice />
            </div>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
