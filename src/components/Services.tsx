"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

/* ASSET SWAP: Replace background-color placeholders with real photography when service-1.jpg through service-4.jpg are supplied to /public/images/ */

const services = [
  {
    title: "Marketing & Sales",
    description: "The official marketing arm for Folio Properties and IBJ Property Development Company. We position, launch, and sell premium developments in Lagos.",
    placeholder: "service-1.jpg",
    href: "/services",
  },
  {
    title: "Facility & Estate Management",
    description: "End-to-end estate oversight: operations, maintenance, compliance, and value preservation — held to the standard your property deserves.",
    placeholder: "service-2.jpg",
    href: "/services",
  },
  {
    title: "Concierge & Private Aviation",
    description: "Resident-only concierge services and private jet arrangements, handled discreetly and delivered on time.",
    placeholder: "service-3.jpg",
    href: "/services/private-jet",
  },
  {
    title: "Trusted Contractor Network",
    description: "Vetted plumbers, electricians, and specialist tradespeople on call for residents — reliable help whenever it is needed.",
    placeholder: "service-4.jpg",
    href: "/services",
  }
];

export default function Services() {
  const containerRef = useRef<HTMLElement>(null);
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".service-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="services" className="dark-mode py-24 lg:py-32 bg-obsidian overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-12">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="service-card group block overflow-hidden bg-obsidian border border-border/30 hover:border-gold/50 transition-all duration-700"
            >
              {/* Image Placeholder Area */}
              <div 
                className="relative overflow-hidden flex items-center justify-center bg-obsidian-light"
                style={{ height: "450px" }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                <span className="uppercase text-[11px] tracking-[0.3em] text-gold-light/50 group-hover:scale-105 transition-transform duration-1000 ease-out z-20">
                  {service.placeholder}
                </span>
              </div>

              {/* Content Area */}
              <div className="p-10 lg:p-14 flex justify-between items-start gap-6 relative">
                <div>
                  <h3 className="font-serif font-light mb-4 text-off-white text-[28px] lg:text-[32px]">
                    {service.title}
                  </h3>
                  <p className="font-sans text-[15px] leading-[1.8] text-muted tracking-wide max-w-sm">
                    {service.description}
                  </p>
                </div>
                
                <ArrowUpRight 
                  size={24} 
                  strokeWidth={1}
                  className="text-gold-light/40 group-hover:text-gold transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 shrink-0" 
                />
                
                {/* Hover line effect */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
