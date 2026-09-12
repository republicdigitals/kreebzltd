"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Clock, Shield, BarChart3, Star, ArrowRight } from "lucide-react";
import Button from "./ui/Button";

const solutions = [
  {
    icon: Star,
    title: "One Partner for Everything",
    painPoint: "Fragmented service experience",
    description: "We eliminate the chaos of managing multiple vendors. From concierge requests to technical maintenance, Kreebz is your single, accountable point of contact."
  },
  {
    icon: Clock,
    title: "Your Time is Precious",
    painPoint: "Time poverty",
    description: "Every hour spent managing property details is an hour not spent on wealth creation or personal pursuits. Our 24/7 concierge handles all operational complexity."
  },
  {
    icon: BarChart3,
    title: "Appreciation, Not Depreciation",
    painPoint: "Asset value erosion",
    description: "We view property as a generational asset. Through predictive maintenance protocols and expert care, we ensure your investment appreciates over time."
  },
  {
    icon: Shield,
    title: "Your Privacy is Sacred",
    painPoint: "Security and privacy concerns",
    description: "In luxury real estate, discretion is paramount. We employ strictly vetted personnel and rigorous confidentiality protocols to protect your personal space."
  }
];

export default function ManagementContent() {
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
      {/* The Core Philosophy Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto border-b border-border/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center fade-up">
          <div>
            <p className="eyebrow text-gold-light/80 mb-6">THE KREEBZ STANDARD</p>
            <h2 className="text-h2 text-off-white leading-[1.1] mb-8">
              Your property, kept to your standard
            </h2>
            <p className="text-muted text-lead leading-relaxed mb-6">
              You didn&apos;t buy a second job. Managing a property shouldn&apos;t eat your week — that&apos;s our job.
            </p>
            <p className="text-muted text-lead leading-relaxed">
              We don&apos;t just fix things. We keep your property ahead of problems — and report back before you have to ask.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-obsidian-light/30 border border-border/20 p-8 rounded-[var(--radius-lg)]">
              <h3 className="text-4xl font-serif text-gold mb-2">24/7</h3>
              <p className="text-off-white/80 text-sm uppercase tracking-wider">Concierge Access</p>
            </div>
            <div className="bg-obsidian-light/30 border border-border/20 p-8 rounded-[var(--radius-lg)] sm:translate-y-8">
              <h3 className="text-4xl font-serif text-gold mb-2">100%</h3>
              <p className="text-off-white/80 text-sm uppercase tracking-wider">Vetted Staff</p>
            </div>
            <div className="bg-obsidian-light/30 border border-border/20 p-8 rounded-[var(--radius-lg)]">
              <h3 className="text-4xl font-serif text-gold mb-2">&lt;4h</h3>
              <p className="text-off-white/80 text-sm uppercase tracking-wider">Response Time</p>
            </div>
            <div className="bg-obsidian-light/30 border border-border/20 p-8 rounded-[var(--radius-lg)] sm:translate-y-8">
              <h3 className="text-4xl font-serif text-gold mb-2">NDA</h3>
              <p className="text-off-white/80 text-sm uppercase tracking-wider">Strict Confidentiality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 fade-up">
          <h2 className="text-h2 text-off-white mb-6">What we take off your plate</h2>
          <p className="text-muted max-w-2xl mx-auto text-lead">
            The recurring headaches of owning premium property — solved before they reach you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, idx) => (
            <div key={idx} className="fade-up group p-10 md:p-12 border border-border/20 bg-obsidian-light/10 hover:bg-obsidian-light/30 transition-all duration-500">
              <div className="flex justify-between items-start mb-8">
                <solution.icon className="w-10 h-10 text-gold group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.2em] text-off-white/40">
                  {solution.painPoint}
                </span>
              </div>
              <h3 className="text-off-white font-serif text-2xl mb-4">{solution.title}</h3>
              <p className="text-muted leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto text-center fade-up">
        <h2 className="text-h2 text-off-white mb-8">Get your week back</h2>
        <p className="text-muted max-w-2xl mx-auto mb-12 text-lead">
          Tell us about your property and we&apos;ll put together a management plan that fits.
        </p>
        <Button href="/contact" className="inline-flex items-center gap-4 px-12">
          Get a management plan <ArrowRight size={16} />
        </Button>
      </section>
    </div>
  );
}
