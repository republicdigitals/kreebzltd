"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Users, Gauge, Clock, ChevronRight, Plane } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

interface Jet {
  id: string;
  name: string;
  class: string;
  passengers: number;
  range: string;
  baseHourlyRate: number;
  image?: string;
}

type Step = 1 | 2 | 3;

function formatNaira(kobo: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(kobo / 100);
}

function calcHours(start: string, end: string) {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60)));
}

export default function PrivateJetContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [fleet, setFleet] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJet, setSelectedJet] = useState<Jet | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    route: "",
    startDate: "",
    endDate: "",
    passengers: "",
  });

  useEffect(() => {
    fetch("/api/jets")
      .then((r) => r.json())
      .then((d) => { if (d.jets) setFleet(d.jets); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    gsap.from(".step-content", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", clearProps: "all" });
  }, { scope: containerRef, dependencies: [step] });

  const cheapestRate = fleet.length ? Math.min(...fleet.map((j) => j.baseHourlyRate)) : 0;

  const estimatedCost = selectedJet
    ? calcHours(form.startDate, form.endDate) * selectedJet.baseHourlyRate
    : 0;

  const handleSelectJet = (jet: Jet) => {
    setSelectedJet(jet);
    setStep(3);
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
    <div ref={containerRef} className="bg-obsidian min-h-screen">

      {/* ── STEP 1: PRICING TEASER ─────────────────────────────────── */}
      {step === 1 && (
        <div className="step-content">
          {/* Hero */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <Image src="/images/jets/heavy.jpg" alt="Private jet" fill className="object-cover object-center" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <p className="eyebrow text-gold-light mb-8 drop-shadow-lg">Private Air Charter</p>
              <h1 className="display-xl text-off-white mb-6 drop-shadow-2xl leading-tight">
                Fly Without<br />
                <span className="italic font-light text-gold-light">Limits.</span>
              </h1>
              <p className="font-sans text-off-white/70 text-[15px] leading-[1.9] max-w-xl mx-auto mb-4">
                Bespoke private air travel arranged on your terms. One-way charters, recurring routes,
                or full aircraft rentals — we handle everything.
              </p>
              {cheapestRate > 0 && (
                <p className="font-serif text-gold-light/80 text-[18px] italic mb-12">
                  From {formatNaira(cheapestRate)} per hour
                </p>
              )}
              <button
                onClick={() => setStep(2)}
                className="group inline-flex items-center gap-3 bg-gold text-obsidian uppercase tracking-[0.2em] text-[11px] font-bold px-12 py-5 transition-all duration-500 hover:bg-gold-light hover:scale-105"
              >
                View Available Aircraft
                <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            {/* scroll cue */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-off-white/30 animate-bounce">
              <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
              <Plane size={14} />
            </div>
          </section>

          {/* Intro text */}
          <section className="py-24 lg:py-32">
            <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
              <p className="font-serif text-off-white font-light leading-[1.7]" style={{ fontSize: "clamp(22px, 2.5vw, 34px)" }}>
                Beyond property, Kreebz arranges{" "}
                <span className="italic text-gold-light">private air travel on your terms</span>.
                Whether it is a one-way charter, a recurring route, or an aircraft rental through
                our trusted partners, we handle the details so you do not have to.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ── STEP 2: FLEET SELECTION ────────────────────────────────── */}
      {step === 2 && (
        <div className="step-content py-24 lg:py-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setStep(1)} className="text-muted hover:text-gold transition-colors duration-300 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                <ArrowLeft size={14} /> Back
              </button>
            </div>
            <div className="text-center mb-20">
              <p className="eyebrow text-gold-light/70 mb-6">Step 1 of 2</p>
              <h2 className="font-serif text-off-white font-light leading-[1.1]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
                Choose Your Aircraft
              </h2>
              <p className="font-sans text-muted text-[15px] mt-4 max-w-lg mx-auto leading-relaxed">
                Select the aircraft that suits your route and party size. Pricing is per hour of flight time.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-[480px]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {fleet.map((jet) => (
                  <button
                    key={jet.id}
                    onClick={() => handleSelectJet(jet)}
                    className="group text-left bg-obsidian-light border border-border/30 hover:border-gold/60 transition-all duration-500 hover:-translate-y-1 focus:outline-none focus:border-gold"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {jet.image ? (
                        <Image src={jet.image} alt={jet.name} fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-surface flex items-center justify-center">
                          <Plane size={40} className="text-muted/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-light to-transparent" />
                      <span className="absolute top-4 left-4 eyebrow text-gold-light/80 bg-obsidian/60 backdrop-blur-sm px-3 py-1.5">
                        {jet.class}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-8">
                      <h3 className="font-serif text-off-white text-[26px] font-light mb-2">{jet.name}</h3>
                      <p className="font-serif text-gold-light text-[22px] italic mb-6">{formatNaira(jet.baseHourlyRate)}<span className="text-[14px] not-italic text-muted">/hr</span></p>

                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center justify-between text-[13px] border-b border-white/5 pb-3">
                          <span className="flex items-center gap-2 text-gold-light/60 uppercase text-[10px] tracking-[0.18em]"><Users size={11} /> Capacity</span>
                          <span className="text-off-white">Up to {jet.passengers} pax</span>
                        </li>
                        <li className="flex items-center justify-between text-[13px] border-b border-white/5 pb-3">
                          <span className="flex items-center gap-2 text-gold-light/60 uppercase text-[10px] tracking-[0.18em]"><Gauge size={11} /> Range</span>
                          <span className="text-off-white">{jet.range}</span>
                        </li>
                      </ul>

                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-gold border-t border-border/20 pt-6 group-hover:text-gold-light transition-colors">
                        Select Aircraft
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: BOOKING FORM ───────────────────────────────────── */}
      {step === 3 && selectedJet && (
        <div className="step-content py-24 lg:py-32">
          <div className="max-w-[820px] mx-auto px-6 lg:px-12">
            {/* Back */}
            <button onClick={() => setStep(2)} className="mb-10 text-muted hover:text-gold transition-colors duration-300 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
              <ArrowLeft size={14} /> Choose Different Aircraft
            </button>

            {/* Selected jet summary */}
            <div className="flex gap-6 items-center bg-obsidian-light border border-border/30 p-6 mb-12">
              <div className="relative w-28 h-20 flex-shrink-0 overflow-hidden">
                {selectedJet.image && (
                  <Image src={selectedJet.image} alt={selectedJet.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="eyebrow text-gold-light/60 mb-1">{selectedJet.class}</p>
                <h3 className="font-serif text-off-white text-[22px] font-light">{selectedJet.name}</h3>
                <p className="font-sans text-muted text-[13px] mt-1">Up to {selectedJet.passengers} passengers · {selectedJet.range}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-serif text-gold-light italic text-[20px]">{formatNaira(selectedJet.baseHourlyRate)}</p>
                <p className="text-muted text-[11px] tracking-wide">per hour</p>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-12">
              <p className="eyebrow text-gold-light/70 mb-4">Step 2 of 2</p>
              <h2 className="font-serif text-off-white font-light leading-[1.1]" style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}>
                Plan Your Flight
              </h2>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-8 text-[13px] font-sans text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                required
                placeholder="ROUTE (E.G. LAGOS — LONDON)"
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[13px] text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />

              <input
                type="number"
                min={1}
                max={selectedJet.passengers}
                required
                placeholder={`NUMBER OF PASSENGERS (MAX ${selectedJet.passengers})`}
                value={form.passengers}
                onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[13px] text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[13px] text-off-white focus:outline-none focus:border-gold/60 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-1">Return Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-obsidian-light border border-border/30 px-6 py-5 text-[13px] text-off-white focus:outline-none focus:border-gold/60 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Live cost estimate */}
              {estimatedCost > 0 && (
                <div className="bg-obsidian-light border border-gold/20 p-6 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-muted text-[12px] uppercase tracking-[0.15em]">
                    <Clock size={13} /> Estimated Total ({calcHours(form.startDate, form.endDate)} hrs)
                  </span>
                  <span className="font-serif text-gold-light italic text-[22px]">
                    {formatNaira(estimatedCost)}
                  </span>
                </div>
              )}

              <div className="pt-6 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-3 bg-gold text-obsidian uppercase tracking-[0.2em] text-[11px] font-bold px-12 py-5 transition-all duration-500 hover:bg-gold-light hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {submitting ? "Processing..." : session ? "Continue to Payment" : "Sign In to Book"}
                  {!submitting && <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />}
                </button>
              </div>
            </form>

            {/* Contact fallback */}
            <p className="text-center text-muted text-[13px] mt-10 font-sans">
              Prefer to speak with us?{" "}
              <a href="mailto:hello@kreebzltd.com" className="text-off-white hover:text-gold transition-colors underline underline-offset-4">
                hello@kreebzltd.com
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
