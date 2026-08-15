"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const journeys = [
  {
    title: "Buy",
    description: "Acquire exceptional properties off-market or from our curated portfolio.",
    href: "/properties?intent=buy",
    number: "01",
  },
  {
    title: "Rent",
    description: "Lease premium residences with white-glove concierge support.",
    href: "/properties?intent=rent",
    number: "02",
  },
  {
    title: "Sell",
    description: "Discreetly market your asset to a qualified network of high-net-worth buyers.",
    href: "/sell",
    number: "03",
  },
  {
    title: "Develop",
    description: "End-to-end advisory and management for ambitious luxury projects.",
    href: "/services",
    number: "04",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".journey-reveal", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%"
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="how-it-works" className="py-24 lg:py-40 bg-obsidian border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 lg:mb-32">
          <p className="journey-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-6">
            Choose Your Journey
          </p>
          <h2 className="journey-reveal font-serif text-off-white text-[clamp(36px,4vw,64px)] leading-[1.1] font-light mx-auto max-w-[20ch]">
            How can we assist you today?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {journeys.map((journey) => (
            <Link 
              key={journey.title} 
              href={journey.href}
              className="journey-reveal group relative p-10 border border-white/10 hover:border-gold/50 bg-white/5 hover:bg-white/10 transition-all duration-500 flex flex-col justify-between overflow-hidden"
            >
              <div className="relative z-10">
                <span className="font-serif text-gold/40 group-hover:text-gold text-2xl mb-6 block font-light transition-colors duration-500">
                  {journey.number}
                </span>
                <h3 className="font-serif text-off-white text-3xl mb-4 font-light">
                  {journey.title}
                </h3>
                <p className="font-sans text-muted leading-relaxed text-sm mb-12">
                  {journey.description}
                </p>
              </div>
              
              <div className="relative z-10 flex items-center justify-between mt-auto">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">Explore</span>
                <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-500">
                  <ArrowRight size={16} className="text-white group-hover:text-obsidian transition-colors duration-500" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
