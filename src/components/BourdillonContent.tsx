"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Tag,
  Home,
  CalendarCheck,
  Banknote,
  Landmark,
  Building2,
  TreePine,
  Navigation,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { bourdillon, getApprovedProofPoints, type FeatureStatus, type ProgressUpdate } from "@/data/bourdillon";
import type { SiteMedia } from "@/data/projects";
import type { Property } from "@/data/properties";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import Button from "./ui/Button";
import PropertyCard from "./PropertyCard";
import ProofLibrary from "./ProofLibrary";
import FAQ from "./FAQ";
import EnquiryForm from "./EnquiryForm";

const statusStyles: Record<FeatureStatus, string> = {
  completed: "border-emerald-500/40 text-emerald-600 bg-emerald-500/10",
  "under-construction": "border-gold/40 text-gold bg-gold/10",
  planned: "border-border-strong text-off-white/70 bg-white/5",
  proposed: "border-border text-muted bg-transparent",
};

const statusLabels: Record<FeatureStatus, string> = {
  completed: "Completed",
  "under-construction": "Under construction",
  planned: "Planned",
  proposed: "Proposed",
};

const locationIcons = [Landmark, Building2, TreePine, Navigation];

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
};

interface BourdillonContentProps {
  residences?: Property[];
  progress?: ProgressUpdate[];
  siteMedia?: SiteMedia;
}

export default function BourdillonContent({
  residences = [],
  progress = bourdillon.progress,
  siteMedia = bourdillon.siteMedia,
}: BourdillonContentProps) {
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

  const scrollToEnquiry = (location: string) => {
    trackEvent("click_brochure_cta", { project: "bourdillon", location });
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  const specRows = [
    { icon: Tag, label: "Current Status", value: bourdillon.status },
    { icon: Home, label: "Project Type", value: "Private residence" },
    { icon: MapPin, label: "Location", value: "Bourdillon Road, Ikoyi" },
    { icon: CalendarCheck, label: "Completion", value: "Confirmed on enquiry" },
    { icon: Banknote, label: "Pricing", value: "Private enquiry", highlight: true },
  ];

  return (
    <div className="bg-obsidian">
      {/* ---------- 1. Hero / above-the-fold ---------- */}
      <section ref={heroRef} className="relative min-h-dvh w-full overflow-hidden flex items-end">
        <div className="absolute inset-0 overflow-hidden">
          <div className="bd-hero-img absolute inset-0 w-full h-[120%] -top-[10%]">
            <video
              src="/videos/morphix/bourdillon-site-film.mp4"
              poster={bourdillon.heroImage}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
        </div>

        {/* Render label — must stay visible on mobile */}
        <p className="absolute top-28 right-6 lg:right-12 z-20 text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full max-w-[220px] text-right">
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

            <h1 className="display-serif text-white mb-6">{bourdillon.name}</h1>

            <p className="text-lead text-white/85 max-w-xl mb-8">
              {bourdillon.positioning}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/10 backdrop-blur-sm rounded-full mb-10">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
              <span className="text-gold text-xs uppercase tracking-widest font-medium">
                {bourdillon.statusLabel}: {bourdillon.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Button onClick={() => scrollToEnquiry("hero")} className="px-10">
                Request the project brochure
              </Button>
              <a
                href="#progress"
                onClick={() => trackEvent("click_primary_cta", { project: "bourdillon", target: "progress" })}
                className="text-white/70 hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors inline-flex items-center gap-2"
              >
                View project progress
                <ArrowRight size={14} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 2. Spec card ---------- */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[var(--shadow-card)]"
          >
            <div className="relative aspect-video lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={bourdillon.heroImage}
                alt={bourdillon.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute top-4 left-4 text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                Illustrative render
              </span>
              <a
                href="#location"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide rounded-full border border-white/20 hover:bg-black/80 transition-colors"
              >
                <MapPin size={13} strokeWidth={1.5} className="text-gold" />
                Tap to view the location
              </a>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {specRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-b-0"
                >
                  <span className="flex items-center gap-3">
                    <row.icon size={16} strokeWidth={1.5} className="text-muted shrink-0" />
                    <span className="eyebrow text-gold">{row.label}</span>
                  </span>
                  <span
                    className={cn(
                      "font-sans font-bold text-right",
                      row.highlight ? "text-gold text-lg" : "text-off-white"
                    )}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 3. Project overview card ---------- */}
      <section className="pb-10 lg:pb-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-surface border border-border rounded-[var(--radius-lg)] p-8 lg:p-12 shadow-[var(--shadow-card)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-14">
              <div>
                <p className="eyebrow text-gold mb-4">The Project</p>
                <h2 className="display-serif-sm text-off-white">Project Overview</h2>
              </div>
              <div>
                <p className="text-lead text-off-white/85 leading-relaxed mb-6">
                  {bourdillon.vision.designIntent}
                </p>
                <p className="text-body text-muted leading-relaxed">
                  {bourdillon.vision.rationale}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <Home size={15} strokeWidth={1.5} className="text-gold" /> Private residence
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <Building2 size={15} strokeWidth={1.5} className="text-gold" /> Multi-floor with lift
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <MapPin size={15} strokeWidth={1.5} className="text-gold" /> Ikoyi, Lagos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 3.5 Available residences (linked listings) ---------- */}
      {residences.length > 0 && (
        <section className="pb-10 lg:pb-14">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow text-gold mb-4">Within this development</p>
                <h2 className="display-serif-sm text-off-white">Available residences</h2>
              </div>
              <Link
                href="/properties"
                className="text-sm text-muted hover:text-gold transition-colors hidden sm:flex items-center gap-2 shrink-0"
              >
                All properties <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {residences.map((property) => (
                <motion.div key={property.id} {...fadeUp}>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 4. What is being created ---------- */}
      <section className="pb-10 lg:pb-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-obsidian-light rounded-[var(--radius-lg)] p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-14">
              <div>
                <p className="eyebrow text-gold mb-4">Design Intent</p>
                <h2 className="display-serif-sm text-off-white">What is being created</h2>
              </div>
              <div className="flex flex-col gap-3">
                {bourdillon.vision.features.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center justify-between gap-4 border border-border bg-surface rounded-[var(--radius-sm)] px-5 py-4"
                  >
                    <span className="text-off-white/90 text-sm font-medium">{feature.label}</span>
                    <span
                      className={cn(
                        "shrink-0 text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border font-medium",
                        statusStyles[feature.status]
                      )}
                    >
                      {statusLabels[feature.status]}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-muted mt-2 leading-relaxed">
                  Items marked Proposed or Planned are not yet built and remain subject to approved
                  drawings and final specification.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 5. Construction progress + site media ---------- */}
      <section id="progress" className="pb-10 lg:pb-14 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="mb-10">
            <p className="eyebrow text-gold mb-4">What is happening now</p>
            <h2 className="display-serif-sm text-off-white">Construction progress</h2>
          </motion.div>

          <div className="space-y-6">
            {progress.map((update) => (
              <motion.article
                key={update.date + update.milestone}
                {...fadeUp}
                className="grid grid-cols-1 lg:grid-cols-2 bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]"
              >
                {update.image && (
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[360px]">
                    <Image
                      src={update.image}
                      alt={`${update.milestone} — ${update.imageLabel ?? "project image"}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {update.imageLabel && (
                      <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {update.imageLabel}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <p className="eyebrow text-gold text-[11px] mb-4">{update.date}</p>
                  <h3 className="display-serif-sm text-off-white mb-4">
                    {update.milestone}
                  </h3>
                  <p className="text-body text-muted leading-relaxed">{update.detail}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Site documentation — real footage & photos, not renders */}
          <motion.div {...fadeUp} className="mt-16">
            <p className="eyebrow text-gold mb-3">Gallery — site documentation</p>
            <p className="text-muted text-sm mb-8 max-w-xl">
              Real footage and photographs from the Bourdillon plot — not renders.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {siteMedia.clips.map((clip) => (
                <div
                  key={clip.src}
                  className="relative aspect-video rounded-[var(--radius-md)] overflow-hidden border border-border bg-black"
                >
                  <video
                    src={clip.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {clip.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {siteMedia.photos.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-border"
                >
                  <Image
                    src={photo.src}
                    alt={photo.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 6. Proof ---------- */}
      <ProofLibrary
        points={proofPoints}
        eyebrow="Proof"
        heading="Why Kreebz and this project are credible"
      />

      {/* ---------- 7. Neighbourhood highlights ---------- */}
      <section id="location" className="py-10 lg:py-14 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="mb-8">
            <p className="eyebrow text-gold mb-4">Location</p>
            <h2 className="display-serif-sm text-off-white">Neighbourhood Highlights</h2>
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bourdillon.locationFacts.map((fact, i) => {
              const Icon = locationIcons[i % locationIcons.length];
              return (
                <div
                  key={fact}
                  className="flex items-center gap-3 bg-panel rounded-[var(--radius-md)] px-5 py-4"
                >
                  <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gold shrink-0">
                    <Icon size={16} strokeWidth={1.5} />
                  </span>
                  <span className="text-white/90 text-sm font-medium leading-snug">{fact}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---------- 8. FAQ ---------- */}
      <FAQ
        items={bourdillon.faqs}
        heading="Bourdillon — questions & answers"
        eyebrow="Before you enquire"
      />

      {/* ---------- 9. Interested CTA + enquiry ---------- */}
      <section id="enquire" className="py-24 lg:py-32 scroll-mt-28">
        <div className="max-w-[800px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="eyebrow text-gold mb-4">Interested in Bourdillon?</p>
            <h2 className="display-serif-sm text-off-white mb-4">{bourdillon.cta.heading}</h2>
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
            className="bg-surface p-8 md:p-12 rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow-card)]"
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

          <motion.div {...fadeUp} className="mt-14 text-center">
            <Link
              href="/properties"
              className="font-sans font-semibold text-off-white hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              Browse all properties
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
