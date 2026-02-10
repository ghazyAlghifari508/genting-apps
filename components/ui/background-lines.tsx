"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundLines = ({
  children,
  className,
  svgOptions,
}: {
  children?: React.ReactNode;
  className?: string;
  svgOptions?: React.SVGProps<SVGSVGElement>;
}) => {
  return (
    <div className={cn("relative min-h-screen w-full flex flex-col", className)}>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="opacity-20"
          {...svgOptions}
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <motion.line
              key={i}
              x1="0"
              y1={i * 5}
              x2="100"
              y2={i * 5}
              stroke="url(#line-gradient)"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              className="text-cerulean/30"
            />
          ))}
        </svg>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
