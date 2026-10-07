"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plane,
  Search,
  CalendarCheck,
  Shield,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  PRINCIPAL_WHATSAPP,
  PRINCIPAL_PHONE_TEL,
  PRINCIPAL_PHONE_DISPLAY,
  PRINCIPAL_EMAIL_MAILTO,
  PRINCIPAL_EMAIL,
} from "@/lib/contact";

const services = [
  {
    n: "01",
    title: "Private Aviation",
    description: "Charter a jet on your schedule. We arrange the aircraft, handle the details, and confirm it end to end.",
    icon: Plane,
    href: "/services/private-jet",
    image: "/images/concierge/private-aviation.png",
    highlight: true,
  },
  {
    n: "02",
    title: "Off-Market Sourcing",
    description: "The best properties never get listed. Tell us what you want; we'll find it.",
    icon: Search,
    href: "/matchmaking",
    image: "/images/concierge/off-market.png",
  },
  {
    n: "03",
    title: "Day-to-Day",
    description: "Restaurants, events, contractors, staff — one message and it's handled.",
    icon: CalendarCheck,
    href: "/contact",
    image: "/images/concierge/day-to-day.png",
  },
  {
    n: "04",
    title: "Ongoing Care",
    description: "Maintenance, security, tenants — your property stays in shape without you chasing it.",
    icon: Shield,
    href: "/management",
    image: "/images/concierge/ongoing-care.png",
  },
];

const steps = [
  { n: "01", title: "You ask", desc: "One message — WhatsApp, a call, or the form. No request is too small or too unusual." },
  { n: "02", title: "We handle it", desc: "A principal picks it up, works our network, and sorts the details end to end." },
  { n: "03", title: "It's confirmed", desc: "You get a clear answer — booked, delivered, done. No chasing, no ticket numbers." },
];

export default function ConciergeContent() {
  return (
    <div className="bg-obsidian">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/concierge/hero.png"
            alt="Private concierge desk — keys, phone and itinerary on dark marble"
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
            The Concierge Hub
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-serif text-white mb-6 drop-shadow-2xl"
          >
            Ask once.
            <br />
            <span className="italic font-light text-gold-light">It&apos;s done.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-12"
          >
            Jets, off-market homes, reservations, contractors — if it touches your
            life or your property, bring it to us.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover"
            >
              <MessageCircle size={14} />
              Message the Desk
            </a>
            <button
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              What we handle
              <ArrowRight size={14} className="rotate-90" />
            </button>
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
            The point of a concierge is simple:{" "}
            <span className="italic text-gold-light">you ask once, it&apos;s done</span>.
            Whatever touches your life or your property — that&apos;s our job.
          </p>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────── */}
      <section id="services" className="py-24 lg:py-32 border-t border-border/20 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Desk</p>
            <h2 className="display-serif-sm text-off-white">What we handle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: (idx % 2) * 0.12 }}
              >
                <Link
                  href={service.href}
                  className="group relative block h-[420px] md:h-[480px] overflow-hidden border border-border/30 hover:border-gold/50 transition-colors duration-500"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

                  <span className="absolute top-6 left-6 font-serif text-gold-light/40 text-[28px] leading-none">
                    {service.n}
                  </span>

                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                    <service.icon
                      className={`w-9 h-9 mb-6 ${service.highlight ? "text-gold" : "text-white/80"}`}
                      strokeWidth={1.5}
                    />
                    <h3 className="font-serif text-white font-light text-[30px] mb-3 group-hover:text-gold-light transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-white/60 text-[14px] leading-relaxed mb-7 max-w-sm">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold text-gold group-hover:text-gold-light transition-colors duration-300">
                      Ask us about it
                      <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Process</p>
            <h2 className="display-serif-sm text-off-white">How the desk works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative text-center md:text-left"
              >
                <p className="font-serif text-gold-light/25 text-[64px] leading-none mb-6">{s.n}</p>
                <h3 className="font-serif text-off-white text-[24px] font-light mb-4">{s.title}</h3>
                <p className="text-muted text-[14px] leading-[1.9]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="eyebrow text-gold tracking-[0.25em] mb-6">One Number</p>
          <h2 className="display-serif-sm text-off-white mb-6">Whatever it is — ask</h2>
          <p className="text-muted text-[15px] leading-[1.9] max-w-lg mx-auto mb-12">
            The desk answers on WhatsApp, on the phone, and by email.
            One message and it&apos;s moving.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover"
            >
              <MessageCircle size={14} />
              WhatsApp the Desk
            </a>
            <a
              href={PRINCIPAL_PHONE_TEL}
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              <Phone size={14} />
              {PRINCIPAL_PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-8">
            <a
              href={PRINCIPAL_EMAIL_MAILTO}
              className="text-muted hover:text-gold transition-colors text-[14px] underline underline-offset-4"
            >
              {PRINCIPAL_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
