import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaBook, FaTerminal } from "react-icons/fa";

interface LauncherItem {
  name: string;
  path: string;
  img?: string;
  icon?: IconType;
}

const launcherItems: LauncherItem[] = [
  {
    name: "Docs",
    path: "/whitepaper",
    icon: FaBook,
  },
  {
    name: "MagicSale",
    img: "/img/magicsale.jpg",
    path: "/MagicSale",
  },
  {
    name: "MagicLauncher",
    img: "/img/magiclauncher.jpg",
    path: "/MagicLauncher",
  },
  {
    name: "MagicPump",
    img: "/img/magicpump.jpg",
    path: "/MagicPump",
  },
  {
    name: "Crazy Dice",
    img: "/levi-ban-system.png",
    path: "/games",
  },
  {
    name: "LEVI Dice",
    img: "/levi-ban-system.png",
    path: "/games/levi-dice",
  },
];

const ModalApp: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-opacity-70 backdrop-blur-md z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-[60] w-[calc(100%-1.5rem)] max-w-md rounded-2xl border border-cyan-300/20 bg-[#121c38]/95 p-5 shadow-[0_0_30px_rgba(34,211,238,0.18)] lg:max-w-6xl lg:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute right-3 top-3 z-50 rounded-full p-2 text-white hover:bg-white/10"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="pt-8 lg:pt-4">
              <button
                onClick={() => handleNavigate("/matrix")}
                className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-[#00e47a]/70 bg-[#00e47a] px-4 py-4 font-mono text-base font-black uppercase tracking-wide text-black shadow-[0_0_28px_rgba(0,228,122,0.38)] transition-all hover:bg-[#63ff9b] active:scale-[0.98]"
              >
                <FaTerminal className="text-xl" />
                Matrix Tracker
              </button>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-6 lg:gap-5">
                {launcherItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.path)}
                      className="group relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-white/10 text-center text-lg font-semibold text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.12)] transition-all hover:border-cyan-300/60 hover:bg-white/15 active:scale-[0.98] lg:h-36"
                      aria-label={item.name}
                    >
                      {item.img ? (
                        <Image
                          src={item.img}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="opacity-35 transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : Icon ? (
                        <Icon className="absolute top-3 text-xl text-cyan-300/50" />
                      ) : null}
                      <span className="relative z-10 px-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-[#63ff9b]/80">
                Matrix ops and games ready
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalApp;
