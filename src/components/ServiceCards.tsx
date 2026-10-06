"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Wrench, Handshake } from "lucide-react";

const services = [
  {
    icon: KeyRound,
    title: "Buyers & Renters",
    desc: "Vetted listings, video walkthroughs, and a named principal on your file — from first viewing to keys.",
    href: "/properties",
    cta: "Browse homes",
  },
  {
    icon: Wrench,
    title: "Owners & Landlords",
    desc: "Full management — staff, repairs, compliance, tenants — plus concierge and aviation when you need it.",
    href: "/management",
    cta: "See management",
  },
  {
    icon: Handshake,
    title: "Developers",
    desc: "Sales, positioning and aftercare for premium developments. Quiet partnerships, serious buyers.",
    href: "/partnerships",
    cta: "Partner with us",
  },
];

export default function ServiceCards() {
  return (
    <section className="py-24 lg:py-32 bg-obsidian-light border-y border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <p className="flex items-center justify-center gap-5 eyebrow text-gold tracking-[0.25em] mb-8">
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
            What we do
            <span className="hidden sm:block h-px w-16 lg:w-28 bg-border" aria-hidden="true" />
          </p>
          <h2 className="display-serif-sm text-off-white mb-4">One partner, end to end</h2>
          <p className="text-muted text-lead">Everything you need in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={service.href}
                className="group flex flex-col h-full bg-obsidian rounded-[var(--radius-lg)] p-8 md:p-10 border border-transparent hover:border-gold/40 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-8">
                  <service.icon size={20} strokeWidth={1.75} />
                </span>
                <h3 className="font-sans font-bold text-off-white text-xl md:text-2xl tracking-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm mb-8 flex-1">
                  {service.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                  {service.cta}
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
