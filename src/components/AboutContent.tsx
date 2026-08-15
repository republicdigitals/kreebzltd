"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const pillars = [
  {
    title: "Official marketing partner",
    body: "We position every project with the precision it deserves.",
  },
  {
    title: "Facility management, held to your standard",
    body: "From estate operations to daily maintenance, a dedicated Kreebz principal stays present so your property is never left to chance.",
  },
  {
    title: "Lifestyle & resident care",
    body: "Private aviation, concierge services, and a trusted network of contractors — plumbers, electricians, and more — ready for residents whenever needed.",
  },
];

export default function AboutContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    // Reveal philosophy text
    gsap.from(".philosophy-text", {
      scrollTrigger: {
        trigger: ".philosophy-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
    
    // Reveal pillars
    gsap.from(".pillar-item", {
      scrollTrigger: {
        trigger: ".pillars-section",
        start: "top 75%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });
    
    // Reveal CTA
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    });

    // Deep parallax for Pitch Black block
    gsap.to(".pillars-bg", {
      scrollTrigger: {
        trigger: ".pillars-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
      y: "15%",
      ease: "none"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-obsidian">
      {/* Philosophy */}
      <section className="philosophy-section py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="philosophy-text font-serif text-off-white font-light leading-[1.6]" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
            Kreebz Ltd is the official marketing and facility management company for
            the most prestigious developers in the region. Beyond marketing and
            estate oversight, we deliver <span className="italic text-gold-light">private jet services, concierge care, and a trusted network of contractors</span> — so owners and residents are fully looked after.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="pillars-section bg-obsidian py-32 lg:py-48 relative overflow-hidden">
        <div className="pillars-bg absolute inset-0 bg-obsidian z-0" style={{ height: "130%", top: "-15%" }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20">
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className="pillar-item">
                <span className="font-serif text-sm tracking-[0.2em] mb-6 block text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-off-white mb-5 font-light" style={{ fontSize: "clamp(24px, 2.5vw, 32px)", lineHeight: 1.2 }}>
                  {pillar.title}
                </h3>
                <p className="font-sans leading-relaxed text-muted text-[16px]">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="leadership-section py-32 bg-obsidian relative overflow-hidden border-t border-border/20">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-off-white font-light text-[clamp(32px,4vw,48px)]">Leadership</h2>
            <div className="w-12 h-[1px] bg-gold mx-auto mt-6" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="w-full md:w-1/3">
              <div className="aspect-[3/4] bg-obsidian-light border border-border/50 flex items-center justify-center">
                <span className="text-muted text-[10px] uppercase tracking-widest">Michael Eugene</span>
              </div>
            </div>
            <div className="w-full md:w-2/3 md:pt-8 text-center md:text-left">
              <h3 className="font-serif text-off-white text-2xl md:text-3xl mb-2">Michael Eugene</h3>
              <p className="text-gold-light uppercase tracking-[0.2em] text-[10px] mb-8">Key Principal</p>
              
              <div className="space-y-6 text-muted font-sans leading-relaxed text-sm md:text-base">
                <p>
                  As the key principal for Kreebz Limited, Michael oversees portfolio properties, strategic acquisitions, and client relationships across our network on behalf of the board.
                </p>
                <p>
                  With an uncompromising standard for architectural excellence and facility management, Michael ensures that every property represented by Kreebz receives the dedicated attention and bespoke service our clients expect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section py-32 lg:py-40 text-center">
        <div className="cta-content max-w-[800px] mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-off-white font-light text-[clamp(40px,5vw,64px)] leading-tight mb-12">
            Your property deserves a{" "}
            <span className="italic text-gold-light">principal.</span>
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 px-10 py-5 rounded-none border border-border-strong text-off-white uppercase tracking-[0.2em] text-xs font-medium transition-all duration-700 hover:border-gold hover:text-gold hover:bg-black/5"
          >
            Begin the Conversation
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
