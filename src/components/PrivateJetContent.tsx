"use client";

import { useState, FormEvent, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import Button from "./ui/Button";

const fleet = [
  {
    name: "Light Jet",
    passengers: "4–7",
    range: "2,000 km",
    ideal: "Short hops across West Africa",
    description: "Efficient and discreet — perfect for regional business trips or quick getaways.",
  },
  {
    name: "Midsize Jet",
    passengers: "7–9",
    range: "4,000 km",
    ideal: "Coast-to-coast Africa & Europe",
    description: "More cabin space, extended range, and the comfort for longer flights.",
  },
  {
    name: "Heavy Jet",
    passengers: "10–14",
    range: "6,000+ km",
    ideal: "Intercontinental travel",
    description: "Stand-up cabins, lie-flat beds, and the space to travel with staff or family.",
  },
];

export default function PrivateJetContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    route: "",
    date: "",
    passengers: "",
    message: "",
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent("Private Jet Charter Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nRoute: ${form.route}\nDate: ${form.date}\nPassengers: ${form.passengers}\n\nMessage:\n${form.message}`
    );

    window.location.href = `mailto:hello@kreebzltd.com?subject=${subject}&body=${body}`;
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fleet.map((jet) => (
              <div
                key={jet.name}
                className="fleet-card p-10 lg:p-12 bg-obsidian border border-border/30 hover:border-gold/50 transition-colors duration-700"
              >
                <h3 className="font-serif text-off-white text-[28px] mb-4 font-light">
                  {jet.name}
                </h3>
                <p className="font-sans text-[15px] leading-[1.7] text-muted tracking-wide mb-8">
                  {jet.description}
                </p>
                <ul className="font-sans space-y-4 text-[13px] text-muted/80 tracking-wide">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Passengers</span> 
                    <span className="text-off-white">{jet.passengers}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Range</span> 
                    <span className="text-off-white">{jet.range}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gold-light/70 uppercase text-[10px] tracking-[0.2em]">Ideal for</span> 
                    <span className="text-off-white text-right max-w-[150px]">{jet.ideal}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                required
                placeholder="FULL NAME"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
              <input
                type="email"
                required
                placeholder="EMAIL ADDRESS"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="tel"
                placeholder="PHONE NUMBER"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
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
              <input
                type="date"
                placeholder="PREFERRED DATE"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em] [color-scheme:dark]"
              />
              <input
                type="number"
                min={1}
                placeholder="NUMBER OF PASSENGERS"
                value={form.passengers}
                onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors uppercase tracking-[0.1em]"
              />
            </div>
            <textarea
              rows={5}
              placeholder="ADDITIONAL REQUIREMENTS (CATERING, GROUND TRANSPORT, RETURN DATE, ETC.)"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="form-element w-full bg-obsidian-light border border-border/30 px-6 py-5 text-sm text-off-white placeholder:text-muted/50 focus:outline-none focus:border-gold/60 transition-colors resize-none uppercase tracking-[0.1em] leading-relaxed"
            />
            <div className="form-element text-center pt-8">
              <Button type="submit" className="group">
                Request Charter Quote
                <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-2" />
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
