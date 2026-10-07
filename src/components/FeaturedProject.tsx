"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bourdillon, type ProgressUpdate } from "@/data/bourdillon";
import { trackEvent } from "@/lib/analytics";
import Button from "./ui/Button";

/**
 * Featured project module — gives the priority commercial project
 * a dedicated, clearly-labelled route on the homepage rather than
 * burying it in the generic portfolio carousel.
 */
export default function FeaturedProject({ latestProgress }: { latestProgress?: ProgressUpdate }) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
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

  // Play when the thumbnail scrolls into view; pause when it leaves.
  // No loop — at the end we show a replay affordance instead.
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setHasPlayed(true);
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  const replay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    setVideoEnded(false);
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const latest = latestProgress ?? bourdillon.progress[0];

  return (
    <section ref={containerRef} className="py-24 lg:py-32 border-t border-border/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Video thumbnail — 9:16 portrait */}
          <Link
            ref={wrapRef}
            href={bourdillon.url}
            onClick={() => trackEvent("click_primary_cta", { project: "bourdillon", location: "featured_module" })}
            data-cursor="Play"
            className="fp-reveal group relative block aspect-[9/16] w-full max-w-[280px] sm:max-w-[320px] mx-auto overflow-hidden rounded-[var(--radius-lg)] border border-border"
          >
            <video
              ref={videoRef}
              src="/videos/morphix/bourdillon-concept-portrait.mp4"
              poster="/videos/morphix/bourdillon-concept-portrait-poster.jpg"
              muted
              playsInline
              preload="metadata"
              onEnded={() => setVideoEnded(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 transition-colors duration-500 ${videoEnded ? "bg-black/55" : "bg-gradient-to-t from-black/70 via-transparent to-transparent"}`} />

            {/* Replay affordance — end card */}
            {videoEnded && (
              <button
                type="button"
                onClick={replay}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 text-white"
                aria-label="Replay video"
              >
                <span className="w-16 h-16 rounded-full bg-gold text-ink-fixed flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                  <RotateCcw size={24} strokeWidth={2} />
                </span>
                <span className="eyebrow text-[10px] tracking-[0.25em] text-white/80">Replay</span>
              </button>
            )}

            {/* Soft "walkthrough" cue before first play */}
            {!hasPlayed && !videoEnded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <span className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <span className="w-0 h-0 border-y-[7px] border-y-transparent border-l-[12px] border-l-white translate-x-0.5" />
                </span>
              </div>
            )}
            <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {bourdillon.heroImageLabel}
            </span>
            <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 border border-gold/30 backdrop-blur-sm flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </Link>

          {/* Copy */}
          <div>
            <p className="fp-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-4">
              Current project
            </p>
            <h2 className="fp-reveal display-serif-sm text-off-white mb-4">
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
