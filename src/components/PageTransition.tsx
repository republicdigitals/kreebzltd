"use client";

import { motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight route transition — a short fade + slight rise, inspired by
 * Apple's site transitions. The previous double-layer column wipe blocked
 * content for ~1.5s on every navigation, which felt rigid.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full flex-1 flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
}
