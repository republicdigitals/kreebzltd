"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wrench,
  Shield,
  FileCheck,
  KeyRound,
  MessageCircle,
  Phone,
} from "lucide-react";
import Button from "./ui/Button";
import {
  PRINCIPAL_WHATSAPP,
  PRINCIPAL_PHONE_TEL,
  PRINCIPAL_PHONE_DISPLAY,
} from "@/lib/contact";

const scope = [
  {
    n: "01",
    icon: Wrench,
    title: "Repairs & maintenance",
    desc: "Planned servicing, vetted contractors, and fixes done right the first time — photographed and reported, not just \"sorted\".",
  },
  {
    n: "02",
    icon: Shield,
    title: "Staff & security",
    desc: "Vetted, NDA-bound personnel. Drivers, cleaners, guards — hired, managed and accountable to one principal.",
  },
  {
    n: "03",
    icon: FileCheck,
    title: "Bills & compliance",
    desc: "Service charges, rates, insurance, permits — tracked and settled on schedule so nothing lapses while you're away.",
  },
  {
    n: "04",
    icon: KeyRound,
    title: "Tenants & income",
    desc: "Screening, leases, rent collection and renewals. If the property earns, we protect the yield — if it's yours alone, it stays guest-ready.",
  },
];

const reporting = [
  { value: "Monthly", label: "Written statement", desc: "Spend, works and incidents in one document" },
  { value: "Photo", label: "Condition reports", desc: "Your property, documented on schedule" },
  { value: "One", label: "Number to call", desc: "A named principal — not a ticket queue" },
];

export default function ManagementContent() {
  return (
    <div className="bg-obsidian">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/management/hero.png"
            alt="An immaculate Kreebz-managed interior at dusk"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-obsidian" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow text-gold-light mb-8"
          >
            Property Management
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-serif text-white mb-6 drop-shadow-2xl"
          >
            Own property in Lagos.
            <br />
            <span className="italic font-light text-gold-light">Live anywhere.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-12"
          >
            Repairs, staff, compliance, tenants — a named principal handles it all,
            reports on schedule, and you get one number to call.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/contact" className="px-12 py-5">
              Get a Management Plan
            </Button>
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p
            className="font-serif text-off-white font-light leading-[1.7]"
            style={{ fontSize: "clamp(22px, 2.5vw, 34px)" }}
          >
            You didn&apos;t buy a second job. We don&apos;t just fix things — we keep your
            property ahead of problems,{" "}
            <span className="italic text-gold-light">and report before you have to ask</span>.
          </p>
        </div>
      </section>

      {/* ── SCOPE ────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Scope</p>
              <h2 className="display-serif-sm text-off-white mb-6">
                What we take off your plate
              </h2>
              <p className="text-muted text-[15px] leading-[1.9] max-w-md">
                The recurring headaches of owning premium property — handled
                end to end by one accountable team.
              </p>
            </div>
            <div className="divide-y divide-border/30">
              {scope.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="py-8 flex gap-8 group"
                >
                  <span className="font-serif text-gold-light/30 text-[36px] leading-none w-16 flex-shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <s.icon size={18} className="text-gold" strokeWidth={1.5} />
                      <h3 className="font-serif text-off-white text-[22px] font-light group-hover:text-gold-light transition-colors">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-muted text-[14px] leading-[1.9] max-w-lg">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REPORTING ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">Accountability</p>
            <h2 className="display-serif-sm text-off-white">How you stay informed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
            {reporting.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="text-center"
              >
                <p
                  className="font-serif text-gold-light text-[clamp(48px,6vw,72px)] leading-none tracking-tight"
                  style={{ fontVariationSettings: "'opsz' 144" }}
                >
                  {r.value}
                </p>
                <p className="eyebrow text-off-white tracking-[0.2em] mt-4">{r.label}</p>
                <p className="text-muted text-sm mt-2 max-w-[240px] mx-auto">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="eyebrow text-gold tracking-[0.25em] mb-6">Next Step</p>
          <h2 className="display-serif-sm text-off-white mb-6">Get your week back</h2>
          <p className="text-muted text-[15px] leading-[1.9] max-w-lg mx-auto mb-12">
            Tell us about the property — where it is, what state it&apos;s in, what you
            need covered. We&apos;ll put together a management plan that fits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/contact" className="px-12 py-5">
              Get a Management Plan <ArrowRight size={14} className="ml-1" />
            </Button>
            <a
              href={PRINCIPAL_PHONE_TEL}
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              <Phone size={14} />
              {PRINCIPAL_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
