// import React from "react";
// import Link from 'next/link';


// const Welcome = () => {
  
  
//   return (
//     <div className="relative   flex z-[-1]   justify-center  pt-40 items-center h-auto sm:h-screen  bg-no-repeat bg-cover bg-center">
//     <div className="text-center w-full h-full pb-44  pl-40  lg:pb-56 lg:justify-center  flex flex-col justify-center items-center  md:pl-60">
//         <h1 className="text-white  text-3xl pb-8  lg:pb-36 md:text-5xl lg:text-7xl lg:pl-48 font-extrabold">
//           Finance <br />
//           Flow<strong className="text-yellow-500">.</strong>
//         </h1>
//         <Link href="https://finance-flow.xyz/whitepaper">
//       <button className="mt-4.5 mb-5 bg-yellow-500 text-white py-0.7 px-4 rounded-lg md:py-0.6 md:px-3 lg:ml-48 hover:bg-blue-700 transition-all">
//         <strong className="text-sm md:text-2xl">Learn More</strong>
//       </button>
//     </Link>
//       </div>
//     </div>
//   );
// };

// export default Welcome;






import React from "react";
import Link from 'next/link';

const Welcome = () => {
  return (
    <div className="relative flex justify-center pt-40 items-center h-auto sm:h-screen bg-no-repeat bg-cover bg-center">
      <div className="text-center w-full h-full pb-44 pl-40 lg:pb-56 lg:justify-center flex flex-col justify-center items-center md:pl-60">
        <h1 className="text-white text-3xl pb-8 lg:pb-36 md:text-5xl lg:text-7xl lg:pl-48 font-extrabold">
          Finance <br />
          Flow<strong className="text-yellow-500">.</strong>
        </h1>
        <Link href="https://finance-flow.xyz/whitepaper">
          <button className="mt-4.5 mb-5 bg-yellow-500 text-white py-0.7 px-4 rounded-lg md:py-0.6 md:px-3 lg:ml-48 hover:bg-blue-700 transition-all">
            <strong className="text-sm md:text-2xl">Learn More</strong>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;












