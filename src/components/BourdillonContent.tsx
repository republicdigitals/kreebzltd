"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bourdillon, getApprovedProofPoints, type FeatureStatus } from "@/data/bourdillon";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import Button from "./ui/Button";
import ProofLibrary from "./ProofLibrary";
import FAQ from "./FAQ";
import EnquiryForm from "./EnquiryForm";

const statusStyles: Record<FeatureStatus, string> = {
  completed: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  "under-construction": "border-gold/40 text-gold bg-gold/10",
  planned: "border-white/20 text-off-white/70 bg-white/5",
  proposed: "border-white/10 text-muted bg-transparent",
};

const statusLabels: Record<FeatureStatus, string> = {
  completed: "Completed",
  "under-construction": "Under construction",
  planned: "Planned",
  proposed: "Proposed",
};

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function BourdillonContent() {
  const heroRef = useRef<HTMLElement>(null);
  const proofPoints = getApprovedProofPoints();

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useEffect(() => {
    trackEvent("view_project", { project: "bourdillon" });
  }, []);

  useGSAP(() => {
    gsap.to(".bd-hero-img", {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: "20%",
      ease: "none",
    });
  }, { scope: heroRef });

  const scrollToEnquiry = () => {
    trackEvent("click_brochure_cta", { project: "bourdillon", location: "hero" });
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-obsidian">
      {/* ---------- 1. Hero / above-the-fold summary ---------- */}
      <section ref={heroRef} className="relative min-h-dvh w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <div className="bd-hero-img absolute inset-0 w-full h-[120%] -top-[10%]">
            <Image
              src={bourdillon.heroImage}
              alt={bourdillon.heroImageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-obsidian/90 via-obsidian/30 to-obsidian" />
        </div>

        {/* Render label — must stay visible on mobile */}
        <p className="absolute top-28 right-6 lg:right-12 z-20 text-[9px] uppercase tracking-[0.2em] text-off-white/60 bg-obsidian/60 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10 max-w-[220px] text-right">
          {bourdillon.heroImageLabel}
        </p>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 pt-48">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl"
          >
            <p className="eyebrow text-gold-light mb-6 flex items-center gap-3">
              <MapPin size={12} strokeWidth={1.5} />
              {bourdillon.location}
            </p>

            <h1 className="display-xl text-off-white mb-6">{bourdillon.name}</h1>

            <p className="text-lead text-off-white/80 max-w-xl mb-8">
              {bourdillon.positioning}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 rounded-full mb-10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
              <span className="text-gold text-xs uppercase tracking-widest font-medium">
                {bourdillon.statusLabel}: {bourdillon.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button onClick={scrollToEnquiry} className="px-10">
                Request the project brochure
              </Button>
              <a
                href="#progress"
                onClick={() => trackEvent("click_primary_cta", { project: "bourdillon", target: "progress" })}
                className="text-off-white/70 hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2"
              >
                View project progress
                <ArrowRight size={14} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 2. What is happening now ---------- */}
      <section id="progress" className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="mb-16">
            <p className="eyebrow text-gold-light/70 tracking-[0.3em] mb-4">What is happening now</p>
            <h2 className="text-h2 text-off-white">Construction progress</h2>
          </motion.div>

          <div className="space-y-12">
            {bourdillon.progress.map((update) => (
              <motion.article
                key={update.date + update.milestone}
                {...fadeUp}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-surface-2 border border-border rounded-[var(--radius-lg)] overflow-hidden"
              >
                {update.image && (
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[360px]">
                    <Image
                      src={update.image}
                      alt={`${update.milestone} — ${update.imageLabel ?? "project image"}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {update.imageLabel && (
                      <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-off-white/80 bg-obsidian/70 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10">
                        {update.imageLabel}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-8 lg:p-12">
                  <p className="eyebrow text-gold text-[10px] tracking-[0.25em] mb-4">
                    {update.date}
                  </p>
                  <h3 className="font-serif text-off-white text-3xl mb-4">{update.milestone}</h3>
                  <p className="text-muted leading-relaxed">{update.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3. What is being created ---------- */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div {...fadeUp}>
              <p className="eyebrow text-gold-light/70 tracking-[0.3em] mb-4">What is being created</p>
              <h2 className="text-h2 text-off-white mb-8">Design intent</h2>
              <p className="text-lead text-off-white/80 mb-6">{bourdillon.vision.designIntent}</p>
              <p className="text-muted leading-relaxed">{bourdillon.vision.rationale}</p>
            </motion.div>

            <motion.div {...fadeUp} className="flex flex-col gap-3">
              {bourdillon.vision.features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center justify-between gap-4 border border-border rounded-[var(--radius-sm)] px-5 py-4 bg-surface-2/50"
                >
                  <span className="text-off-white/90 text-sm">{feature.label}</span>
                  <span
                    className={cn(
                      "shrink-0 text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border",
                      statusStyles[feature.status]
                    )}
                  >
                    {statusLabels[feature.status]}
                  </span>
                </div>
              ))}
              <p className="text-[11px] text-muted mt-2 leading-relaxed">
                Items marked Proposed or Planned are not yet built and remain subject to approved
                drawings and final specification.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- 4. Proof ---------- */}
      <ProofLibrary
        points={proofPoints}
        eyebrow="Proof"
        heading="Why Kreebz and this project are credible"
      />

      {/* ---------- 5. Location ---------- */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div {...fadeUp}>
              <p className="eyebrow text-gold-light/70 tracking-[0.3em] mb-4">Location</p>
              <h2 className="text-h2 text-off-white mb-8">Bourdillon, Ikoyi</h2>
              <ul className="space-y-4">
                {bourdillon.locationFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-4 text-off-white/80">
                    <span className="mt-2 w-6 h-[1px] bg-gold shrink-0" aria-hidden="true" />
                    <span className="leading-relaxed">{fact}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-border"
            >
              <Image
                src="/images/townhouse-ibj-render.webp"
                alt="Illustrative render of the proposed Bourdillon residence façade"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-off-white/80 bg-obsidian/70 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-white/10">
                Illustrative render
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- 6. FAQ ---------- */}
      <FAQ
        items={bourdillon.faqs}
        heading="Bourdillon — questions & answers"
        eyebrow="Before you enquire"
      />

      {/* ---------- 7. Final conversion block ---------- */}
      <section id="enquire" className="py-24 lg:py-32 border-t border-border/20">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-h2 text-off-white mb-4">{bourdillon.cta.heading}</h2>
            <p className="text-muted leading-relaxed max-w-xl mx-auto">
              {bourdillon.cta.subheading}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-gold/20 bg-gold/5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
              <span className="text-gold text-xs uppercase tracking-widest font-medium">
                Response within one business day
              </span>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="bg-surface-2 p-8 md:p-12 rounded-[var(--radius-lg)] border border-border shadow-2xl relative overflow-hidden"
          >
            <EnquiryForm
              defaultProject="bourdillon"
              defaultEnquiryType="buy"
              submitLabel="Request the Bourdillon brochure"
              confirmationPath="/thank-you"
            />
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm"
          >
            <a
              href="tel:+2348069949948"
              onClick={() => trackEvent("click_phone", { project: "bourdillon" })}
              className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors"
            >
              <Phone size={14} strokeWidth={1.5} /> +234 806 994 9948
            </a>
            <a
              href="mailto:hello@kreebzltd.com"
              onClick={() => trackEvent("click_email", { project: "bourdillon" })}
              className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors"
            >
              <Mail size={14} strokeWidth={1.5} /> hello@kreebzltd.com
            </a>
            <Link
              href="/contact"
              className="text-muted hover:text-gold transition-colors text-xs uppercase tracking-widest"
            >
              General enquiries
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
