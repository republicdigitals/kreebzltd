"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Phone,
} from "lucide-react";
import Button from "./ui/Button";
import {
  PRINCIPAL_WHATSAPP,
  PRINCIPAL_PHONE_TEL,
  PRINCIPAL_PHONE_DISPLAY,
} from "@/lib/contact";

const models = [
  {
    title: "The usual model",
    steps: ["Build", "Sell", "Exit"],
    points: [
      "Focus on the transaction",
      "Generic after-sales support",
      "One-time revenue",
      "Commodity positioning",
    ],
  },
  {
    title: "The Kreebz model",
    steps: ["Build", "Market", "Manage", "Retain", "Upsell"],
    points: [
      "Focus on the lifetime relationship",
      "Premium concierge ecosystem",
      "Recurring revenue streams",
      "Premium brand positioning",
    ],
    highlight: true,
  },
];

const pillars = [
  {
    icon: TrendingUp,
    title: "Strategic marketing & sales",
    desc: "Pre-launch positioning, a curated buyer network, and campaigns built for absorption — not just awareness.",
  },
  {
    icon: ShieldCheck,
    title: "Premium facility management",
    desc: "Concierge cover, predictive maintenance and strict privacy — protecting the asset's value and your reputation after handover.",
  },
  {
    icon: Building2,
    title: "The lifestyle ecosystem",
    desc: "Tenant management, rental oversight and advisory that turn buyers into a community — and a recurring relationship.",
  },
];

export default function PartnershipsContent() {
  return (
    <div className="bg-obsidian">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/video/reel/07-construction-towers.mp4"
            poster="/images/partnerships/hero.png"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-center"
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
            Developer Partnerships
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-serif text-white mb-6 drop-shadow-2xl"
          >
            Sell more. Manage better.
            <br />
            <span className="italic font-light text-gold-light">Keep buyers for life.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-12"
          >
            We market, sell and manage your development — so units move faster
            and residents stay happy long after handover.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/contact" className="px-12 py-5">
              Start the Conversation
            </Button>
            <Link
              href="/developments/bourdillon"
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              See it in practice
              <ArrowRight size={14} />
            </Link>
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
            Build-and-sell leaves money and reputation on the table. The developers
            who win keep a relationship with buyers{" "}
            <span className="italic text-gold-light">after handover</span> — we run that for you.
          </p>
        </div>
      </section>

      {/* ── COMPARISON ───────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Difference</p>
            <h2 className="display-serif-sm text-off-white">Why developments stall</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {models.map((model, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className={`p-10 border ${
                  model.highlight
                    ? "border-gold/60 bg-gold/5"
                    : "border-border/30 bg-obsidian-light/30"
                }`}
              >
                <h3
                  className={`font-serif text-[26px] font-light mb-8 ${
                    model.highlight ? "text-gold-light" : "text-off-white/70"
                  }`}
                >
                  {model.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-10 items-center">
                  {model.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${
                          model.highlight
                            ? "bg-gold text-ink-fixed"
                            : "bg-border/30 text-off-white/60"
                        }`}
                      >
                        {step}
                      </span>
                      {i < model.steps.length - 1 && (
                        <ArrowRight size={12} className="text-off-white/30" />
                      )}
                    </div>
                  ))}
                </div>

                <ul className="space-y-4">
                  {model.points.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-off-white/80 text-[14px]">
                      {model.highlight ? (
                        <CheckCircle2 size={16} className="text-gold shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-off-white/30 shrink-0 mt-2" />
                      )}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILLARS ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Offer</p>
            <h2 className="display-serif-sm text-off-white mb-4">One team, three jobs</h2>
            <p className="text-muted text-[15px] max-w-lg mx-auto leading-relaxed">
              We run the whole client journey from first viewing to long-term
              management — so nothing falls between vendors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className="group p-10 border border-border/30 bg-obsidian-light/20 hover:border-gold/40 transition-all duration-500"
              >
                <pillar.icon
                  className="w-10 h-10 text-gold mb-8 group-hover:scale-110 transition-transform duration-500"
                  strokeWidth={1.25}
                />
                <h3 className="font-serif text-off-white text-[22px] font-light mb-4">
                  {pillar.title}
                </h3>
                <p className="text-muted text-[14px] leading-[1.9]">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="eyebrow text-gold tracking-[0.25em] mb-6">In Practice</p>
              <h2 className="display-serif-sm text-off-white mb-6">
                We&apos;re doing it now — at Bourdillon
              </h2>
              <p className="text-muted text-[15px] leading-[1.9] mb-8">
                Our own Ikoyi development runs on this exact model: documented
                construction, transparent sales, and management that continues
                past handover. See how it works before you call.
              </p>
              <Link
                href="/developments/bourdillon"
                className="group inline-flex items-center gap-3 text-gold uppercase tracking-[0.2em] text-[11px] font-bold hover:text-gold-light transition-colors"
              >
                Follow the build
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden border border-border/30">
              <video
                src="/videos/morphix/bourdillon-site-film.mp4"
                poster="/videos/morphix/bourdillon-site-film-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 eyebrow text-gold-light bg-obsidian/80 backdrop-blur-sm px-3 py-1.5">
                Bourdillon, Ikoyi — in progress
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="eyebrow text-gold tracking-[0.25em] mb-6">Next Step</p>
          <h2 className="display-serif-sm text-off-white mb-6">Let&apos;s talk about your project</h2>
          <p className="text-muted text-[15px] leading-[1.9] max-w-lg mx-auto mb-12">
            Tell us what you&apos;re building and we&apos;ll show you how we&apos;d sell
            and manage it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
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
