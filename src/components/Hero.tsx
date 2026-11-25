"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "./Magnetic";
import Button from "./ui/Button";
import { trackEvent } from "@/lib/analytics";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!videoRef.current) return;
    if (reduceMotion) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [reduceMotion]);

  const ease = [0.23, 1, 0.32, 1] as const;

  return (
    <section id="hero" className="relative overflow-hidden border-b border-black bg-white text-black">
      <div className="grid min-h-[100svh] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex min-h-[62svh] flex-col justify-between px-6 pb-8 pt-[calc(var(--nav-height-mobile)+28px)] sm:px-10 lg:min-h-0 lg:pb-10 lg:pt-[calc(var(--nav-height-desktop)+44px)] lg:pl-12 lg:pr-10">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease }}
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f96300]"
          >
            Kreebz Ltd <span aria-hidden="true">*</span> Lagos
          </motion.p>

          <div className="my-14 max-w-[680px] lg:my-0">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="display-serif"
            >
              The right property. None of the hard part.
            </motion.h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease }}
              className="mt-7 max-w-md text-[17px] leading-relaxed text-black/68"
            >
              A private practice for homes, management and aviation — for people who would rather be advised than sold to.
            </motion.p>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28, ease }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Magnetic>
                <Button
                  href="/properties"
                  className="px-9"
                  onClick={() => trackEvent("click_primary_cta", { location: "hero", cta: "browse_portfolio" })}
                >
                  Browse the portfolio
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  href="/contact"
                  variant="secondary"
                  className="px-9"
                  onClick={() => trackEvent("click_secondary_cta", { location: "hero", cta: "talk_to_principal" })}
                >
                  Talk to a principal
                </Button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="grid grid-cols-3 border-t border-black/15 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-black/56"
          >
            <span>Homes</span>
            <span>Management</span>
            <span className="text-right">Aviation</span>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.12, ease }}
          className="relative min-h-[48svh] overflow-hidden border-t border-black bg-black lg:min-h-0 lg:border-l lg:border-t-0"
        >
          <video
            ref={videoRef}
            src="/videos/morphix/hero-dusk-lagoon.mp4"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:px-7">
            <span>Property, built around the owner</span>
            <span className="text-[#f96300]">Lagos</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
