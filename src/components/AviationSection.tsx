"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plane } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "./ui/Button";

/**
 * Homepage aviation feature — surfaces the private jet service
 * instead of leaving it buried under /services.
 */
export default function AviationSection() {
  const containerRef = useRef<HTMLElement>(null);
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".av-reveal", {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="py-24 lg:py-32 border-t border-border/20 relative overflow-hidden"
    >
      {/* Subtle radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <Link
            href="/services/private-jet"
            className="av-reveal group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border order-first"
          >
            <Image
              src="/images/jets/heavy.jpg"
              alt="Private jet on the tarmac"
              fill
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 border border-gold/30 backdrop-blur-sm flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </Link>

          {/* Copy */}
          <div>
            <p className="av-reveal eyebrow text-gold-light/70 tracking-[0.3em] mb-4 flex items-center gap-3">
              <Plane size={14} strokeWidth={1.5} className="text-gold" />
              Private Aviation
            </p>
            <h2 className="av-reveal text-h2 text-off-white mb-6">
              Lagos to anywhere. <span className="accent-italic text-gold-light">On your schedule.</span>
            </h2>
            <p className="av-reveal text-lead text-off-white/80 mb-10 max-w-xl">
              One-way charters, return trips, or a standing arrangement — tell us when and where, and we handle the aircraft, the paperwork, and the payment.
            </p>
            <div className="av-reveal flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button href="/services/private-jet" className="px-10">
                See the fleet
              </Button>
              <span className="text-muted text-xs tracking-wide">
                Light to heavy jets · Booked and confirmed through Kreebz
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
