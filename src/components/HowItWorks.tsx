"use client";

import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./ui/Button";

const pillars = [
  {
    number: "01",
    label: "Absolute Discretion",
    description: "Privacy is paramount. We handle high-profile acquisitions and off-market sales with complete confidentiality and zero public footprint.",
  },
  {
    number: "02",
    label: "Uncompromising Curation",
    description: "We do not list everything. We curate only the most exceptional properties globally, ensuring our portfolio remains the absolute pinnacle of luxury.",
  },
  {
    number: "03",
    label: "White-Glove Concierge",
    description: "From private aviation to estate staffing and fine art logistics, our dedicated principals handle every detail of your lifestyle flawlessly.",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.fromTo(".how-it-works-parallax", 
      { y: 80 },
      {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    gsap.from(".pillar-reveal", {
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
    <section ref={containerRef} id="how-it-works" className="dark-mode py-24 lg:py-40 bg-obsidian overflow-hidden">
      <div className="how-it-works-parallax max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 lg:mb-32">
          <p className="pillar-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-6">
            The Kreebz Standard
          </p>
          <h2 className="pillar-reveal font-serif text-off-white text-[clamp(36px,5vw,72px)] leading-[1.1] font-light mx-auto" style={{ maxWidth: "20ch" }}>
            A relationship, not a transaction.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="pillar-reveal flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-serif text-gold/60 text-4xl lg:text-5xl mb-6 block font-light">
                {pillar.number}
              </span>
              <h3 className="font-serif text-off-white text-2xl lg:text-3xl mb-4 font-light">
                {pillar.label}
              </h3>
              <p className="font-sans text-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pillar-reveal mt-20 lg:mt-32 flex justify-center">
          <Button href="/contact">
            Speak to a Principal
          </Button>
        </div>
      </div>
    </section>
  );
}
