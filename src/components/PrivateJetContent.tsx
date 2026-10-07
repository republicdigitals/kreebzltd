"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Users,
  Gauge,
  Clock,
  Plane,
  Minus,
  Plus,
  ShieldCheck,
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

interface Jet {
  id: string;
  tailNumber?: string;
  name: string;
  class: string;
  passengers: number;
  range: string;
  baseHourlyRate: number;
  image?: string;
}

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

function calcHours(start: string, end: string) {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60)));
}

const steps = [
  {
    n: "01",
    title: "Tell us the route",
    desc: "Where, when, and how many. A route, a date, a party — that's all we need to start.",
  },
  {
    n: "02",
    title: "We confirm the aircraft",
    desc: "Tail, crew, handling and slots confirmed through vetted operators. You see the price before you commit.",
  },
  {
    n: "03",
    title: "Wheels up",
    desc: "Drive to the private terminal, board, depart. Ground transport and catering arranged on request.",
  },
];

const routes = [
  { from: "Lagos", to: "London", suggestion: "Heavy Jet" },
  { from: "Lagos", to: "Dubai", suggestion: "Heavy Jet" },
  { from: "Lagos", to: "Johannesburg", suggestion: "Midsize Jet" },
  { from: "Lagos", to: "Accra", suggestion: "Light Jet" },
];

const faqs = [
  {
    q: "How far ahead do I need to book?",
    a: "We can turn a domestic charter around in hours. For international routes we recommend 48 hours so overflight permits and handling are settled before you arrive at the terminal.",
  },
  {
    q: "Can you arrange international flights?",
    a: "Yes — London, Dubai, Johannesburg and beyond. Heavy jets in our partner fleet cover intercontinental range; we handle permits, slots and crew duty planning.",
  },
  {
    q: "What's included in the hourly rate?",
    a: "Aircraft, crew and standard handling. Catering, ground transport and de-icing are quoted separately — you'll always see the full price before payment.",
  },
  {
    q: "How do I pay?",
    a: "Securely online by card or transfer. Your booking is confirmed the moment payment clears — and you'll have a named contact for the flight itself.",
  },
];

export default function PrivateJetContent() {
  const bookingRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const [fleet, setFleet] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJet, setSelectedJet] = useState<Jet | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [form, setForm] = useState({
    route: "",
    startDate: "",
    endDate: "",
    passengers: "1",
  });

  useEffect(() => {
    fetch("/api/jets")
      .then((r) => r.json())
      .then((d) => {
        if (d.jets) {
          setFleet(d.jets);
          if (d.jets.length) setSelectedJet(d.jets[d.jets.length - 1]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cheapestRate = fleet.length ? Math.min(...fleet.map((j) => j.baseHourlyRate)) : 0;

  const estimatedCost = selectedJet
    ? calcHours(form.startDate, form.endDate) * selectedJet.baseHourlyRate
    : 0;

  const scrollToBooking = () =>
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSelectJet = (jet: Jet) => {
    setSelectedJet(jet);
    setForm((f) => {
      const pax = parseInt(f.passengers, 10);
      return { ...f, passengers: String(Math.min(Math.max(1, pax || 1), jet.passengers)) };
    });
    scrollToBooking();
  };

  const setPax = (delta: number) => {
    if (!selectedJet) return;
    const pax = parseInt(form.passengers, 10) || 1;
    const next = Math.min(Math.max(1, pax + delta), selectedJet.passengers);
    setForm({ ...form, passengers: String(next) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login?callbackUrl=/services/private-jet");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/jets/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jetId: selectedJet!.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else router.push("/account/bookings");
    } catch (err: unknown) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-obsidian">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            src="/video/reel/04-jet-tarmac.mp4"
            poster="/images/jets/hero.png"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover object-[70%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-obsidian" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow text-gold-light mb-8 drop-shadow-lg"
          >
            Private Air Charter
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="display-serif text-white mb-6 drop-shadow-2xl leading-tight"
          >
            Your schedule.
            <br />
            <span className="italic font-light text-gold-light">Your jet.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-sans text-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-4"
          >
            Tell us where and when. We arrange the aircraft, confirm the details,
            and you&apos;re wheels-up.
          </motion.p>
          {cheapestRate > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-serif text-gold-light/80 text-[18px] italic mb-10"
            >
              From {formatNaira(cheapestRate)} per hour
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() =>
                document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover"
            >
              Browse the Fleet
              <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-1" />
            </button>
            <a
              href={PRINCIPAL_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-off-white/30 text-off-white px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:border-gold hover:text-gold-light"
            >
              <MessageCircle size={14} />
              Speak to the Desk
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
            One-way, return, or a regular route — pick the aircraft, pick the time,{" "}
            <span className="italic text-gold-light">pay securely online</span>.
            We handle everything else.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Process</p>
            <h2 className="display-serif-sm text-off-white">How a charter works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative"
              >
                <p className="font-serif text-gold-light/25 text-[64px] leading-none mb-6">{s.n}</p>
                <h3 className="font-serif text-off-white text-[24px] font-light mb-4">{s.title}</h3>
                <p className="text-muted text-[14px] leading-[1.9]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET ────────────────────────────────────────────────── */}
      <section id="fleet" className="py-24 lg:py-32 border-t border-border/20 scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">The Fleet</p>
            <h2 className="display-serif-sm text-off-white mb-4">Choose your aircraft</h2>
            <p className="text-muted text-[15px] max-w-lg mx-auto leading-relaxed">
              Per flight hour, priced before you commit — no repositioning surprises,
              no hidden handling fees.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[520px]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleet.map((jet, i) => (
                <motion.div
                  key={jet.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="group bg-obsidian-light border border-border/30 hover:border-gold/50 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {jet.image ? (
                      <Image
                        src={jet.image}
                        alt={jet.name}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center">
                        <Plane size={40} className="text-muted/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 eyebrow text-gold-light bg-obsidian/80 backdrop-blur-sm px-3 py-1.5">
                      {jet.class}
                    </span>
                  </div>

                  <div className="p-8">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-off-white text-[26px] font-light">{jet.name}</h3>
                    </div>
                    {jet.tailNumber && (
                      <p className="text-muted/70 text-[11px] tracking-[0.25em] uppercase mb-4">
                        Tail {jet.tailNumber}
                      </p>
                    )}
                    <p className="font-serif text-gold-light text-[22px] italic mb-6">
                      {formatNaira(jet.baseHourlyRate)}
                      <span className="text-[14px] not-italic text-muted">/hr</span>
                    </p>

                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center justify-between text-[13px] border-b border-border pb-3">
                        <span className="flex items-center gap-2 text-gold-light/60 uppercase text-[10px] tracking-[0.18em]">
                          <Users size={11} /> Capacity
                        </span>
                        <span className="text-off-white">Up to {jet.passengers} pax</span>
                      </li>
                      <li className="flex items-center justify-between text-[13px] border-b border-border pb-3">
                        <span className="flex items-center gap-2 text-gold-light/60 uppercase text-[10px] tracking-[0.18em]">
                          <Gauge size={11} /> Range
                        </span>
                        <span className="text-off-white">{jet.range}</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => handleSelectJet(jet)}
                      className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-gold border-t border-border/20 pt-6 hover:text-gold-light transition-colors group/btn"
                    >
                      Charter this aircraft
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ROUTES ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="eyebrow text-gold tracking-[0.25em] mb-6">Popular Routes</p>
              <h2 className="display-serif-sm text-off-white mb-6">
                Where the fleet flies most
              </h2>
              <p className="text-muted text-[15px] leading-[1.9] max-w-md">
                Regular sectors our clients fly — each quoted individually against
                the aircraft that fits the stage length and your party.
              </p>
            </div>
            <ul className="divide-y divide-border/30">
              {routes.map((r, i) => (
                <motion.li
                  key={`${r.from}-${r.to}`}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="flex items-center justify-between py-6 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-off-white text-[20px] font-light">{r.from}</span>
                    <ArrowRight size={14} className="text-gold" />
                    <span className="font-serif text-off-white text-[20px] font-light">{r.to}</span>
                  </div>
                  <span className="eyebrow text-gold-light/60">{r.suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">Questions</p>
            <h2 className="display-serif-sm text-off-white">Before you fly</h2>
          </div>
          <div className="divide-y divide-border/30">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="font-serif text-off-white text-[19px] font-light group-hover:text-gold-light transition-colors pr-6">
                    {f.q}
                  </span>
                  <Plus
                    size={16}
                    className={`text-gold flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaq === i ? "max-h-48 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-muted text-[14px] leading-[1.9] max-w-2xl">{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ──────────────────────────────────────────────── */}
      <section
        ref={bookingRef}
        className="py-24 lg:py-32 border-t border-border/20 scroll-mt-20"
      >
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="eyebrow text-gold tracking-[0.25em] mb-6">Charter Desk</p>
            <h2 className="display-serif-sm text-off-white mb-4">Plan your flight</h2>
            <p className="text-muted text-[15px] max-w-md mx-auto leading-relaxed">
              Pick an aircraft, set the route and dates — you&apos;ll see the estimate
              before anything is charged.
            </p>
          </div>

          {/* Jet selector */}
          {!loading && fleet.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {fleet.map((jet) => {
                const active = selectedJet?.id === jet.id;
                return (
                  <button
                    key={jet.id}
                    onClick={() => setSelectedJet(jet)}
                    className={`text-left p-5 border transition-all duration-300 ${
                      active
                        ? "border-gold bg-gold/5"
                        : "border-border/30 bg-obsidian-light hover:border-gold/40"
                    }`}
                  >
                    <p className={`eyebrow mb-2 ${active ? "text-gold" : "text-muted"}`}>
                      {jet.class}
                    </p>
                    <p className="font-serif text-off-white text-[18px] font-light leading-snug">
                      {jet.name}
                    </p>
                    <p className="text-muted text-[12px] mt-1">
                      {formatNaira(jet.baseHourlyRate)}/hr · {jet.passengers} pax
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {selectedJet && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 text-[13px] font-sans text-center">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">
                    Route
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos — London"
                    value={form.route}
                    onChange={(e) => setForm({ ...form, route: e.target.value })}
                    className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[14px] text-off-white placeholder:text-muted/40 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">
                    Passengers
                  </label>
                  <div className="flex items-center bg-obsidian-light border border-border/30">
                    <button
                      type="button"
                      onClick={() => setPax(-1)}
                      className="px-5 py-5 text-muted hover:text-gold transition-colors"
                      aria-label="Fewer passengers"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="flex-1 text-center text-off-white text-[14px]">
                      {form.passengers}{" "}
                      <span className="text-muted/60 text-[11px] uppercase tracking-[0.15em]">
                        / {selectedJet.passengers} max
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setPax(1)}
                      className="px-5 py-5 text-muted hover:text-gold transition-colors"
                      aria-label="More passengers"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">
                    Departure
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[14px] text-off-white focus:outline-none focus:border-gold/60 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">
                    Return
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[14px] text-off-white focus:outline-none focus:border-gold/60 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {estimatedCost > 0 && (
                <div className="bg-obsidian-light border border-gold/20 p-6 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted text-[12px] uppercase tracking-[0.15em]">
                    <Clock size={13} /> Estimated total ({calcHours(form.startDate, form.endDate)} hrs)
                  </span>
                  <span className="font-serif text-gold-light italic text-[22px]">
                    {formatNaira(estimatedCost)}
                  </span>
                </div>
              )}

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-3 bg-gold text-ink-fixed px-8 py-4 rounded-[var(--radius-pill)] text-[15px] font-medium transition-all duration-300 hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Processing..."
                    : session
                      ? "Continue to secure payment"
                      : "Sign in to book"}
                  {!submitting && (
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </button>
                <p className="flex items-center justify-center gap-2 text-muted/70 text-[12px] mt-5">
                  <ShieldCheck size={13} className="text-gold/70" />
                  Nothing is charged until you confirm at checkout.
                </p>
              </div>
            </form>
          )}

          {/* Contact fallback */}
          <div className="mt-16 pt-10 border-t border-border/20 text-center">
            <p className="eyebrow text-muted mb-4">Prefer to speak with us?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href={PRINCIPAL_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-off-white hover:text-gold transition-colors text-[14px]"
              >
                <MessageCircle size={15} className="text-gold" /> WhatsApp the desk
              </a>
              <a
                href={PRINCIPAL_PHONE_TEL}
                className="flex items-center gap-2 text-off-white hover:text-gold transition-colors text-[14px]"
              >
                <Phone size={15} className="text-gold" /> {PRINCIPAL_PHONE_DISPLAY}
              </a>
              <a
                href={PRINCIPAL_EMAIL_MAILTO}
                className="text-off-white hover:text-gold transition-colors text-[14px] underline underline-offset-4"
              >
                {PRINCIPAL_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
