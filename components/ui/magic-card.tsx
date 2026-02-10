"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export const MagicCard = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group/magic-card relative flex h-full w-full overflow-hidden rounded-3xl bg-white dark:bg-black p-0.5",
        containerClassName
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/magic-card:opacity-100"
        style={{
          background: useMotionValue(
            `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, var(--genting-cerulean), transparent 40%)`
          ),
        }}
      />
      <div
        className={cn(
          "relative z-10 h-full w-full rounded-[prev-2px] bg-white dark:bg-black",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
