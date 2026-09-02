"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

const brandRows = [
  [
    { name: "Folio Properties", image: "/images/clients/folio-properties.png" },
    { name: "IBJ Thompson", style: "serif" },
    { name: "Folio Properties", image: "/images/clients/folio-properties.png" },
    { name: "IBJ Thompson", style: "serif" },
    { name: "Folio Properties", image: "/images/clients/folio-properties.png" },
  ],
  [
    { name: "IBJ Thompson", style: "serif" },
    { name: "Folio Properties", image: "/images/clients/folio-properties.png" },
    { name: "IBJ Thompson", style: "serif" },
    { name: "Folio Properties", image: "/images/clients/folio-properties.png" },
    { name: "IBJ Thompson", style: "serif" },
  ],
];

export default function BrandLogos() {
  const containerRef = useRef<HTMLElement>(null);
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    // Reveal text
    gsap.from(".brand-reveal", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: "power3.out"
    });
    
    // Animate Marquees with GSAP for smoother performance than CSS
    gsap.to(".marquee-row-1", {
      xPercent: -50,
      repeat: -1,
      duration: 40,
      ease: "none"
    });
    
    gsap.fromTo(".marquee-row-2", 
      { xPercent: -50 },
      {
        xPercent: 0,
        repeat: -1,
        duration: 45,
        ease: "none"
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <p className="brand-reveal eyebrow text-gold-light/70 tracking-[0.3em]">
          Trusted Partnerships
        </p>
        <h2 className="brand-reveal font-serif text-off-white text-[clamp(32px,4vw,56px)] leading-[1.1] font-light mt-6 mb-6">
          Official Marketing & Facility<br/>Management Partners
        </h2>
        <p className="brand-reveal font-sans text-muted tracking-wide text-[15px] max-w-2xl mx-auto">
          We represent the most exclusive developments in Lagos, setting the standard for luxury real estate.
        </p>
      </div>

      {/* Logo rows — marquee */}
      <div className="mt-20 lg:mt-28 space-y-12 lg:space-y-16">
        {brandRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="brand-reveal relative overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
          >
            <div
              className={`flex items-center gap-x-16 lg:gap-x-24 w-max ${rowIndex === 0 ? "marquee-row-1" : "marquee-row-2"}`}
            >
              {/* Repeat the row 4 times to ensure seamless loop across all widths */}
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-x-16 lg:gap-x-24 shrink-0">
                  {row.map((brand, index) => (
                    brand.image ? (
                      <div key={index} className="relative h-8 w-40 md:h-12 md:w-56 opacity-40 hover:opacity-100 transition-opacity duration-500 flex items-center justify-center grayscale hover:grayscale-0">
                        <Image src={brand.image} alt={brand.name} fill sizes="(max-width: 768px) 160px, 224px" className="object-contain" />
                      </div>
                    ) : (
                      <span
                        key={index}
                        className="inline-block text-off-white/20 hover:text-gold transition-colors duration-500 cursor-default font-serif uppercase tracking-[0.1em]"
                        style={{
                          fontSize: "clamp(16px, 2vw, 22px)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {brand.name}
                      </span>
                    )
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
