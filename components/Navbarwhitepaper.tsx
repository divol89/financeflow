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
    { title: "Empowering Users", link: "#empowering users" },
    { title: "introduction", link: "#introduction" },
    { title: "LI.FI", link: "#lifi" },
    { title: "FlowSwap", link: "#flowswapdex" },
    { title: "Tokenomics", link: "#tokenomics" },
    { title: "Use Case", link: "#use case" },
    { title: "RoadMap", link: "#roadmap" },
    { title: "Shimmer Integration", link: "#shimmer-integration" },
    { title: "Conclusion", link: "#conclusion" },
  ];

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setToggleMenu(false);
  };

  return (
    <nav className="flex justify-start items-center  pb-0 mb-0 z-5 w-full h-full top-0 left-0">
      <div className="flex justify-start items-center  mr-16 pr-8 lg:pb-14 cursor-pointer relative pt-10 lg:ml-auto lg:pl-0">
        <Image
          src="/img/logotipo.png"
          alt="logo"
          width={500}
          height={300}
          className="h-35 w-contain"
        />
      </div>
      <div className="flex h-full w-full justify-end mt-10 mr-4  md:pt-10">
        {!toggleMenu && (
          <HiMenuAlt3
            fontSize={28}
            className="text-white lg: cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <HiMenuAlt4
            fontSize={28}
            className="text-white lg: cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        )}
        {toggleMenu && (
          <ul className="font-bold z-10 fixed top-0 right-0 p-4 w-[auto] h-[auto] shadow-2xl lg:list-none flex flex-col justify-start items-end rounded-lg lg:pt-22 lg:mt-60 lg:ml-44 bg-white text-black">
            <li className="text-xl w-full my-2">
              <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
            </li>
            {menuItems.map((item, index) => (
              <NavBarItem
                key={index}
                title={item.title}
                classprops="my-5 text-lg"
                onClick={() => handleMenuItemClick(item.link)}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
