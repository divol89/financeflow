import { useState, useEffect, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

interface Dice3DProps {
  size?: number;
  autoRoll?: boolean;
  autoRollInterval?: number;
  onRoll?: (value: number) => void;
  glowColor?: string;
}

// Face rotations for each dice value
const faceRotations: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 180, y: 0 },
};

export default function Dice3D({
  size = 120,
  autoRoll = true,
  autoRollInterval = 5000,
  onRoll,
  glowColor = "rgba(234, 179, 8, 0.5)",
}: Dice3DProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [currentFace, setCurrentFace] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  const rollDice = useCallback(async () => {
    if (isRolling) return;

    setIsRolling(true);

    // Generate random result
    const result = Math.floor(Math.random() * 6) + 1;

    // Calculate dramatic rotation (multiple full rotations + final position)
    const spins = 3 + Math.random() * 2; // 3-5 full rotations
    const targetRotation = faceRotations[result];

    // Animate with dramatic spins
    await controls.start({
      rotateX: [
        rotation.x,
        rotation.x + 360 * spins + (Math.random() - 0.5) * 180,
        targetRotation.x,
      ],
      rotateY: [
        rotation.y,
        rotation.y + 360 * spins + (Math.random() - 0.5) * 180,
        targetRotation.y,
      ],
      rotateZ: [0, 360 * (Math.random() > 0.5 ? 1 : -1), 0],
      transition: {
        duration: 2,
        times: [0, 0.7, 1],
        ease: ["easeOut", "easeInOut"],
      },
    });

    setRotation(targetRotation);
    setCurrentFace(result);
    setIsRolling(false);
    onRoll?.(result);
  }, [isRolling, controls, rotation, onRoll]);

  // Auto roll effect
  useEffect(() => {
    if (!autoRoll) return;

    // Initial roll after a short delay
    const initialTimeout = setTimeout(rollDice, 1000);

    // Periodic auto-roll
    const interval = setInterval(rollDice, autoRollInterval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [autoRoll, autoRollInterval, rollDice]);

  // Dot positions for each face
  const dotPositions: Record<number, { x: number; y: number }[]> = {
    1: [{ x: 50, y: 50 }],
    2: [
      { x: 25, y: 25 },
      { x: 75, y: 75 },
    ],
    3: [
      { x: 25, y: 25 },
      { x: 50, y: 50 },
      { x: 75, y: 75 },
    ],
    4: [
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 25, y: 75 },
      { x: 75, y: 75 },
    ],
    5: [
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 50, y: 50 },
      { x: 25, y: 75 },
      { x: 75, y: 75 },
    ],
    6: [
      { x: 25, y: 25 },
      { x: 75, y: 25 },
      { x: 25, y: 50 },
      { x: 75, y: 50 },
      { x: 25, y: 75 },
      { x: 75, y: 75 },
    ],
  };

  const DiceFace = ({
    value,
    transform,
  }: {
    value: number;
    transform: string;
  }) => (
    <div
      className="absolute w-full h-full rounded-2xl flex items-center justify-center"
      style={{
        transform,
        backfaceVisibility: "hidden",
        background: "linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)",
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
      }}
    >
      <div className="relative w-[80%] h-[80%]">
        {dotPositions[value].map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: "18%",
              height: "18%",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              background: "linear-gradient(145deg, #fcd34d 0%, #f59e0b 100%)",
              boxShadow:
                "0 0 15px rgba(251, 191, 36, 0.6), inset 0 -2px 4px rgba(0,0,0,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-50 animate-pulse"
        style={{
          background: glowColor,
          transform: "scale(1.5)",
        }}
      />

      {/* Interactive container */}
      <motion.div
        className="relative cursor-pointer"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        animate={controls}
        whileHover={{ scale: isRolling ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={rollDice}
        initial={{ rotateX: 0, rotateY: 0 }}
      >
        {/* Front - 1 */}
        <DiceFace value={1} transform={`translateZ(${size / 2}px)`} />

        {/* Back - 6 */}
        <DiceFace
          value={6}
          transform={`rotateY(180deg) translateZ(${size / 2}px)`}
        />

        {/* Right - 2 */}
        <DiceFace
          value={2}
          transform={`rotateY(90deg) translateZ(${size / 2}px)`}
        />

        {/* Left - 5 */}
        <DiceFace
          value={5}
          transform={`rotateY(-90deg) translateZ(${size / 2}px)`}
        />

        {/* Top - 3 */}
        <DiceFace
          value={3}
          transform={`rotateX(90deg) translateZ(${size / 2}px)`}
        />

        {/* Bottom - 4 */}
        <DiceFace
          value={4}
          transform={`rotateX(-90deg) translateZ(${size / 2}px)`}
        />
      </motion.div>

      {/* Click hint */}
      {!isRolling && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Click to roll!
        </motion.div>
      )}

      {/* Rolling indicator */}
      {isRolling && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-yellow-400 text-sm font-bold animate-pulse">
            Rolling...
          </span>
        </motion.div>
      )}

      {/* Last result display */}
      {!isRolling && currentFace > 0 && (
        <motion.div
          key={currentFace}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <span className="text-3xl font-black text-yellow-400 drop-shadow-glow">
            {currentFace}
          </span>
        </motion.div>
      )}
    </div>
  );
}
