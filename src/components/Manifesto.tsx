"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORDS = "We don't list everything. We stand behind what we list.".split(" ");
const ACCENT_WORDS = new Set(["list.", "behind"]);

/**
 * The thesis in one breath — oversized serif, each word rising out of
 * dim ink as the reader scrolls. The pause between words is the point.
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const words = sectionRef.current?.querySelectorAll(".manifesto-word");
      if (!words?.length) return;

      gsap.fromTo(
        words,
        { opacity: 0.12, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 border-t border-border/10"
      aria-label="Our standard"
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-5 mb-14">
          <span className="gold-rule w-12" />
          <p className="eyebrow text-gold">The standard</p>
        </div>
        <p className="display-serif-sm text-off-white max-w-[16ch] leading-[1.12]">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`manifesto-word inline-block mr-[0.28em] ${
                ACCENT_WORDS.has(word) ? "accent-italic text-gold-light" : ""
              }`}
            >
              {word}
            </span>
          ))}
        </p>
        <p className="mt-12 text-lead text-muted max-w-xl">
          Every residence, every itinerary, every managed home is inspected
          and answerable to a named principal — not a call centre.
        </p>
      </div>
    </section>
  );
}
