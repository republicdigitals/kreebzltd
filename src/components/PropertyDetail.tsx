"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Share2,
  Printer,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  BedDouble,
  Bath,
  Home,
  Tag,
  Banknote,
  Maximize2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Property } from "@/data/properties";
import { getProjectBySlug } from "@/data/projects";
import Button from "./ui/Button";
import FloorPlanViewer from "./FloorPlanViewer";
import ViewingModal from "./ViewingModal";

import { useSavedProperties } from "@/context/SavedPropertiesContext";
import { useScrollLock } from "@/hooks/useScrollLock";

interface PropertyDetailProps {
  property: Property;
  nextProperty?: { slug: string; address: string };
  /** DB-backed project site clips — overrides the registry's file defaults. */
  projectClips?: { src: string; label: string }[];
  /** DB-backed project display name — overrides the registry name. */
  projectName?: string;
}

const fadeUp = {
  initial: { y: 24, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function PropertyDetail({ property, nextProperty, projectClips, projectName }: PropertyDetailProps) {
  const router = useRouter();
  const { savedIds, toggleSave } = useSavedProperties();
  const favourited = savedIds.has(property.id);

  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const key = "kreebz-recently-viewed";
      const raw = localStorage.getItem(key);
      const list: { slug: string; address: string; cover?: string; price?: number | null; type?: string }[] = raw ? JSON.parse(raw) : [];
      const cover = property.media?.find((m) => m.isCover)?.url || property.media?.[0]?.url;
      const entry = { slug: property.slug, address: property.address, cover, price: property.price ?? null, type: property.type };
      const next = [entry, ...list.filter((e) => e.slug !== property.slug)].slice(0, 6);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [property.slug, property.address, property.media, property.price, property.type]);

  useScrollLock(isLightboxOpen);

  const hasFloorPlans = property.floorPlans && property.floorPlans.length > 0;
  const addressPrivate = property.addressPublic === false;
  const displayAddress = addressPrivate
    ? `${property.neighbourhood}, ${property.city}`
    : property.address;
  const project = getProjectBySlug(property.projectSlug);
  const siteClips = projectClips ?? project?.siteMedia.clips ?? [];

  const photoGallery = property.gallery?.length
    ? property.gallery
    : property.image
      ? [property.image]
      : [];
  const photoCount = photoGallery.length;

  const nextPhoto = useCallback(() => setCurrentPhoto((i) => (i + 1) % photoCount), [photoCount]);
  const prevPhoto = useCallback(() => setCurrentPhoto((i) => (i - 1 + photoCount) % photoCount), [photoCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextPhoto, prevPhoto]);

  const openLightbox = (index: number) => {
    setCurrentPhoto(index);
    setIsLightboxOpen(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: displayAddress, text: `${displayAddress} — Kreebz`, url });
        return;
      }
      throw new Error("no native share");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        window.prompt("Copy this link:", url);
      }
    }
  };

  const handlePrint = () => window.print();

  const formatSqm = (v: number) => `${v.toLocaleString()} m²`;
  const specRows = [
    { icon: Tag, label: "Property Status", value: property.status },
    { icon: Home, label: "Property Type", value: property.type },
    property.beds > 0 && { icon: BedDouble, label: "Bedrooms", value: `${property.beds}` },
    property.baths > 0 && { icon: Bath, label: "Bathrooms", value: `${property.baths}` },
    property.internalSqm && { icon: Maximize2, label: "Internal size", value: formatSqm(property.internalSqm) },
    property.landSqm && { icon: Maximize2, label: "Land size", value: formatSqm(property.landSqm) },
    ((property.staffBeds ?? 0) > 0 || (property.staffBaths ?? 0) > 0) && {
      icon: BedDouble,
      label: "Staff quarters",
      value: [
        (property.staffBeds ?? 0) > 0 ? `${property.staffBeds} bed` : "",
        (property.staffBaths ?? 0) > 0 ? `${property.staffBaths} bath` : "",
      ].filter(Boolean).join(" / "),
    },
    (((property.parkingCount ?? 0) > 0) || property.parkingType) && {
      icon: Home,
      label: "Parking",
      value: [
        (property.parkingCount ?? 0) > 0 ? `${property.parkingCount}` : "",
        property.parkingType || "",
      ].filter(Boolean).join(" · "),
    },
    property.furnishing && { icon: Home, label: "Furnishing", value: property.furnishing },
    { icon: MapPin, label: "Neighbourhood", value: `${property.neighbourhood}, ${property.city}` },
    {
      icon: Banknote,
      label: property.status === "For Lease" ? "Lease Price" : "Property Price",
      value: property.priceOnRequest ? "Price on request" : property.price,
      highlight: true,
    },
  ].filter(Boolean) as { icon: typeof Tag; label: string; value: string; highlight?: boolean }[];

  return (
    <div className="bg-obsidian">
      {/* ---------- 1. Hero ---------- */}
      <section className="relative h-[62vh] min-h-[440px] md:h-[72vh] w-full overflow-hidden">
        {photoGallery[0] ? (
          <Image
            src={photoGallery[0]}
            alt={`${displayAddress} main photo`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-obsidian-light flex items-center justify-center">
            <span className="uppercase text-muted text-xs tracking-[0.25em]">
              {property.imagePlaceholder}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <button
          onClick={() => router.back()}
          className="absolute top-24 left-6 lg:left-12 z-20 flex items-center gap-2 px-5 py-2.5 bg-black/40 border border-white/15 rounded-full text-white text-xs font-medium backdrop-blur-md hover:bg-black/60 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={14} strokeWidth={1.5} /> Back
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-10">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="eyebrow text-gold-light mb-4 flex items-center gap-3">
              <MapPin size={13} strokeWidth={1.5} />
              {property.neighbourhood} &mdash; {property.city}
            </p>
            <h1 className="display-serif text-white max-w-4xl">{displayAddress}</h1>
          </motion.div>
        </div>

        {photoCount > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="md:hidden absolute bottom-6 right-6 z-10 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide border border-white/20 rounded-full"
          >
            1 / {photoCount} Photos
          </button>
        )}
      </section>

      {/* ---------- 1.5 Project banner (if this listing is part of a project) ---------- */}
      {project && (
        <section className="py-6">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div
              {...fadeUp}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-panel rounded-[var(--radius-md)] px-6 py-5"
            >
              <p className="text-white/80 text-sm leading-relaxed">
                This residence is part of the{" "}
                <span className="font-semibold text-white">{projectName ?? project.name}</span>{" "}
                development — real construction progress on site.
              </p>
              <Link
                href={project.url}
                className="shrink-0 inline-flex items-center gap-2 text-gold-light hover:text-gold text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                Explore the project <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ---------- 2. Spec card ---------- */}
      <section className="py-10 lg:py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-[var(--shadow-card)]"
          >
            {/* Photo + map pin */}
            <div className="relative aspect-video lg:aspect-auto lg:min-h-[420px]">
              {photoGallery[1] || property.image ? (
                <Image
                  src={photoGallery[1] ?? property.image!}
                  alt={`${displayAddress} exterior`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-obsidian-light" />
              )}
              <a
                href="#location"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide rounded-full border border-white/20 hover:bg-black/80 transition-colors"
              >
                <MapPin size={13} strokeWidth={1.5} className="text-gold" />
                Tap to view the location
              </a>
            </div>

            {/* Spec rows */}
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
                    className={`font-sans font-bold text-right ${
                      row.highlight ? "text-gold text-lg" : "text-off-white"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-6">
                <button
                  onClick={() => toggleSave(property.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-xs font-medium text-muted hover:border-gold hover:text-gold transition-colors"
                >
                  <Heart
                    size={14}
                    strokeWidth={1.5}
                    fill={favourited ? "var(--gold)" : "none"}
                    className={favourited ? "text-gold" : ""}
                  />
                  {favourited ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-xs font-medium text-muted hover:border-gold hover:text-gold transition-colors"
                >
                  <Share2 size={14} strokeWidth={1.5} /> {shared ? "Link copied" : "Share"}
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-xs font-medium text-muted hover:border-gold hover:text-gold transition-colors"
                >
                  <Printer size={14} strokeWidth={1.5} /> Print
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 3. Overview card ---------- */}
      <section className="pb-10 lg:pb-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-surface border border-border rounded-[var(--radius-lg)] p-8 lg:p-12 shadow-[var(--shadow-card)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-14">
              <div>
                <p className="eyebrow text-gold mb-4">The Residence</p>
                <h2 className="display-serif-sm text-off-white">Property Overview</h2>
              </div>
              <div>
                <p className="text-lead text-off-white/85 leading-relaxed">
                  {property.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <BedDouble size={15} strokeWidth={1.5} className="text-gold" /> {property.beds} Bedrooms
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <Bath size={15} strokeWidth={1.5} className="text-gold" /> {property.baths} Bathrooms
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <Home size={15} strokeWidth={1.5} className="text-gold" /> {property.type}
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-obsidian-light rounded-full text-sm font-medium text-off-white">
                    <Tag size={15} strokeWidth={1.5} className="text-gold" /> {property.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- 4. Interior details + floor plans ---------- */}
      {(property.rooms.length > 0 || hasFloorPlans) && (
      <section className="pb-10 lg:pb-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-obsidian-light rounded-[var(--radius-lg)] p-8 lg:p-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-14">
              <div>
                <p className="eyebrow text-gold mb-4">Inside The Home</p>
                <h2 className="display-serif-sm text-off-white">Interior Details</h2>
              </div>
              {property.rooms.length > 0 && (
              <div className="space-y-10">
                {property.rooms.map((room) => (
                  <div key={room.heading}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-gold shrink-0">
                        <Home size={14} strokeWidth={1.5} />
                      </span>
                      <h3 className="font-sans font-bold text-off-white text-lg">{room.heading}</h3>
                    </div>
                    <p className="text-body text-muted leading-relaxed pl-11">{room.body}</p>
                  </div>
                ))}
              </div>
              )}
            </div>

            {hasFloorPlans && (
              <div className="mt-14 pt-10 border-t border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <h3 className="font-sans font-bold text-off-white text-lg">Architectural Plans</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.floorPlans!.map((plan, index) => (
                      <button
                        key={plan.title}
                        onClick={() => setActiveFloorPlan(index)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                          activeFloorPlan === index
                            ? "bg-gold text-ink"
                            : "bg-surface border border-border text-muted hover:border-gold hover:text-gold"
                        }`}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-full h-[50vh] min-h-[380px] bg-surface border border-border rounded-[var(--radius-md)] overflow-hidden relative">
                  <FloorPlanViewer
                    floorPlans={property.floorPlans!}
                    activeIndex={activeFloorPlan}
                    onIndexChange={setActiveFloorPlan}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      )}

      {/* ---------- 4.5 Features, utilities & documentation — renders only for data that exists ---------- */}
      {(() => {
        const utilityRows = [
          property.powerDetails && { label: "Power", value: property.powerDetails },
          property.waterDetails && { label: "Water", value: property.waterDetails },
          property.internetDetails && { label: "Internet", value: property.internetDetails },
          property.securityDetails && { label: "Security", value: property.securityDetails },
          property.serviceCharge && { label: "Service charge", value: property.serviceCharge },
        ].filter(Boolean) as { label: string; value: string }[];
        const legalRows = [
          property.titleStatus && { label: "Title", value: property.titleStatus },
          property.tenure && { label: "Tenure", value: property.tenure },
          property.completionStatus && { label: "Completion", value: property.completionStatus },
          property.handoverDate && { label: "Handover", value: property.handoverDate },
          property.availabilityNote && { label: "Availability", value: property.availabilityNote },
          property.inspectionInfo && { label: "Inspections", value: property.inspectionInfo },
        ].filter(Boolean) as { label: string; value: string }[];
        const lists = [
          property.amenities?.length ? { title: "Amenities", items: property.amenities } : null,
          property.inclusions?.length ? { title: "Inclusions", items: property.inclusions } : null,
          property.exclusions?.length ? { title: "Exclusions", items: property.exclusions } : null,
        ].filter(Boolean) as { title: string; items: string[] }[];
        if (utilityRows.length === 0 && legalRows.length === 0 && lists.length === 0) return null;
        return (
          <section className="pb-10 lg:pb-14">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <motion.div
                {...fadeUp}
                className="bg-surface border border-border rounded-[var(--radius-lg)] p-8 lg:p-12 shadow-[var(--shadow-card)] space-y-12"
              >
                {lists.length > 0 && (
                  <div className={`grid grid-cols-1 gap-8 ${lists.length > 1 ? "md:grid-cols-" + Math.min(lists.length, 3) : ""}`}>
                    {lists.map((list) => (
                      <div key={list.title}>
                        <h3 className="eyebrow text-gold mb-5">{list.title}</h3>
                        <ul className="space-y-2.5">
                          {list.items.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-body text-off-white/85">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {utilityRows.length > 0 && (
                  <div>
                    <h3 className="eyebrow text-gold mb-5">Utilities & services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                      {utilityRows.map((row) => (
                        <div key={row.label} className="py-3.5 border-b border-border">
                          <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">{row.label}</p>
                          <p className="text-body text-off-white/85">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {legalRows.length > 0 && (
                  <div>
                    <h3 className="eyebrow text-gold mb-5">Documentation & availability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                      {legalRows.map((row) => (
                        <div key={row.label} className="py-3.5 border-b border-border">
                          <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">{row.label}</p>
                          <p className="text-body text-off-white/85">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* ---------- 4.6 Lease terms — only for lease listings with lease data ---------- */}
      {property.status === "For Lease" && (() => {
        const leaseRows = [
          property.leaseAnnualRent && { label: "Annual rent", value: property.leaseAnnualRent },
          property.leaseYearsUpfront != null && { label: "Years upfront", value: `${property.leaseYearsUpfront}` },
          property.leaseDeposit && { label: "Deposit", value: property.leaseDeposit },
          property.leaseAgencyFeePct != null && { label: "Agency fee", value: property.leaseAgencyFeePct === 0 ? "Waived" : `${property.leaseAgencyFeePct}%` },
          property.leaseLegalFeePct != null && { label: "Legal fee", value: property.leaseLegalFeePct === 0 ? "Waived" : `${property.leaseLegalFeePct}%` },
          property.leaseRenewalTerms && { label: "Renewal", value: property.leaseRenewalTerms },
        ].filter(Boolean) as { label: string; value: string }[];
        if (leaseRows.length === 0) return null;
        return (
          <section className="pb-10 lg:pb-14">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <motion.div
                {...fadeUp}
                className="bg-obsidian-light rounded-[var(--radius-lg)] p-8 lg:p-12"
              >
                <p className="eyebrow text-gold mb-4">Lease Terms</p>
                <h2 className="display-serif-sm text-off-white mb-8">What the lease looks like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                  {leaseRows.map((row) => (
                    <div key={row.label} className="py-3.5 border-b border-border">
                      <p className="text-xs uppercase tracking-[0.15em] text-muted mb-1">{row.label}</p>
                      <p className="text-body text-off-white/85">{row.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        );
      })()}

      {/* ---------- 5. Gallery ---------- */}
      {photoCount > 0 && (
        <section className="pb-10 lg:pb-14">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow text-gold mb-4">Photos</p>
                <h2 className="display-serif-sm text-off-white">Explore the full gallery</h2>
              </div>
              <span className="text-sm text-muted hidden sm:block">{photoCount} photos</span>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photoGallery.map((src, i) => (
                <motion.button
                  key={src + i}
                  {...fadeUp}
                  onClick={() => openLightbox(i)}
                  className="group relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-border text-left"
                  aria-label={`View photo ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${displayAddress} — photo ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={15} strokeWidth={1.5} />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- 5.5 Shared project site media ---------- */}
      {project && siteClips.length > 0 && (
        <section className="pb-10 lg:pb-14">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <motion.div {...fadeUp} className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow text-gold mb-4">From the site</p>
                <h2 className="display-serif-sm text-off-white">Real construction progress</h2>
              </div>
              <Link
                href={`${project.url}#progress`}
                className="text-sm text-muted hover:text-gold transition-colors hidden sm:flex items-center gap-2 shrink-0"
              >
                Full project documentation <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
            <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {siteClips.map((clip) => (
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
            </motion.div>
          </div>
        </section>
      )}

      {/* ---------- 6. Neighbourhood highlights ---------- */}
      <section id="location" className="pb-10 lg:pb-14 scroll-mt-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="mb-8">
            <p className="eyebrow text-gold mb-4">The Area</p>
            <h2 className="display-serif-sm text-off-white">Neighbourhood Highlights</h2>
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: MapPin, text: `${property.neighbourhood}, ${property.city}` },
              { icon: ShieldCheck, text: "Exact coordinates protected" },
              { icon: Eye, text: "Viewings by private appointment" },
              { icon: Home, text: "Inspected by the Kreebz team" },
            ].map((chip) => (
              <div
                key={chip.text}
                className="flex items-center gap-3 bg-panel rounded-[var(--radius-md)] px-5 py-4"
              >
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gold shrink-0">
                  <chip.icon size={16} strokeWidth={1.5} />
                </span>
                <span className="text-white/90 text-sm font-medium leading-snug">{chip.text}</span>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="text-sm text-muted mt-6 max-w-xl">
            Detailed location information is provided exclusively to verified clients to ensure
            the privacy of our residents.
          </motion.p>
        </div>
      </section>

      {/* ---------- 7. Interested CTA + next property ---------- */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            {...fadeUp}
            className="bg-panel rounded-[var(--radius-lg)] p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center gap-10"
          >
            <div className="flex-1">
              <p className="eyebrow text-gold mb-4">Enquiries</p>
              <h2 className="display-serif-sm text-white mb-3">
                Talk to the principal handling {displayAddress}
              </h2>
              <p className="text-white/60 leading-relaxed max-w-lg">
                Every Kreebz listing is physically inspected — inspection notes, detailed
                plans and availability are shared on request.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-start lg:items-end gap-5">
              <div className="text-left lg:text-right">
                <p className="font-sans font-semibold text-white">{property.principal.name}</p>
                <p className="text-white/50 text-sm">{property.principal.title}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {property.principal.phone && (
                  <a
                    href={`https://wa.me/${property.principal.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hello — I'm interested in ${property.address}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-[var(--radius-sm)] border border-white/20 text-white text-sm hover:border-gold hover:text-gold transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                <Button onClick={() => setIsModalOpen(true)} className="px-8">
                  Request a private viewing
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between mt-8">
            <Link
              href="/properties"
              className="text-sm text-muted hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} strokeWidth={1.5} /> All properties
            </Link>
            {nextProperty && (
              <Link
                href={`/property/${nextProperty.slug}`}
                className="font-sans font-semibold text-off-white hover:text-gold transition-colors inline-flex items-center gap-2"
              >
                Next Property — {nextProperty.address}
                <ArrowRight size={15} strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <ViewingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyTitle={displayAddress}
        propertyRef={`${property.address} [${property.slug}]`}
      />

      {/* ---------- Lightbox ---------- */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 md:p-8 relative z-20">
              <div className="font-sans font-semibold text-white text-lg tracking-wide hidden md:block">
                {property.address}
              </div>
              <div className="font-sans text-gold uppercase tracking-[0.2em] text-[11px] md:absolute md:left-1/2 md:-translate-x-1/2">
                {String(currentPhoto + 1).padStart(2, "0")} / {String(photoCount).padStart(2, "0")}
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                aria-label="Close gallery"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 relative w-full flex items-center justify-center overflow-hidden px-4 md:px-16 pb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full h-full max-w-7xl"
                >
                  {photoGallery[currentPhoto] ? (
                    <Image
                      src={photoGallery[currentPhoto]}
                      alt={`${displayAddress} — photo ${currentPhoto + 1}`}
                      fill
                      quality={100}
                      className="object-contain"
                      sizes="100vw"
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {photoCount > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/40 border border-white/10 rounded-full text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/40 border border-white/10 rounded-full text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Mobile sticky action bar ---------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted mb-0.5">Price</span>
          <span className="font-sans font-bold text-lg text-off-white leading-none truncate">
            {property.priceOnRequest ? "On request" : property.price}
          </span>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="px-6 py-3 text-sm shrink-0">
          Request Viewing
        </Button>
      </div>
    </div>
  );
}
