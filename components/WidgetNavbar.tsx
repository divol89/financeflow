// import React from "react";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineApple, AiOutlineCloseCircle } from "react-icons/ai";


// const NavBarItem = ({ title, classprops }) => (
//   <li className={`mx-4  ${classprops}`}>{title}</li>
// );

// const Navbar = () => {
//   const [toggleMenu, setToggleMenu] = React.useState(false);

//   // Definimos una variable que contiene el array con los elementos del menú
//   const menuItems = [
//     <a href="https://twitter.com/BenqiClub">Twitter</a>,
//     <a href="https://t.me/BENQIFANS">Telegram</a>,
//     <a href="https://coin360.com/?group=all">Markets</a>,
//     <a href="https://benqi.fi/">Staking Rewards</a>,
//   ];

//   return (
//     <nav className=" flex justify-between pb-2 mb-2  ">
//       {/* <div className="flex justify-start mr-16 pr-2 pb-4 cursor-pointer">
//         <img src="assets/logo.png" alt="logo" />
//       </div> */}
//       <div className="bg-fondo-waves bg-cover bg-center w-full h-2/4 absolute top-0 left-0 z-[-1] "></div>
//        <ul className=" text-white lg:flex hidden list-none flex-row justify-between items-center  flex-none ">
//         {/* Usamos la variable menuItems para mapear los elementos del menú */}
//         {menuItems.map((item, index) => (
//           <NavBarItem key={item + index} title={item} />
//         ))}
//       </ul>
//       <div className="flex h-full w-full justify-end mt-14 mr-4 md:pt-10">
//         {!toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(true)}
//           />
//         )}
//         {toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(false)}
//           />
//         )}
//         {toggleMenu && (
//           <ul className="  font-bold z-10 fixed -top-0.1 -right-0 p-0.5 w-[auto] h-[auto] shadow-2xl  lg:hidden list-none  flex flex-col justify-start items-end rounded-auto blue-glassmorphism text-white animate-slide-out">
//             <li className="text-xl w-full my-2">
//               <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//             </li>
//             {/* Usamos la misma variable menuItems para mapear los elementos del menú */}
//             {menuItems.map((item, index) => (
//               <NavBarItem
//                 key={item + index}
//                 title={item}
//                 classprops="my-5 text-lg"
//               />
//             ))}
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineApple, AiOutlineCloseCircle } from "react-icons/ai";

// const NavBarItem = ({ title, classprops, onClick }) => (
//   <li className={`mx-4 ${classprops}`} onClick={onClick}>
//     {title}
//   </li>
// );

// const Navbar = () => {
//   const router = useRouter();
//   const [toggleMenu, setToggleMenu] = React.useState(false);

//   const menuItems = [
//     { title: "Twitter", link: "https://twitter.com/BenqiClub" },
//     { title: "Telegram", link: "https://t.me/BENQIFANS" },
//     { title: "Markets", link: "https://coin360.com/?group=all" },
//     { title: "Staking Rewards", link: "https://benqi.fi/" },
//   ];

//   const handleMenuItemClick = (link) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex  justify-between p-2 mb-2 z-5 ">
//       <div className="flex justify-start mr-16 pr-2 pb-4 cursor-pointer">
//         <img src="assets/logo.png" alt="logo" />
//       </div>
//       <ul className="text-white lg:flex hidden list-none flex-row justify-between items-center flex-none">
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops=""
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="FlowSwap"
//           classprops=""
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//       </ul>
//       <div className="flex h-full w-full justify-end mt-14 mr-4 md:pt-10">
//         {!toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(true)}
//           />
//         )}
//         {toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(false)}
//           />
//         )}
//         {toggleMenu && (
//           <ul className="font-bold z-10 fixed -top-0.1 -right-0 p-0.5 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-auto blue-glassmorphism text-white animate-slide-out">
//             <li className="text-xl w-full my-2">
//               <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//             </li>
//             {menuItems.map((item, index) => (
//               <NavBarItem
//                 key={index}
//                 title={item.title}
//                 classprops="my-5 text-lg"
//                 onClick={() => handleMenuItemClick(item.link)}
//               />
//             ))}
//             <NavBarItem
//               title="FlowSwap"
//               classprops="my-5 text-lg"
//               onClick={() => handleMenuItemClick("/swap")}
//             />
//           </ul>
//         )}
//         <div>
          
//         </div>
//       </div>
      
//     </nav>
//   );
// };

// export default Navbar;


// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineApple, AiOutlineCloseCircle } from "react-icons/ai";

// const NavBarItem = ({ title, classprops, onClick }) => (
//   <li className={`mx-4 ${classprops}`} onClick={onClick}>
//     {title}
//   </li>
// );

// const Navbar = () => {
//   const router = useRouter();
//   const [toggleMenu, setToggleMenu] = React.useState(false);

//   const menuItems = [
//     { title: "Twitter", link: "https://twitter.com/BenqiClub" },
//     { title: "Telegram", link: "https://t.me/BENQIFANS" },
//     { title: "Markets", link: "https://coin360.com/?group=all" },
//     { title: "Staking Rewards", link: "https://benqi.fi/" },
//   ];

//   const handleMenuItemClick = (link) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-between pb-2 mb-2 z-5 bg-fondo-waves bg-cover bg-center w-full h-2/4 absolute top-0 left-0 z-[-1]">
//       <div className="flex justify-start mr-16 pr-2 pb-4 cursor-pointer relative">
//         <img src="assets/logo.png" alt="logo" className="h-[400px] w-[400]" />
//       </div>

//       <ul className="text-white lg:flex hidden list-none flex-row justify-between items-center flex-none">
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops=""
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="FlowSwap"
//           classprops=""
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//       </ul>
//       <div className="flex h-full w-full justify-end mt-14 mr-4 md:pt-10">
//         {!toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(true)}
//           />
//         )}
//         {toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(false)}
//           />
//         )}
//         {toggleMenu && (
//           <ul className="font-bold z-10 fixed -top-0.1 -right-0 p-0.5 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-auto blue-glassmorphism text-white animate-slide-out">
//             <li className="text-xl w-full my-2">
//               <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//             </li>
//             {menuItems.map((item, index) => (
//               <NavBarItem
//                 key={index}
//                 title={item.title}
//                 classprops="my-5 text-lg"
//                 onClick={() => handleMenuItemClick(item.link)}
//               />
//             ))}
//             <NavBarItem
//               title="FlowSwap"
//               classprops="my-5 text-lg"
//               onClick={() => handleMenuItemClick("/swap")}
//             />
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { FC, useState } from "react";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineApple, AiOutlineCloseCircle } from "react-icons/ai";

// interface NavBarItemProps {
//   title: string;
//   classprops: string;
//   onClick: () => void;
// }

// const NavBarItem: FC<NavBarItemProps> = ({ title, classprops, onClick }) => (
//   <li className={`mx-4 ${classprops}`} onClick={onClick}>
//     {title}
//   </li>
// );

// const Navbar: FC = () => {
//   const router = useRouter();
//   const [toggleMenu, setToggleMenu] = useState(false);

//   const menuItems = [
//     { title: "Twitter", link: "https://twitter.com/BenqiClub" },
//     { title: "Telegram", link: "https://t.me/BENQIFANS" },
//     { title: "Markets", link: "https://coin360.com/?group=all" },
//     { title: "Staking Rewards", link: "https://benqi.fi/" },
//   ];

//   const handleMenuItemClick = (link: string) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-between pb-2 mb-2 z-5 bg-fondo-waves bg-cover bg-center w-full h-2/3 lg:h-screen absolute top-0 left-0 z-[-1] md:h-1/1">
//       <div className="flex justify-start mr-16 pr-2 pb-4 cursor-pointer relative">
//         <img src="assets/logo.png" alt="logo" className="h-24 w-24 md:h-32 md:w-32 lg:h-48 lg:w-48" />
//       </div>

//       <ul className="text-white lg:flex hidden list-none flex-row justify-between items-center flex-none">
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops=""
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="FlowSwap"
//           classprops=""
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//       </ul>

//       {/* ... */}
//     </nav>
//   );
// };

// export default Navbar;

// import React, { FC, useState } from "react";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineCloseCircle } from "react-icons/ai";

// interface NavBarItemProps {
//   title: string;
//   classprops: string;
//   onClick: () => void;
// }

// const NavBarItem: FC<NavBarItemProps> = ({ title, classprops, onClick }) => (
//   <li className={`mx-4 ${classprops}`} onClick={onClick}>
//     {title}
//   </li>
// );

// const Navbar: FC = () => {
//   const router = useRouter();
//   const [toggleMenu, setToggleMenu] = useState(false);

//   const menuItems = [
//     { title: "", link: "" },

//   ];

//   const handleMenuItemClick = (link: string) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-center  items-center pb-0 mb-0 z-5 w-full h-full top-0 left-0 ">
//     <div className="justify-start items-center mr-16 pr-8 lg:pb-14 cursor-pointer relative pt-20">
//       <img src="img/logotipo.png" alt="logo" className="h-35 w-80  " />
//     </div>
  
//     <ul className="text-white lg:flex hidden cursor-pointer list-none justify-end items-end  flex-none pl-14 text-2xl ">
//       {menuItems.map((item, index) => (
//         <NavBarItem
//           key={index}
//           title={item.title}
//           classprops="font-extrabold hover:text-yellow-400" // Agrega la clase "font-extrabold" para el estilo "extrabold"
//           onClick={() => handleMenuItemClick(item.link)}
//         />
//       ))}
//       <NavBarItem 
//         title="FlowSwap"
//         classprops="font-extrabold hover:text-yellow-400" // Agrega la clase "font-extrabold" para el estilo "extrabold"
//         onClick={() => handleMenuItemClick("/swap")}
//       />
//       <NavBarItem
//         title="Docs"
//         classprops="font-extrabold hover:text-yellow-400" // Agrega la clase "font-extrabold" para el estilo "extrabold"
//         onClick={() => handleMenuItemClick("/whitepaper")}
//       />
//     </ul>
  
//     <div className="flex h-full w-full justify-end mt-14 mr-4 md:pt-10">
//       {!toggleMenu && (
//         <HiMenuAlt3
//           fontSize={28}
//           className="text-white lg:hidden cursor-pointer"
//           onClick={() => setToggleMenu(true)}
//         />
//       )}
//       {toggleMenu && (
//         <HiMenuAlt4
//           fontSize={28}
//           className="text-white lg:hidden cursor-pointer"
//           onClick={() => setToggleMenu(false)}
//         />
//       )}
//       {toggleMenu && (
//         <ul className="font-bold z-10 fixed top-0 right-0 p-4 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white mt-2">
//         <li className="text-xl w-full my-2">
//           <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//         </li>
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops="my-5 text-lg hover:text-yellow-400"
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="FlowSwap"
//           classprops="my-5 text-lg hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//         <NavBarItem
//           title="Docs"
//           classprops="my-5 text-lg hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/whitepaper")}
//         />
//       </ul>
//     )}
//     </div>
//   </nav>
//   );
// };

// export default Navbar;



////////////////////////////////////////////////////////////////

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
        <NavBarItem
          title="Docs"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/whitepaper")}
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
            <NavBarItem
              title="Docs"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/whitepaper")}
            />
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
