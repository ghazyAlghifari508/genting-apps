"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-full relative w-full bg-white dark:bg-black overflow-hidden",
        containerClassName
      )}
    >
      <div className="h-full w-full">
        <DotGrid
          dotSize={dotSize}
          animationSpeed={animationSpeed}
          opacities={opacities}
          colors={colors}
          showGradient={showGradient}
        />
      </div>
    </div>
  );
};

const DotGrid = ({
  dotSize = 3,
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  showGradient = true,
}: {
  dotSize?: number;
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  showGradient?: boolean;
}) => {
  const [activeDots, setActiveDots] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActiveDots = Array.from({ length: 5 }).map(() =>
        Math.floor(Math.random() * 100)
      );
      setActiveDots(newActiveDots);
    }, 1000 * animationSpeed);

    return () => clearInterval(interval);
  }, [animationSpeed]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-10 gap-4">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full bg-cerulean/20"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: activeDots.includes(i)
                ? `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`
                : undefined,
            }}
            animate={{
              scale: activeDots.includes(i) ? [1, 1.5, 1] : 1,
              opacity: activeDots.includes(i) ? 1 : 0.2,
            }}
          />
        ))}
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-white dark:to-black" />
      )}
    </div>
  );
};
