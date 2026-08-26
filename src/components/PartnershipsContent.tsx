"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Building2, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const models = [
  {
    title: "Traditional Model",
    steps: ["Build", "Sell", "Exit"],
    focus: "Focus on transaction",
    support: "Generic after-sales support",
    revenue: "One-time revenue",
    positioning: "Commodity positioning",
  },
  {
    title: "The Kreebz-Enabled Model",
    steps: ["Build", "Market", "Manage", "Retain", "Upsell"],
    focus: "Focus on lifetime relationship",
    support: "Premium concierge ecosystem",
    revenue: "Recurring revenue streams",
    positioning: "Premium brand positioning",
    highlight: true,
  }
];

const pillars = [
  {
    icon: TrendingUp,
    title: "Strategic Marketing & Sales",
    description: "Pre-launch market research, curated UHNWI network activation, and digital experiential campaigns for faster sales absorption."
  },
  {
    icon: ShieldCheck,
    title: "Premium Facility Management",
    description: "24/7 concierge services, predictive maintenance, and strict privacy assurance to protect your asset's value and reputation."
  },
  {
    icon: Building2,
    title: "Lifestyle Ecosystem",
    description: "Tenant management, rental guarantees, and investment advisory to create recurring revenue and community building."
  }
];

export default function PartnershipsContent() {
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
    
    // Stagger models
    gsap.from(".model-card", {
      scrollTrigger: {
        trigger: ".models-container",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pb-32 lg:pb-48 overflow-hidden bg-obsidian">
      {/* The Market Gap Section */}
      <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="text-center mb-16 fade-up">
          <h2 className="text-off-white font-serif text-[clamp(28px,4vw,48px)] mb-6">The Market Gap We Fill</h2>
          <p className="text-muted max-w-2xl mx-auto font-sans text-lg">
            Developers who only build and sell are becoming commoditised. Those who build and create ecosystems command premium pricing and generate loyal repeat clients.
          </p>
        </div>

        <div className="models-container grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {models.map((model, idx) => (
            <div 
              key={idx} 
              className={`model-card p-10 rounded-2xl border ${model.highlight ? 'border-gold bg-gold/5' : 'border-border/50 bg-obsidian-light/30'}`}
            >
              <h3 className={`text-2xl font-serif mb-8 ${model.highlight ? 'text-gold' : 'text-off-white/80'}`}>
                {model.title}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-10 items-center">
                {model.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${model.highlight ? 'bg-gold text-obsidian' : 'bg-border/30 text-off-white/60'}`}>
                      {step}
                    </span>
                    {i < model.steps.length - 1 && (
                      <ArrowRight size={14} className="text-off-white/30" />
                    )}
                  </div>
                ))}
              </div>

              <ul className="space-y-4">
                {[model.focus, model.support, model.revenue, model.positioning].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-off-white/80 text-sm">
                    {model.highlight ? (
                      <CheckCircle2 size={18} className="text-gold shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-off-white/30 shrink-0 mt-2" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 bg-obsidian-light/20 border-y border-border/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-off-white font-serif text-[clamp(28px,4vw,48px)] mb-6">Three Integrated Pillars</h2>
            <p className="text-muted max-w-2xl mx-auto font-sans text-lg">
              We own the entire client journey from acquisition to management, creating a defensible competitive advantage for your development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="fade-up group p-10 border border-border/20 bg-obsidian/50 hover:border-gold/30 transition-all duration-500">
                <pillar.icon className="w-12 h-12 text-gold mb-8 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                <h3 className="text-off-white font-serif text-2xl mb-4">{pillar.title}</h3>
                <p className="text-muted leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto text-center fade-up">
        <h2 className="text-off-white font-serif text-[clamp(32px,5vw,64px)] mb-8">Ready to Elevate Your Asset?</h2>
        <p className="text-muted max-w-2xl mx-auto mb-12 text-lg">
          Partner with Kreebz to transform your architectural innovation into a highly sought-after lifestyle ecosystem.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center gap-4 px-12 py-5 bg-gold text-obsidian uppercase tracking-[0.2em] text-[11px] font-bold transition-all duration-500 hover:bg-gold-light hover:scale-105"
        >
          Discuss a Partnership <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
