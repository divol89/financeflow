import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
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

  const menuItems = [
    { title: "", link: "" },
    // Agrega más elementos de menú aquí si es necesario
  ];

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setToggleMenu(false);
  };

  return (
    <nav className="flex justify-center items-center pb-0 mb-0 z-5 w-full h-full top-0 left-0">
      <div className="justify-start items-center mr-16 pr-8 lg:pb-14 cursor-pointer relative pt-20">
        <Image
          src="/img/logotipo.png"
          alt="logo"
          width={80}
          height={35}
          className="h-35 w-80"
          priority={true}
        />
      </div>

      <ul className="text-white lg:flex hidden cursor-pointer list-none justify-end items-end flex-none pl-14 text-2xl">
        {menuItems.map((item, index) => (
          <NavBarItem
            key={index}
            title={item.title}
            classprops="font-extrabold hover:text-yellow-400"
            onClick={() => handleMenuItemClick(item.link)}
          />
        ))}
        <NavBarItem
          title="FlowSwap"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/swap")}
        />
      </ul>

      <div className="flex h-full w-full justify-end mt-14 mr-4 md:pt-10">
        {!toggleMenu ? (
          <HiMenuAlt3
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className="text-white lg:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul className="font-bold z-10 fixed top-0 right-0 p-4 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white mt-2">
            <li className="text-xl w-full my-2">
              <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
            </li>
            {menuItems.map((item, index) => (
              <NavBarItem
                key={index}
                title={item.title}
                classprops="my-5 text-lg hover:text-yellow-400"
                onClick={() => handleMenuItemClick(item.link)}
              />
            ))}
            <NavBarItem
              title="FlowSwap"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/swap")}
            />
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
