// import React from "react";
// import WAVES from '../public/WAVES.png'; // Importa la ruta de tu archivo SVG


// const Welcome = () => {
//   return (
//     <div className=" flex flex-col  items-center w-full h-full">
//       <div className="text-center md:text-center lg:text-center ">
//       <h1 className=" text-white text-3xl font-bold  ">
//         Finance <br /> 
//       <strong className="flex  aling-start">Flow<strong className="text-yellow-500">.</strong></strong>
//       </h1>
//       </div>
//       <div
//       className="flex w-full justify-center flex-col p-4"
//       style={{
//         backgroundImage:`linear-gradient(rgba(0, 0.1, 0, 0.9), rgba(5, 4, 0.5, 0.5)), url(${WAVES.src})`,
//       }}>
//         <p className="text-3xl text-center text-gold p-4 cursor-pointer font-bold  box-border box-decoration-slice border-4 border-orange-400 border-solid animate-pulse">
//           Join us Now!
//         </p>
//         </div>
//         <div className="flex justify-center  items-center px-4 lg:px-0 py-2">
//   <p className="text-2xl text-white text-center bg-blue-500  rounded-md  m-8 font-extrabold">
//     <i className="text-yellow-300">FinanceFlow</i> is a pioneering force, advocating for the empowerment of junior developers, and fostering innovation in the world of{" "}
//     <strong className="text-blue-600">memecoins.</strong>
//   </p>
// </div>

    

// <section className="flex flex-wrap items-center lg:flex-row-reverse pt-2 pb-2">
//   <div className="w-full md:w-1/2">
//     <img src="assets/nuves.png" alt="Imagen" className="w-full" />
//   </div>
//   <div className="w-full md:w-1/2 px-4">
//     <h2 className="text-3xl text-white font-extrabold mb-4">What sets us apart?</h2>
//     <p className="text-lg font-bold text-white">
//       At the heart of FinanceFlow is our mission to provide junior developers with the tools and opportunities to create and actualize their own memecoins. We're firm believers in community and collaboration, and we're dedicated to creating an ecosystem where you can learn, grow, and collaborate.
//     </p>
//   </div>
// </section>

//     </div>
//   );
// };

// export default Welcome;
////////////////////////////////////////////////////////////////////////////
// import React from "react";

// const Welcome = () => {
//   return (
//     <div className="flex justify-between  mb-0 z-[-2] bg-fondo-waves pt-0 absolute bg-cover bg-center w-full h-2/3 lg:h-screen  top-16 left-0 md:min-h-screen lg:top-56  ">
//       <div className="flexl flex-col h-full w-full pt-36 ">
//         <h1 className="text-white text-2xl  text-center pt-10 pl-32  h-full w-full font-extrabold lg:text-8xl  md:text-4xl lg:text-end lg:pr-32">
//           Finance <br />
//          Flow<strong className="text-yellow-500">.</strong>
//         </h1>
       
//       </div>
     
        
//       {/* Resto del contenido */}
//     </div>
//   );
// };

// export default Welcome;

////////////////////////////////////////////////////////////////////////////////////////////////


// import React from "react";

// const Welcome = () => {
//   return (
//     <div className="relative flex  justify-center items-center h-screen  bg-fondo-waves  bg-no-repeat bg-center  bottom-0 bg-contain lg:h-2/1 overflow-hidden  ">
//       <div className="text-center w-full pb-16 pl-24">
//         <h1 className="text-white text-2xl md:text-4xl md:pl-24 lg:text-5xl lg:pl-36 font-extrabold">
//           Finance <br />
//           Flow<strong className="text-yellow-500">.</strong>
//         </h1>
//       </div>
//       {/* Resto del contenido */}
//     </div>
//   );
// };

// export default Welcome;


// import React from "react";

// const Welcome = () => {
//   return (
//     <div className="relative flex z-[-1] bottom-0 justify-center items-center h-screen bg-fondo-waves bg-no-repeat bg-center bg-contain  lg:overflow-hidden lg:bg-contain ">
//       <div className="text-center w-2/1 h-full pb-16 pl-36 flex flex-col justify-center items-center md:pl-60">
//         <h1 className="text-white text-2xl md:text-4xl lg:text-5xl lg:pl-48 font-extrabold">
//           Finance <br />
//           Flow<strong className="text-yellow-500">.</strong>

//         </h1>
//         <button className="mt-3.5 bg-yellow-500 text-white py-2 px-8 rounded-lg md:py-2 md:px-4 lg:ml-48  hover:bg-blue-700 transition-all ">
//           <strong className="text-sm md:text-4xl">Learn More</strong>
//         </button>
//         <div>
//         </div>
//       </div>
//       {/* Resto del contenido */}
//     </div>
//   );
// };

// export default Welcome;












import React from "react";
import Link from 'next/link';


const Welcome = () => {
  
  
  return (
    <div className="relative  bg-fondo-waves flex z-[-1]   justify-center  pt-40 items-center h-auto sm:h-screen  bg-no-repeat bg-cover bg-center ">
    <div className="text-center w-full h-full pb-44  pl-40  lg:pb-56 lg:justify-center  flex flex-col justify-center items-center  md:pl-60">
        <h1 className="text-white  text-3xl pb-8  lg:pb-36 md:text-5xl lg:text-7xl lg:pl-48 font-extrabold">
          Finance <br />
          Flow<strong className="text-yellow-500">.</strong>
        </h1>
        <Link href="http://localhost:3000/whitepaper">
      <button className="mt-4.5 mb-5 bg-yellow-500 text-white py-0.7 px-4 rounded-lg md:py-0.6 md:px-3 lg:ml-48 hover:bg-blue-700 transition-all">
        <strong className="text-sm md:text-2xl">Learn More</strong>
      </button>
    </Link>
        <div>
        </div>
      </div>
      {/* Resto del contenido */}
    </div>
  );
};

export default Welcome;










