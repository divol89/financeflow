import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Welcome({ openModal }: { openModal?: () => void }) {
  const block = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <section className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 py-8 md:flex-row md:py-16">
      <div className="mb-4 flex flex-col items-center md:mb-0 md:w-1/2 md:items-start">
        <p className="mt-8 mb-0 max-w-xl animate-fade-in-scroll text-center text-lg leading-relaxed text-gray-300 md:mb-8 md:mt-8 md:text-left md:text-2xl">
          Empower your investments, vote for success, reap the rewards.
        </p>
        <button
          type="button"
          onClick={openModal}
          className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-pink-500/30 md:px-8 md:py-4 md:text-lg lg:mt-0"
        >
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>

      <div
        onContextMenu={block}
        onMouseDown={block}
        onTouchStart={block}
        onClick={block}
        onDragStart={block}
        style={{ userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", pointerEvents: "none" }}
        className="z-20 flex scale-75 justify-center md:w-1/2 md:scale-100 lg:mb-0"
      >
        <div className="pt-0">
          <Image
            src="/img/WAVES.png"
            alt="WAVES"
            width={420}
            height={420}
            priority
            className="z-10 h-auto max-w-full animate-float md:h-[380px] md:w-[380px]"
          />
        </div>
      </div>
    </section>
  );
}
