"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SearchModal from "./SearchModal";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RevealText from "./RevealText";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  
  const containerRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const handleSelect = (location: string) => {
    const params = new URLSearchParams({ location });
    router.push(`/properties?${params.toString()}`);
  };

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
            A Curated Collection By Folio & IBJ
          </p>

          <h1
            ref={titleRef}
            className="text-off-white font-serif font-light leading-[1.1] tracking-normal text-[clamp(42px,7vw,100px)]"
          >
            <RevealText text="Masterpieces of modern living." delay={0.5} />
          </h1>

          <div ref={buttonRef} className="mt-14">
            <button
              onClick={() => setIsModalOpen(true)}
              className={cn(
                "group relative inline-flex items-center justify-center px-10 py-5",
                "bg-black/40 border border-gold/30 rounded-sm uppercase tracking-[0.2em] text-[10px] font-semibold text-gold-light backdrop-blur-md shadow-2xl",
                "transition-all duration-700 hover:bg-black/60 hover:border-gold/60 hover:text-gold",
                "focus:outline-none focus:ring-1 focus:ring-gold"
              )}
              aria-expanded={isModalOpen}
              aria-haspopup="dialog"
            >
              Explore The Portfolio
            </button>
          </div>

          <SearchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleSelect}
          />
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
