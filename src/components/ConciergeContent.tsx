"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plane, Search, CalendarCheck, Shield, ArrowRight } from "lucide-react";

// TODO: Replace Unsplash URLs with local brand-supplied photography in /public/images/concierge/
const services = [
  {
    title: "Private Aviation",
    description: "Charter a jet on your schedule. We arrange the aircraft, handle the details, and confirm it end to end.",
    icon: Plane,
    href: "/services/private-jet",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1974&auto=format&fit=crop",
    highlight: true,
  },
  {
    title: "Off-Market Sourcing",
    description: "The best properties never get listed. Tell us what you want; we'll find it.",
    icon: Search,
    href: "/matchmaking",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Day-to-Day",
    description: "Restaurants, events, contractors, staff — one message and it's handled.",
    icon: CalendarCheck,
    href: "/contact",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Ongoing Care",
    description: "Maintenance, security, tenants — your property stays in shape without you chasing it.",
    icon: Shield,
    href: "/management",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
  }
];

export default function ConciergeContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    // Fade up sections on scroll
    gsap.utils.toArray<HTMLElement>('.fade-up').forEach((elem) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pb-32 lg:pb-48 overflow-hidden bg-obsidian">
      {/* Intro Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-border/10">
        <div className="max-w-3xl mx-auto text-center fade-up">
          <p className="text-muted font-sans text-lg leading-relaxed">
            The point of a concierge is simple: you ask once, it&apos;s done. Whatever touches your life or your property — bring it to us.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <Link href={service.href} key={idx} className="fade-up group relative block h-[450px] overflow-hidden rounded-[var(--radius-lg)] border border-border/20">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <service.icon className={`w-10 h-10 mb-6 ${service.highlight ? 'text-gold' : 'text-off-white/80'}`} strokeWidth={1.5} />
                <h3 className="text-off-white font-serif text-3xl mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-muted leading-relaxed mb-8 max-w-sm">
                  {service.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold text-off-white group-hover:text-gold transition-colors duration-300">
                  Ask us about it <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
