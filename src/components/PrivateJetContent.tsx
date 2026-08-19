"use client";

import { useState, FormEvent, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import Button from "./ui/Button";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Jet {
  id: string;
  name: string;
  class: string;
  passengers: number;
  range: string;
  baseHourlyRate: number;
  description?: string;
}

export default function PrivateJetContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const [fleet, setFleet] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    jetId: "",
    route: "",
    startDate: "",
    endDate: "",
    passengers: "",
    message: "",
  });

  // Fetch jets on mount
  useState(() => {
    fetch("/api/jets")
      .then(res => res.json())
      .then(data => {
        if (data.jets) {
          setFleet(data.jets);
          if (data.jets.length > 0) {
            setForm(prev => ({ ...prev, jetId: data.jets[0].id }));
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  });

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useGSAP(() => {
    // Intro reveal
    gsap.from(".intro-text", {
      scrollTrigger: {
        trigger: ".intro-section",
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });
    
    // Fleet reveal
    gsap.from(".fleet-header", {
      scrollTrigger: {
        trigger: ".fleet-section",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
    
    gsap.from(".fleet-card", {
      scrollTrigger: {
        trigger: ".fleet-section",
        start: "top 70%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    });
    
    // Form reveal
    gsap.from(".form-element", {
      scrollTrigger: {
        trigger: ".form-section",
        start: "top 75%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, { scope: containerRef });

  const handleSubmit = async (e: FormEvent) => {
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
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Redirect to checkout URL
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push("/account/bookings");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="bg-obsidian">
      {/* Intro */}
      <section className="intro-section py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <p className="intro-text font-serif text-off-white font-light leading-[1.6]" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
            Beyond property, Kreebz arranges <span className="italic text-gold-light">private air travel on your terms</span>. Whether it is a
            one-way charter, a recurring route, or an aircraft rental through our trusted partners,
            we handle the details so you do not have to.
          </p>
        </div>
      </section>

      {/* Fleet */}
      <section className="fleet-section py-24 lg:py-32 bg-obsidian-light border-y border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="fleet-header text-center mb-20">
            <p className="uppercase text-[11px] tracking-[0.3em] text-gold-light/70 mb-6">
              Available Aircraft
            </p>
            <h2 className="font-serif text-off-white font-light text-[clamp(36px,4vw,56px)] leading-[1.1]">
              Charter or Rent a Private Jet
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-muted">Loading aircraft inventory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleet.map((jet) => (
                <div
                  key={jet.id}
                  className="fleet-card p-10 lg:p-12 bg-obsidian border border-border/30 hover:border-gold/50 transition-colors duration-700"
                >
                  <h3 className="font-serif text-off-white text-[28px] mb-4 font-light">
                    {jet.name}
                  </h3>
                  <p className="font-sans text-[15px] leading-[1.7] text-muted tracking-wide mb-8">
                    {jet.class} Class Aircraft
                  </p>
                  <ul className="font-sans space-y-4 text-[13px] text-muted/80 tracking-wide">
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Capacity</span> 
                      <span className="text-off-white">Up to {jet.passengers}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Range</span> 
                      <span className="text-off-white">{jet.range}</span>
                    </li>
                    <li className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Hourly Rate</span> 
                      <span className="text-off-white">₦{(jet.baseHourlyRate / 100).toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="form-section py-24 lg:py-32">
        <div className="max-w-[820px] mx-auto px-6 lg:px-12">
          <div className="form-element text-center mb-16">
            <p className="uppercase text-[11px] tracking-[0.3em] text-gold-light/70 mb-6">
              Request a Quote
            </p>
            <h2 className="font-serif text-off-white font-light text-[clamp(36px,4vw,56px)] leading-[1.1] mb-6">
              Plan Your Flight
            </h2>
            <p className="font-sans text-[16px] leading-[1.8] text-muted tracking-wide max-w-lg mx-auto">
              Tell us your route, dates, and party size. We will confirm availability and arrange
              everything through our aviation partners.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded mb-8 text-center text-sm font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                required
                value={form.jetId}
                onChange={(e) => setForm({ ...form, jetId: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em] appearance-none"
              >
                {fleet.map((jet) => (
                  <option key={jet.id} value={jet.id}>
                    {jet.name} (₦{(jet.baseHourlyRate / 100).toLocaleString()}/hr)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                required
                placeholder="NUMBER OF PASSENGERS"
                value={form.passengers}
                onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <input
                type="text"
                required
                placeholder="ROUTE (E.G. LAGOS — LONDON)"
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-2">Departure Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em] [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted tracking-[0.2em] uppercase px-2">Return Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em] [color-scheme:dark]"
                />
              </div>
            </div>
            <textarea
              rows={3}
              placeholder="ADDITIONAL REQUIREMENTS (CATERING, GROUND TRANSPORT, ETC.)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors resize-none uppercase tracking-[0.1em] leading-relaxed"
            />
            <div className="form-element text-center pt-8">
              <Button type="submit" disabled={submitting} className="group disabled:opacity-50">
                {submitting ? "Processing..." : session ? "Continue to Payment" : "Sign in to Book"}
                {!submitting && <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Direct Contact */}
      <section className="form-element py-16 lg:py-24 bg-obsidian border-t border-border/20 text-center">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12">
          <p className="font-serif text-muted font-light mb-6" style={{ fontSize: "clamp(20px, 2vw, 28px)" }}>
            Prefer to speak with us directly?
          </p>
          <a
            href="mailto:hello@kreebzltd.com"
            className="inline-block text-off-white hover:text-gold transition-colors duration-500 font-sans tracking-[0.1em] text-[15px]"
          >
            hello@kreebzltd.com
          </a>
        </div>
      </section>
    </div>
  );
}
