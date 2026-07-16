import { motion } from "framer-motion";
import Image from "next/image";
import { AGENT_K9_IMAGE_PATH } from "@/lib/agentK9/brand";

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
      <motion.div
        className="levi-hero-art-image"
        animate={{ y: [0, -8, 0], rotate: [0, 0.35, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={AGENT_K9_IMAGE_PATH}
          alt="Agent K9"
          width={1254}
          height={1254}
          priority
          sizes="(max-width: 767px) 260px, (max-width: 1023px) 400px, 500px"
        />
      </motion.div>
      <span className="levi-hero-art-caption">AGENT K9 / SOLANA</span>
    </motion.div>
  );
}
