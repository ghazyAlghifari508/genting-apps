"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}) => {
  const {
    id = "sparkles",
    className,
    background = "transparent",
    minSize = 0.6,
    maxSize = 1.4,
    particleDensity = 100,
    particleColor = "#FFF",
    speed = 1,
  } = props;

  const particles = useMemo(() => {
    return Array.from({ length: particleDensity }).map((_, i) => ({
      id: i,
      x: pseudoRandom(i + 1) * 100,
      y: pseudoRandom(i + 101) * 100,
      size: pseudoRandom(i + 201) * (maxSize - minSize) + minSize,
      duration: pseudoRandom(i + 301) * 5 + 2 / speed,
      delay: pseudoRandom(i + 401) * 5,
    }));
  }, [particleDensity, minSize, maxSize, speed]);

  return (
    <div data-sparkle-id={id} className={cn("absolute inset-0 overflow-hidden", className)} style={{ background }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: particleColor,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
