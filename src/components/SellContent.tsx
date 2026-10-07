"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Award, Handshake, MessageCircle } from "lucide-react";
import SellForm from "./SellForm";
import { PRINCIPAL_WHATSAPP } from "@/lib/contact";

const steps = [
  {
    n: "01",
    title: "Tell us about the property",
    desc: "Location, spec, condition. A principal reviews every submission personally — no portals, no queues.",
  },
  {
    n: "02",
    title: "We value it honestly",
    desc: "A realistic price built on what buyers are actually paying in your district — not a number to win your listing.",
  },
  {
    n: "03",
    title: "We show it to qualified buyers",
    desc: "Our private network first, the open market only if you want it. Vetted viewings, no tyre-kickers.",
  },
];

const reasons = [
  {
    icon: Eye,
    title: "Discretion first",
    desc: "Your property doesn't have to be on the internet to sell. Most of our placements never go public.",
  },
  {
    icon: Award,
    title: "Positioned, not listed",
    desc: "Photography, staging advice and pricing strategy — your property enters the market at its best, once.",
  },
  {
    icon: Handshake,
    title: "One principal throughout",
    desc: "The person who values your home is the person who negotiates it. Nothing is handed off.",
  },
];

export default function SellContent() {
  return (
    <div className="bg-obsidian">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/sell/hero.png"
            alt="A luxury Lagos villa at dusk, lights glowing"
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
            Sell With Kreebz
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-serif text-white mb-6 drop-shadow-2xl"
          >
            Sell without
            <br />
            <span className="italic font-light text-gold-light">the noise.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-12"
          >
            Your property, shown to qualified buyers — not the whole internet.
            Honest pricing, discreet marketing, one principal throughout.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() =>
                document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover"
            >
              Request a Valuation
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              <MessageCircle size={15} />
              WhatsApp a Principal
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
            Most listings sit, get stale, and sell below their worth. We take the
            opposite approach —{" "}
            <span className="italic text-gold-light">fewer buyers, better qualified</span>,
            and a price we can defend.
          </p>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Process</p>
            <h2 className="display-serif-sm text-off-white">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
              >
                <p className="font-serif text-gold-light/25 text-[64px] leading-none mb-6">{s.n}</p>
                <h3 className="font-serif text-off-white text-[24px] font-light mb-4">{s.title}</h3>
                <p className="text-muted text-[14px] leading-[1.9]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Difference</p>
              <h2 className="display-serif-sm text-off-white mb-6">
                Why owners sell through us
              </h2>
              <p className="text-muted text-[15px] leading-[1.9] max-w-md">
                We&apos;re selective about what we take on — which is why buyers trust
                what we bring them.
              </p>
            </div>
            <div className="divide-y divide-border/30">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="py-8 flex gap-8 group"
                >
                  <r.icon size={22} className="text-gold flex-shrink-0 mt-1" strokeWidth={1.25} />
                  <div>
                    <h3 className="font-serif text-off-white text-[22px] font-light mb-3 group-hover:text-gold-light transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-muted text-[14px] leading-[1.9] max-w-lg">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────────────── */}
      <section id="enquire" className="py-24 lg:py-32 border-t border-border/20 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="eyebrow text-gold tracking-[0.25em] mb-6">Enquire</p>
              <h2 className="display-serif-sm text-off-white mb-4">Start with the property</h2>
              <p className="text-muted text-[15px] leading-[1.9] max-w-md mx-auto">
                Two short steps. Everything you share stays between us — a principal
                responds within one business day.
              </p>
            </div>
            <SellForm />
          </div>
        </div>
      </section>
    </div>
  );
}
