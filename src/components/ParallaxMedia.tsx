"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Framed media with a two-stage entrance — a bottom-up clip reveal that
 * settles scale 1.08 → 1.00, then a slow scrub parallax (±`travel`%)
 * while the section crosses the viewport. Disabled on mobile widths
 * and for reduced-motion users, where media renders statically.
 */
export default function ParallaxMedia({
  children,
  className = "",
  travel = 10,
}: {
  children: React.ReactNode;
  className?: string;
  /** Percentage of frame height the media drifts while scrolling */
  travel?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const frame = frameRef.current;
      const media = mediaRef.current;
      if (!frame || !media) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        // Clip reveal on first entry
        gsap.fromTo(
          frame,
          { clipPath: "inset(18% 6% 18% 6%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 82%", once: true },
          }
        );
        gsap.fromTo(
          media,
          { scale: 1.08 },
          {
            scale: 1,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 82%", once: true },
          }
        );
        // Slow drift while crossing the viewport
        gsap.fromTo(
          media,
          { yPercent: -travel / 2 },
          {
            yPercent: travel / 2,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: frameRef, dependencies: [travel] }
  );

  if (reduced) {
    return <div className={`relative overflow-hidden ${className}`}>{children}</div>;
  }

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={mediaRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: `-${travel / 2 + 2}%`, bottom: `-${travel / 2 + 2}%`, height: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
