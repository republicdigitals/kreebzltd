"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const TEXT_FIELD_SELECTOR = "input, textarea, select, [contenteditable='true']";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], [data-cursor]";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [overTextField, setOverTextField] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const pathname = usePathname();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Dot tracks tightly — near-instant, no mush
  const dotX = useSpring(cursorX, { damping: 50, stiffness: 900, mass: 0.2 });
  const dotY = useSpring(cursorY, { damping: 50, stiffness: 900, mass: 0.2 });
  // Ring trails a beat behind — that's where the "physical" feel lives
  const ringX = useSpring(cursorX, { damping: 28, stiffness: 250, mass: 0.6 });
  const ringY = useSpring(cursorY, { damping: 28, stiffness: 250, mass: 0.6 });

  useEffect(() => {
    document.body.classList.add("hide-native-cursor");

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHasMoved(true);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setOverTextField(!!target.closest(TEXT_FIELD_SELECTOR));
      const labelled = target.closest("[data-cursor]") as HTMLElement | null;
      setLabel(labelled?.dataset.cursor ?? null);
      setIsHovered(!!target.closest(INTERACTIVE_SELECTOR));
    };

    const handleDown = () => setIsDown(true);
    const handleUp = () => setIsDown(false);
    const handleLeave = () => setHasMoved(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.body.classList.remove("hide-native-cursor");
    };
  }, [cursorX, cursorY]);

  // Reset hover state after client-side navigation (render-time reset)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsHovered(false);
    setLabel(null);
  }

  const visible = hasMoved && !overTextField;
  // Centering offsets: dot is 6px, ring 36px, pill ~80x40
  const dotOffset = -3;
  const ringOffset = -18;

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border border-gold/60"
          animate={{
            width: isHovered ? 52 : 36,
            height: isHovered ? 52 : 36,
            x: isHovered ? ringOffset - 8 : ringOffset,
            y: isHovered ? ringOffset - 8 : ringOffset,
            opacity: visible ? (isHovered ? 1 : 0.5) : 0,
            scale: isDown ? 0.85 : 1,
            backgroundColor: isHovered
              ? "rgba(200,161,94,0.10)"
              : "rgba(200,161,94,0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        />
      </motion.div>

      {/* Center dot / labelled pill */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className={`rounded-full bg-gold ${label ? "opacity-0" : ""}`}
          animate={{
            width: isHovered ? 4 : 6,
            height: isHovered ? 4 : 6,
            x: isHovered ? -2 : dotOffset,
            y: isHovered ? -2 : dotOffset,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.div
          className="absolute rounded-full bg-gold text-ink-fixed flex items-center justify-center"
          animate={{
            width: label ? 72 : 0,
            height: label ? 32 : 0,
            x: label ? -36 : 0,
            opacity: label ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ overflow: "hidden" }}
        >
          <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.22em] uppercase">
            {label}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}
