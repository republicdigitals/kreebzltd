"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * PageTransition — wraps page content with a subtle fade-up animation
 * on mount. Applied in the (main) layout so every public route gets
 * a premium entry transition.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
