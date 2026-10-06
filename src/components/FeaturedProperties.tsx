"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Property } from "@/data/properties";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RevealText from "./RevealText";
import Button from "./ui/Button";

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
    <section ref={containerRef} className="py-24 lg:py-32 bg-obsidian-light border-y border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section heading */}
        <div className="text-center mb-14">
          <p className="reveal-up flex items-center justify-center gap-5 eyebrow text-gold tracking-[0.25em] mb-8">
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
            Featured Listings
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
          </p>
          <h2 className="reveal-up text-off-white display-serif-sm mb-4">
            <RevealText text="Every listing, personally vetted" delay={0.2} />
          </h2>
          <p className="reveal-up text-muted text-lead">Homes for living and long-term value</p>
        </div>

        <div
          className="carousel-reveal relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden bg-transparent rounded-none" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 md:-ml-6" style={{ backfaceVisibility: "hidden" }}>
              {featured.map((property) => (
                <div
                  key={property.id}
                  className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 pl-4 md:pl-6"
                >
                  <Link href={`/property/${property.slug}`} data-cursor="View" className="block w-full aspect-[4/5] group relative overflow-hidden rounded-[var(--radius-lg)] bg-panel" draggable={false}>
                    {property.image ? (
                      <Image
                        src={property.image}
                        alt={property.address}
                        fill
                        priority
                        draggable={false}
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] pointer-events-none"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
                        <span className="uppercase text-[11px] text-muted tracking-[0.3em]">
                          {property.imagePlaceholder || "IMAGE PENDING"}
                        </span>
                      </div>
                    )}

                    {/* Status pill — top left */}
                    <span className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md text-white/95 uppercase text-[9px] tracking-[0.2em] font-semibold">
                      {property.status}
                    </span>

                    {/* Location pill — top right */}
                    <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-sm text-white text-[10px] tracking-wide">
                      <MapPin size={11} strokeWidth={2} />
                      {property.neighbourhood || property.city}
                    </span>

                    {/* Bottom gradient + content */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-24 p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-sans font-bold text-white text-[22px] leading-tight truncate">
                            {property.type} — {property.neighbourhood}
                          </p>
                          <p className="text-white/70 mt-1.5 text-sm truncate">
                            {property.address}
                          </p>
                        </div>
                        <p className="font-sans font-bold text-white text-[15px] whitespace-nowrap shrink-0">
                          {property.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20 text-white/70 text-[12px] tracking-wide">
                        <span>{property.beds} Beds</span>
                        <span className="w-px h-3 bg-white/30" />
                        <span>{property.baths} Baths</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-gold text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View
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
              className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white shadow-card hover:bg-gold hover:border-gold hover:text-ink-fixed transition-all duration-300"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next property"
              className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white shadow-card hover:bg-gold hover:border-gold hover:text-ink-fixed transition-all duration-300"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Controls row: counter + dots */}
          <div className="flex items-center justify-between mt-8">
            <span className="text-off-white/80 text-sm tracking-[0.15em] font-medium">
              {String(selectedIndex + 1).padStart(2, "0")}
              <span className="text-muted"> / {String(featured.length).padStart(2, "0")}</span>
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
          <Button href="/properties" variant="secondary" className="inline-flex items-center gap-4">
            See the full portfolio
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
