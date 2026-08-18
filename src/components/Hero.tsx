"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RevealText from "./RevealText";
import type { Property } from "@/data/properties";

interface HeroProps {
  properties?: Property[];
}

export default function Hero({}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Slow cinematic pan for the background image
    gsap.to(".hero-bg-img", {
      scale: 1.05,
      duration: 15,
      ease: "none",
      repeat: -1,
      yoyo: true
    });

    // Deep parallax scrolling effect
    gsap.to(".hero-bg-img", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: "25%",
      ease: "none"
    });

    // Staggered cinematic text reveals
    tl.from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
    })
    .from(buttonRef.current, {
      y: 20,
      opacity: 0,
      duration: 1.5,
    }, "-=1.0")
    .from(scrollIndicatorRef.current, {
      opacity: 0,
      duration: 2,
    }, "-=1");
    
    // Subtle breathing animation for scroll indicator arrow
    gsap.to(".scroll-arrow", {
      y: 8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="hero" className="relative h-screen w-full overflow-hidden bg-obsidian">
      {/* Background Setup */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image with slow cinematic scale */}
        <div className="hero-bg-img absolute inset-0 w-full h-[130%] -top-[15%]">
          <Image
            src="/images/hero-placeholder.jpg"
            alt="Luxury property at night"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        
        {/* Dark overlay ensuring perfect contrast for the white text */}
        <div className="absolute inset-0 z-10 bg-obsidian/30" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian" />
      </div>

      {/* Content — High-end editorial prompt */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-[5vw]">
        <div className="text-center w-full max-w-[1000px] mx-auto">
          <p
            ref={subtitleRef}
            className="eyebrow text-gold-light/80 mb-6"
          >
            Exclusive Properties
          </p>

          <h1
            ref={titleRef}
            className="text-off-white display-xl"
          >
            <RevealText text="Elevating the standard of luxury living." delay={0.5} />
          </h1>

          <div ref={buttonRef} className="mt-14 flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto">
            <Link
              href="/properties"
              className={cn(
                "group relative flex items-center justify-center px-12 py-5",
                "bg-gold text-obsidian uppercase tracking-[0.2em] text-[11px] font-bold",
                "transition-all duration-500 hover:bg-gold-light hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-obsidian"
              )}
            >
              Enter The Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        ref={scrollIndicatorRef}
        onClick={scrollDown}
        className={cn(
          "group absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4",
          "text-off-white/50 hover:text-gold focus:outline-none transition-colors duration-500"
        )}
        aria-label="Scroll down to explore"
      >
        <span className="uppercase text-[9px] tracking-[0.4em] opacity-80">
          Scroll
        </span>
        <span className="scroll-arrow flex items-center justify-center w-10 h-10 rounded-full border border-border-strong group-hover:border-gold transition-colors duration-500">
          <ChevronDown size={16} strokeWidth={1.5} />
        </span>
      </button>
    </section>
  );
}
