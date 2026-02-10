"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (beamsRef.current) {
      // Logic for background beams animation can be added here if needed
      // Aceternity usually has a complex SVG/Canvas logic, but for simplicity
      // and performance in a health app, we can use a refined CSS-based version or
      // follow the standard Aceternity implementation if needed.
    }
  }, []);

  return (
    <div
      ref={beamsRef}
      className={cn(
        "absolute inset-0 z-0 h-full w-full overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
        className
      )}
    >
      <svg
        className="absolute h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--genting-cerulean)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="none" />
        {/* Animated beams can be added as paths here */}
        {[...Array(10)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${-200 + i * 200} 0 L ${800 + i * 200} 1000`}
            stroke="url(#beam-gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Simple motion path wrapper since we need framer-motion
import { motion } from "framer-motion";
const motion_path = motion.path;
