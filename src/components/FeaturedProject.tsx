"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bourdillon } from "@/data/bourdillon";
import { trackEvent } from "@/lib/analytics";
import Button from "./ui/Button";

/**
 * Featured project module — gives the priority commercial project
 * a dedicated, clearly-labelled route on the homepage rather than
 * burying it in the generic portfolio carousel.
 */
export default function FeaturedProject() {
  const containerRef = useRef<HTMLElement>(null);
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".fp-reveal", {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const latest = bourdillon.progress[0];

  return (
    <section ref={containerRef} className="py-24 lg:py-32 border-t border-border/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Link
            href={bourdillon.url}
            onClick={() => trackEvent("click_primary_cta", { project: "bourdillon", location: "featured_module" })}
            className="fp-reveal group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border"
          >
            <Image
              src={bourdillon.heroImage}
              alt={bourdillon.heroImageAlt}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-off-white/80 bg-obsidian/70 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10">
              {bourdillon.heroImageLabel}
            </span>
            <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-obsidian/60 border border-gold/30 backdrop-blur-sm flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </Link>

          {/* Copy */}
          <div>
            <p className="fp-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-4">
              Current project
            </p>
            <h2 className="fp-reveal text-h2 text-off-white mb-4">
              {bourdillon.name}, <span className="accent-italic text-gold-light">Ikoyi</span>
            </h2>
            <p className="fp-reveal text-lead text-off-white/80 mb-8 max-w-xl">
              {bourdillon.positioning}
            </p>

            <div className="fp-reveal flex flex-wrap items-center gap-4 mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
                <span className="text-gold text-[10px] uppercase tracking-widest font-medium">
                  {bourdillon.status}
                </span>
              </span>
              {latest && (
                <span className="text-muted text-xs tracking-wide">
                  Latest update: {latest.milestone} · {latest.date}
                </span>
              )}
            </div>

            <div className="fp-reveal flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button href={bourdillon.url} className="px-10">
                Explore Bourdillon
              </Button>
              <Link
                href={`${bourdillon.url}#enquire`}
                onClick={() => trackEvent("click_consultation_cta", { project: "bourdillon", location: "featured_module" })}
                className="text-off-white/70 hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2"
              >
                Get the brochure
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
