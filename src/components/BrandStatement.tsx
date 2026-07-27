"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

export default function BrandStatement() {
  const containerRef = useRef<HTMLElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.fromTo(".statement-parallax", 
      { y: 60 },
      {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    gsap.from(".statement-reveal", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="dark-mode py-32 lg:py-48 px-6 lg:px-12 bg-obsidian text-center overflow-hidden relative">
      <div className="statement-parallax max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        <p className="statement-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-12">
          The Kreebz Philosophy
        </p>
        <h2 className="statement-reveal font-serif text-off-white text-[clamp(42px,6vw,96px)] leading-[1.05] font-light mx-auto" style={{ maxWidth: "18ch" }}>
          Curating the world&apos;s most extraordinary properties for a discerning few.
        </h2>
      </div>
    </section>
  );
}
