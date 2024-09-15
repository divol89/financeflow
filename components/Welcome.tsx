import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
// import ShimmerPrice from "./shimmerprice/Shimmerprice";

interface WelcomeProps {
  openModal: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ openModal }) => {
  const preventImageInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="container peque:mt-10 py-4 md:py-14 lg:mb-[-6rem] lg:scale-100 mx-auto top-[3rem] overflow-visible lg:pl-62 lg:px-44 px-4 pt-8 lg:pt-32 text-white flex flex-col md:flex-row items-center justify-center z-10">
      <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center md:items-start">
        {/* <div className="laser-gun-container mt-[10rem] md:mt-[22rem] largo:mt-[17rem] extralargo:mt-[15rem] lg:mt-[15rem] absolute left-[-50vw] right-[-50vw] w-[200vw]">
          <div className="laser-gun w-full mt-5 lg:mt-20"></div>
        </div> */}

        {/* <h1 className="text-3xl md:text-6xl md:mt-10 font-bold mb-3 md:mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient text-center md:text-left">
          Flow Finance
        </h1> */}

        <p className="text-lg mt-[2rem] md:mt-[2rem] md:text-2xl text-gray-300 mb-0 md:mb-8 animate-fadeIn text-center md:text-left">
          Empower your investments, vote for success, reap the rewards.
        </p>
        {/* <p className="text-sm md:text-lg text-purple-400 mb-3 md:mb-8 animate-fadeIn animation-delay-300 text-center md:text-left">
          EVR system empowering the users.
        </p> */}
        <Button
          onClick={openModal}
          className="bg-gradient-to-r from-purple-600 mt-4 lg:mt-0 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm md:text-lg px-4 md:px-8 py-2 md:py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-glow animate-fadeIn animation-delay-600"
        >
          Get started <ArrowRight className="ml-2" />
        </Button>
      </div>
      <div
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click
        onMouseDown={preventImageInteraction}
        onTouchStart={preventImageInteraction}
        onClick={preventImageInteraction}
        onDragStart={preventImageInteraction}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          pointerEvents: "none",
        }}
        className="md:w-1/2 flex lg:mb-0 scale-75 md:scale-100 justify-center z-20"
      >
        <div className="pt-[0rem]">
          <Image
            src="/img/WAVES.png"
            alt="WAVES"
            width={200}
            height={200}
            className="max-w-full z-1 h-auto animate-float md:w-[380px] md:h-[380px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
