import { motion } from "framer-motion";

export function LeviEntranceImage() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center px-4 lg:justify-end lg:px-16"
      initial={{ opacity: 0, y: 110, scale: 0.76, filter: "blur(12px)" }}
      animate={{ opacity: 0.72, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
    >
      <motion.img
        src="/levi-avatar.png"
        alt=""
        className="h-auto w-48 select-none drop-shadow-[0_0_42px_rgba(52,211,153,0.42)] sm:w-60 lg:w-80"
        animate={{ y: [0, -10, 0], scale: [1, 1.025, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
