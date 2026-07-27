"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  const containerRef = useRef<HTMLElement>(null);
  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    if (eyebrow) {
      tl.from(".header-eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    }
    
    tl.from(".header-title", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, eyebrow ? "-=0.5" : 0);
    
    if (subtitle) {
      tl.from(".header-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.7");
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-obsidian pt-40 pb-20 lg:pt-48 lg:pb-24 border-b border-border/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        {eyebrow && (
          <p className="header-eyebrow uppercase text-gold-light/70 tracking-[0.3em] text-[11px] mb-6">
            {eyebrow}
          </p>
        )}
        <h1 className="header-title font-serif text-off-white font-light text-[clamp(40px,6vw,80px)] leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="header-subtitle mx-auto mt-8 font-sans text-muted tracking-wide max-w-2xl text-[16px] lg:text-[18px] leading-[1.7]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
