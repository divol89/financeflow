// import React, { FC, useState } from "react";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import ShimmerPrice from './shimmerprice/Shimmerprice';


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
//     { title: "Contact", link: "#contact us" },

//   ];

//   const handleMenuItemClick = (link: string) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-center items-center  z-5 w-full h-full lg:space-x-10 lg:grid  grid-flow-row grid-cols-2 lg:pr-32 lg:pt-10">

//       <div className="justify-start  pt-20 items-center mr-10 pr-8 lg:pt-12 cursor-pointer  h-full ">
//         <img src="img/logotipo.png" alt="logo" className="h-35 w-80" />
//       </div>
      
// <ul className="text-white lg:w-2/4 lg:flex hidden cursor-pointer list-none  justify-end items-end flex-none pl-14 text-1xl   space-x-6 text-2xl  col-start-2">
// <div className="text-sm pr-10">
//           <ShimmerPrice  /> {/* Añade el componente ShimmerPrice aquí */}
//       </div>
//    {menuItems.map((item, index) => (
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
//       <NavBarItem
//         title="Presale"
//         classprops="font-extrabold hover:text-yellow-400" // Agrega la clase "font-extrabold" para el estilo "extrabold"
//         onClick={() => handleMenuItemClick("/tokenflow")}
//       /> 
     
//     </ul>
    
  
//     <div className="flex h-full w-full justify-end mt-12 mr-4 md:pt-10">
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
//         <ul className="font-bold z-10 fixed top-0 right-0 p-0 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white">
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
//         <NavBarItem
//           title="Presale"
//           classprops="my-5 text-lg hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/tokenflow")}
//         />
//         <div className="">
//           <ShimmerPrice  /> {/* Añade el componente ShimmerPrice aquí */}
//       </div>
//       </ul>
//     )}
    
//     </div>
    
//   </nav>
//   );
// };

// export default Navbar;


////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { FC, useState } from "react";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import ShimmerPrice from './shimmerprice/Shimmerprice';
// import  Modal  from "./Modal";
// import AdminLogin from './AdminLogin';
// import { TokenContextProvider } from '../pages/contexts/TokenContext';

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
//   const [showModal, setShowModal] = useState(false);

//   const menuItems = [
//     { title: "Contact", link: "#contact us" },
//   ];

//   const handleMenuItemClick = (link: string) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-center items-center  z-5 w-full h-full lg:space-x-10 lg:grid  grid-flow-row grid-cols-2 lg:pr-32 lg:pt-10">
//       <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
//         <TokenContextProvider>
//           <AdminLogin />
//         </TokenContextProvider>
//       </Modal>

//       <div className="justify-start  pt-20 items-center mr-10 pr-8 lg:pt-12 pl-6 cursor-pointer  h-2/1 ">
//         <img src="img/logotipo.png" alt="logo" className="h-35 w-80" />
//       </div>
      
//       <ul className="text-white lg:w-2/4 lg:flex hidden cursor-pointer list-none  justify-end items-end flex-none pl-14 text-1xl   space-x-6 text-2xl  col-start-2 lg:">
//         <div className="text-sm pr-10">
//           <ShimmerPrice  />
//         </div>
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops="font-extrabold hover:text-yellow-400"
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="Añadir Token"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => setShowModal(true)}
//         />
//         <NavBarItem
//           title="FlowSwap"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//         <NavBarItem
//           title="Docs"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/whitepaper")}
//         />
//         <NavBarItem
//           title="Presale"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/tokenflow")}
//         />
//       </ul>

//       <div className="flex h-full w-full justify-end mt-12 mr-4 md:pt-10">
//         {!toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(true)}
//           />
//         )}
//         {toggleMenu && (
//           <HiMenuAlt4
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(false)}
//           />
//         )}
//         {toggleMenu && (
//           <ul className="font-bold z-10 fixed top-0 right-0 p-0 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white">
//             <li className="text-xl w-full my-2">
//               <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//             </li>
//             {menuItems.map((item, index) => (
//               <NavBarItem
//                 key={index}
//                 title={item.title}
//                 classprops="my-5 text-lg hover:text-yellow-400"
//                 onClick={() => handleMenuItemClick(item.link)}
//               />
//             ))}
//             <NavBarItem
//               title="FlowSwap"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/swap")}
//             />
//             <NavBarItem
//               title="Docs"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/whitepaper")}
//             />
//             <NavBarItem
//               title="Presale"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/tokenflow")}
//             />
//             <NavBarItem
//               title="Añadir Token"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => setShowModal(true)}
//             />
//             <div className="">
//               <ShimmerPrice  />
//             </div>
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



////////////////////////////////////////////////////////////////
// import React, { FC, useState } from "react";
// import { useRouter } from "next/router";
// import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import ShimmerPrice from './shimmerprice/Shimmerprice';
// import  Modal  from "./Modal";
// import AdminLogin from './AdminLogin';
// import { TokenContextProvider } from '../pages/contexts/TokenContext';

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
//   const [showModal, setShowModal] = useState(false);

//   const menuItems = [
//     { title: "Contact", link: "#contact us" },
//   ];

//   const handleMenuItemClick = (link: string) => {
//     router.push(link);
//     setToggleMenu(false);
//   };

//   return (
//     <nav className="flex justify-between  items-center w-full lg:space-x-10 lg:pr-32 lg:pt-10 h-full z-5">
//       <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
//         <TokenContextProvider>
//           <AdminLogin />
//         </TokenContextProvider>
//       </Modal>

//       <div className="mr-10 pr-8 lg:pt-12 pl-6 cursor-pointer h-1/2 lg:h-1/4 lg:flex lg:items-center lg:justify-center">
//         <img src="img/logotipo.png" alt="logo" className="h-auto w-auto max-h-35 max-w-80 lg:max-w-full lg:max-h-full" />
//         </div>
        
//         <ul className="text-white hidden lg:flex list-none justify-end items-center flex-none pl-14 text-1xl space-x-6 text-2xl col-start-2">
//         <div className="text-sm pr-10">
//         </div>
//         {menuItems.map((item, index) => (
//           <NavBarItem
//             key={index}
//             title={item.title}
//             classprops="font-extrabold hover:text-yellow-400"
//             onClick={() => handleMenuItemClick(item.link)}
//           />
//         ))}
//         <NavBarItem
//           title="Añadir Token"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => setShowModal(true)}
//         />
//         <NavBarItem
//           title="FlowSwap"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/swap")}
//         />
//         <NavBarItem
//           title="Docs"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/whitepaper")}
//         />
//         <NavBarItem
//           title="Presale"
//           classprops="font-extrabold hover:text-yellow-400"
//           onClick={() => handleMenuItemClick("/tokenflow")}
//         />
//       </ul>

//       <div className="flex h-full w-full justify-end mt-12 mr-4 md:pt-10">
//         {!toggleMenu && (
//           <HiMenuAlt3
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(true)}
//           />
//         )}
//         {toggleMenu && (
//           <HiMenuAlt4
//             fontSize={28}
//             className="text-white lg:hidden cursor-pointer"
//             onClick={() => setToggleMenu(false)}
//           />
//         )}
//         {toggleMenu && (
//           <ul className="font-bold z-10 fixed top-0 right-0 p-0 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white">
//             <li className="text-xl w-full my-2">
//               <AiOutlineCloseCircle onClick={() => setToggleMenu(false)} />
//             </li>
//             {menuItems.map((item, index) => (
//               <NavBarItem
//                 key={index}
//                 title={item.title}
//                 classprops="my-5 text-lg hover:text-yellow-400"
//                 onClick={() => handleMenuItemClick(item.link)}
//               />
//             ))}
//             <NavBarItem
//               title="FlowSwap"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/swap")}
//             />
//             <NavBarItem
//               title="Docs"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/whitepaper")}
//             />
//             <NavBarItem
//               title="Presale"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => handleMenuItemClick("/tokenflow")}
//             />
//             <NavBarItem
//               title="Añadir Token"
//               classprops="my-5 text-lg hover:text-yellow-400"
//               onClick={() => setShowModal(true)}
//             />
//             <div >
//             </div>
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { HiMenuAlt3, HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineCloseCircle } from "react-icons/ai";
// import ShimmerPrice from './shimmerprice/Shimmerprice';
import  Modal  from "./Modal";
import AdminLogin from './AdminLogin';
import { TokenContextProvider } from '../contexts/TokenContext';
import Image from 'next/image';


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

  const menuItems = [
    { title: "Contact", link: "#contact us" },
  ];

  const handleMenuItemClick = (link: string) => {
    router.push(link);
    setToggleMenu(false);
  };

  return (
    <nav className="flex  justify-between items-center w-full lg:px-10 h-full z-5 lg:pt-16 ">
      <Modal showModal={showModal} closeModal={() => setShowModal(false)}>
        <TokenContextProvider>
          <AdminLogin />
        </TokenContextProvider>
      </Modal>

      <Image src="/img/logotipo.png" alt="logo" width={500} height={300} />
      <ul className="text-white cursor-pointer hidden lg:flex list-none justify-end items-center flex-none pl-14 text-1xl space-x-6 text-2xl col-start-2">
        <div className="text-sm pr-10">
          {/* <ShimmerPrice  /> */}
        </div>
        {menuItems.map((item, index) => (
          <NavBarItem
            key={index}
            title={item.title}
            classprops="font-extrabold hover:text-yellow-400"
            onClick={() => handleMenuItemClick(item.link)}
          />
        ))}
        <NavBarItem
          title="Listing"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => setShowModal(true)}
        />
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
        {/* <NavBarItem
          title="Presale"
          classprops="font-extrabold hover:text-yellow-400"
          onClick={() => handleMenuItemClick("/tokenflow")}
        /> */}
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
          <ul className="font-bold z-10 fixed top-0 right-0 p-0 w-[auto] h-[auto] shadow-2xl lg:hidden list-none flex flex-col justify-start items-end rounded-lg bg-gray-400 text-white">
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
            {/* <NavBarItem
              title="Presale"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => handleMenuItemClick("/tokenflow")}
            /> */}
            <NavBarItem
              title="Listing"
              classprops="my-5 text-lg hover:text-yellow-400"
              onClick={() => setShowModal(true)}
            />
            <div >
              {/* <ShimmerPrice  /> */}
            </div>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
