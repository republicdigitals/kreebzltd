"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RevealLines from "./RevealLines";
import Magnetic from "./Magnetic";
import Button from "./ui/Button";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const [shouldPlay, setShouldPlay] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldPlay(!mediaQuery.matches);

    if (mediaQuery.matches && videoRef.current) {
      videoRef.current.pause();
    }

    const listener = (e: MediaQueryListEvent) => {
      setShouldPlay(!e.matches);
      if (e.matches && videoRef.current) {
        videoRef.current.pause();
      } else if (!e.matches && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Deep parallax — film drifts down as you scroll past it
      gsap.to(".hero-bg-img", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: "22%",
        ease: "none"
      });
      // Content counter-drift + fade — the frame recedes behind the canvas
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
        y: "-8%",
        opacity: 0,
        ease: "none"
      });
    });

    // Fade in the film
    gsap.from(".hero-bg-img", {
      opacity: 0,
      duration: 1.6,
      ease: "power2.out"
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Gold rule draws itself, then eyebrow, sub, CTAs settle in
    tl.from(ruleRef.current, {
      scaleX: 0,
      duration: 1.1,
      delay: 0.4,
      ease: "power2.inOut",
    })
    .from(eyebrowRef.current, {
      y: 14,
      opacity: 0,
      duration: 0.8,
    }, "-=0.5")
    .from(subRef.current, {
      y: 18,
      opacity: 0,
      duration: 0.9,
    }, "+=0.15")
    .from(buttonRef.current, {
      y: 16,
      opacity: 0,
      duration: 0.9,
    }, "-=0.5");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="hero" className="relative min-h-dvh w-full overflow-hidden bg-obsidian">
      {/* Film */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-bg-img absolute inset-0 w-full h-[130%] -top-[15%]">
          <video
            ref={videoRef}
            src="/videos/morphix/hero-dusk-lagoon.mp4"
            autoPlay={shouldPlay}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Cinematic grade — darker, warmer; contrast held at text zone */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/75 via-black/20 to-[#0c0b09]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-black/20 to-transparent" />
        {/* Warm gold cast at the horizon of the frame */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_bottom,_rgba(200,161,94,0.08),_transparent_55%)]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 min-h-dvh flex flex-col justify-center items-center px-[5vw] pt-[120px] pb-24">
        <div className="text-center w-full max-w-[1100px] mx-auto">
          <span
            ref={ruleRef}
            className="block w-16 h-px bg-gold mx-auto mb-8"
          />
          <p
            ref={eyebrowRef}
            className="eyebrow text-white/70 mb-8 drop-shadow-lg"
          >
            Property, management &amp; private aviation · Lagos
          </p>

          <h1 className="display-serif text-white flex flex-col items-center drop-shadow-2xl">
            <RevealLines
              lines={["Find the right property.", "Skip the hard part."]}
              delay={0.7}
            />
          </h1>

          <p
            ref={subRef}
            className="text-white/60 text-lead max-w-md mx-auto mt-8"
          >
            A private practice for people who would rather be advised than sold to.
          </p>

          <div ref={buttonRef} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl mx-auto">
            <Magnetic>
              <Button
                href="/properties"
                className="px-12"
                onClick={() => trackEvent("click_primary_cta", { location: "hero", cta: "browse_portfolio" })}
              >
                Browse the portfolio
              </Button>
            </Magnetic>
            <Magnetic>
              <Button
                href="/contact"
                variant="secondary"
                className="px-12"
                onClick={() => trackEvent("click_secondary_cta", { location: "hero", cta: "talk_to_principal" })}
              >
                Talk to a principal
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>

    </section>
  );
}
