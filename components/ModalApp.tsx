import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

const ModalApp: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

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
            className="rounded-lg p-6 w-11/12 max-w-6xl  relative z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute -top-2 lg:mt-0 mt-24 right-2 p-2  hover:text-gray-800 z-50 text-white"
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
            <div className="flex flex-col scale-75 lg:scale-100 md:flex-row justify-center items-center gap-6">
              {[
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
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col w-full items-center"
                >
                  <button
                    onClick={() => router.push(item.path)}
                    className="w-full md:w-64 aspect-[4/3] relative overflow-hidden rounded-lg hover:shadow-xl transition-shadow shadow-lg shadow-cyan-300 duration-300"
                  >
                    <Image
                      src={item.img}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalApp;
