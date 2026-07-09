import { motion } from "framer-motion";

export function LeviEntranceImage() {
  return (
    <motion.div
      aria-hidden="true"
      className="levi-hero-art"
      initial={{ opacity: 0, y: 84, scale: 0.88, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
    >
      <span className="levi-hero-art-ring" />
      <motion.img
        src="/levi-avatar.png"
        alt=""
        className="levi-hero-art-image"
        animate={{ y: [0, -8, 0], rotate: [0, 0.35, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="levi-hero-art-caption">THE WHITE BULL / LEVI</span>
    </motion.div>
  );
}
