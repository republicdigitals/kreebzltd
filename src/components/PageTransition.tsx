"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Symmetrical stagger for the 5 columns (edges move last, center moves first)
const STAGGER_DELAYS = [0.15, 0.05, 0, 0.05, 0.15];

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Use pathname as the route key so transitions only trigger on actual page changes,
  // not on query parameter updates (which should be seamless).
  const routeKey = pathname;

  // Fix scroll position on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [routeKey]);

  return (
    <div className="relative w-full h-full">
      {/* 
        The Luxury Staggered Wipe
        A double-layer wipe (Obsidian followed by Gold) using 5 staggered columns
        for a high-end, award-winning cinematic reveal.
      */}
      <div 
        key={`curtain-container-${routeKey}`}
        className="fixed inset-0 z-[70] pointer-events-none"
      >
        {/* Logo Layer: Centered, above everything, fades out gracefully */}
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute inset-0 z-[72] flex items-center justify-center"
        >
          <Image 
            src="/kreebz-logo.png" 
            alt="Kreebz" 
            width={120} 
            height={120} 
            priority
            className="w-16 md:w-24 h-auto object-contain"
          />
        </motion.div>

        {/* Layer 1 (Bottom): Gold Columns */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            className="absolute top-0 h-full bg-gold z-[70]"
            style={{ width: "20.1%", left: `${i * 20}%` }} // 20.1% prevents 1px gaps
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.5 + STAGGER_DELAYS[i],
            }}
          />
        ))}

        {/* Layer 2 (Top): Obsidian Columns */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`obsidian-${i}`}
            className="absolute top-0 h-full bg-obsidian z-[71]"
            style={{ width: "20.1%", left: `${i * 20}%` }}
            initial={{ y: "0%" }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 1.2,
              ease: [0.76, 0, 0.24, 1],
              delay: 0.4 + STAGGER_DELAYS[i], // Starts before Gold to reveal the Gold layer
            }}
          />
        ))}
      </div>

      {/* The Page Content: Subtle fade and slide up */}
      <motion.div
        key={`page-${routeKey}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.8 // Waits for the wipe to clear the center
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
