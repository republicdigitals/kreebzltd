"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isVisible] = useState(true);
  const pathname = usePathname();

  // Mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the cursor position
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    document.body.classList.add("hide-native-cursor");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - (label ? 40 : 16));
      cursorY.set(e.clientY - (label ? 20 : 16));
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.classList.remove("hide-native-cursor");
    };
  }, [cursorX, cursorY, label]);

  // Hook into interactive elements globally — and [data-cursor] labels
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(labelled?.dataset.cursor ?? null);
      setIsHovered(
        !!labelled ||
          target.tagName.toLowerCase() === "a" ||
          target.tagName.toLowerCase() === "button" ||
          target.tagName.toLowerCase() === "input" ||
          !!target.closest("a") ||
          !!target.closest("button")
      );
    };

    window.addEventListener("mouseover", handleMouseOver);

    // Un-hover when clicking a link that changes page
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
      setLabel(null);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // The cursor is hidden on mobile via CSS (hidden md:flex).
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Dot / hovered ring */}
      <motion.div
        className={`rounded-full mix-blend-difference ${label ? "opacity-0" : ""}`}
        animate={{
          width: isHovered ? 32 : 16,
          height: isHovered ? 32 : 16,
          backgroundColor: isHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.8)",
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 20 },
          height: { type: "spring", stiffness: 300, damping: 20 },
          backgroundColor: { duration: 0.2 },
          opacity: { duration: 0.15 },
        }}
      />
      {/* Labelled pill — gold, ink text, e.g. "View" / "Play" */}
      <motion.div
        className="absolute rounded-full bg-gold text-ink-fixed flex items-center justify-center eyebrow font-medium"
        animate={{
          width: label ? 80 : 0,
          height: label ? 40 : 0,
          opacity: label ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        style={{ overflow: "hidden" }}
      >
        <span className="whitespace-nowrap text-[11px] tracking-[0.18em]">{label}</span>
      </motion.div>
    </motion.div>
  );
}
