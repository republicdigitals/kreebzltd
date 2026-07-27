"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Property } from "@/data/properties";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RevealText from "./RevealText";

const AUTOPLAY_MS = 6000;

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  const featured = properties.slice(0, 4);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  
  const containerRef = useRef<HTMLElement>(null);
  
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || paused) return;
    const intervalId = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(intervalId);
  }, [emblaApi, paused]);
  
  useGSAP(() => {
    // Cinematic scroll reveal
    const elements = gsap.utils.toArray('.reveal-up') as HTMLElement[];
    
    elements.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: i * 0.1
      });
    });
    
    // Scale reveal for carousel
    gsap.from(".carousel-reveal", {
      scrollTrigger: {
        trigger: ".carousel-reveal",
        start: "top 80%",
      },
      scale: 0.98,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="reveal-up eyebrow text-gold-light/70 tracking-[0.3em] mb-4">
            The Portfolio
          </p>
          <h2 className="reveal-up font-serif text-off-white font-light text-[clamp(36px,5vw,72px)] leading-tight">
            <RevealText text="Curated Excellence" delay={0.2} />
          </h2>
        </div>

        <div
          className="carousel-reveal relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden bg-obsidian-light rounded-none" ref={emblaRef}>
            <div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
              {featured.map((property) => (
                <div
                  key={property.id}
                  className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 pr-4 md:pr-8"
                >
                  <Link href={`/property/${property.id}`} className="block w-full aspect-[4/5] sm:aspect-[3/4] group relative overflow-hidden" draggable={false}>
                    {property.image ? (
                      <Image
                        src={property.image}
                        alt={property.address}
                        fill
                        priority
                        draggable={false}
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] pointer-events-none"
                        sizes="100vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-obsidian-light">
                        <span className="uppercase text-[11px] text-ink-muted tracking-[0.3em]">
                          {property.imagePlaceholder || "IMAGE PENDING"}
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(11, 10, 8, 0.95) 0%, rgba(11, 10, 8, 0.5) 40%, rgba(11, 10, 8, 0) 100%)",
                      }}
                    />
                    
                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="flex flex-col gap-4 text-white">
                        <div className="min-w-0">
                          <span className="uppercase block text-[9px] tracking-[0.3em] text-gold-light/90 w-max mb-3">
                            {property.status} &middot; {property.neighbourhood}
                          </span>
                          <p className="font-serif text-white text-[clamp(24px,4vw,32px)] leading-[1.1] font-light">
                            {property.price}
                          </p>
                          <p className="text-white/80 mt-2 text-sm tracking-wide truncate">
                            {property.address}
                          </p>
                          <p className="uppercase text-white/60 mt-2 text-[10px] tracking-[0.2em]">
                            {property.beds} Bed &nbsp;&middot;&nbsp; {property.baths} Bath
                          </p>
                        </div>
                        
                        <span className="inline-flex items-center gap-2 text-white uppercase text-[10px] tracking-[0.2em] group-hover:text-gold transition-colors duration-300 mt-2">
                          View Residence
                          <ArrowUpRight
                            size={14}
                            strokeWidth={1.5}
                            className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Arrows (desktop only) */}
            <button
              onClick={scrollPrev}
              aria-label="Previous property"
              className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-none bg-black/20 text-off-white backdrop-blur-md hover:bg-black/80 hover:text-gold transition-all duration-500"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next property"
              className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-none bg-black/20 text-off-white backdrop-blur-md hover:bg-black/80 hover:text-gold transition-all duration-500"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Controls row: counter + dots */}
          <div className="flex items-center justify-between mt-8">
            <span className="font-serif text-off-white/80 text-sm tracking-[0.15em]">
              {String(selectedIndex + 1).padStart(2, "0")}
              <span className="text-off-white/30"> / {String(featured.length).padStart(2, "0")}</span>
            </span>

            <div className="flex items-center gap-4">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to property ${i + 1}`}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      "block h-[1px] transition-all duration-500",
                      i === selectedIndex ? "w-12 bg-gold" : "w-6 bg-border group-hover:bg-border-strong"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View all CTA */}
        <div className="reveal-up flex justify-center mt-20">
          <Link
            href="/properties"
            className="group inline-flex items-center gap-4 px-10 py-5 rounded-none text-off-white uppercase tracking-[0.2em] text-xs font-medium transition-all duration-700 hover:text-gold relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              View All Properties
              <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
            </span>
            <span className="absolute bottom-0 left-10 right-10 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Link>
        </div>
      </div>
    </section>
  );
}
