"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Share2, Printer, ArrowLeft, ChevronLeft, ChevronRight, X, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import type { Property } from "@/data/properties";
import Button from "./ui/Button";
import FloorPlanViewer from "./FloorPlanViewer";
import Breadcrumbs from "./Breadcrumbs";
import ViewingModal from "./ViewingModal";

import { useSavedProperties } from "@/context/SavedPropertiesContext";

export default function PropertyDetail({ property }: { property: Property }) {
  const router = useRouter();
  const { savedIds, toggleSave } = useSavedProperties();
  const favourited = savedIds.has(property.id);
  
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const hasFloorPlans = property.floorPlans && property.floorPlans.length > 0;

  const photoGallery = property.gallery?.length
    ? property.gallery
    : property.image
      ? [property.image]
      : [];
  const photoCount = photoGallery.length;

  const nextPhoto = () => setCurrentPhoto((i) => (i + 1) % photoCount);
  const prevPhoto = () => setCurrentPhoto((i) => (i - 1 + photoCount) % photoCount);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, photoCount]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    // Desktop: Full cinematic animations
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline();

      tl.from(".reveal-title", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(".reveal-meta", {
        y: 10,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");

      gsap.from(".gallery-container", {
        scrollTrigger: {
          trigger: ".gallery-container",
          start: "top 85%",
        },
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "power2.out"
      });

      // Room reveals
      const rooms = gsap.utils.toArray('.room-section') as HTMLElement[];
      rooms.forEach((room) => {
        gsap.from(room, {
          scrollTrigger: {
            trigger: room,
            start: "top 85%"
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Principal card sticky reveal
      gsap.from(".principal-card", {
        scrollTrigger: {
          trigger: ".principal-card",
          start: "top 85%"
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      });
    });

    // Mobile: Lightweight fade-ins
    mm.add("(max-width: 767px)", () => {
      gsap.from(".gallery-container", { opacity: 0, duration: 0.8 });
      gsap.from(".content-header", { opacity: 0, duration: 0.8, delay: 0.2 });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-obsidian">
      
      {/* 1. Header (Title Card) Above the Gallery */}
      <div className="content-header text-center py-16 px-6 relative max-w-[1400px] mx-auto">
        <div className="flex justify-center mb-8">
          <Breadcrumbs 
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/#properties" },
              { label: property.address }
            ]} 
          />
        </div>
        
        <h1 className="reveal-title font-serif text-off-white font-light leading-[1.1]" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
          {property.address}
        </h1>
        <p className="reveal-title uppercase mt-6 tracking-[0.3em] text-[11px] text-gold-light/70">
          {property.neighbourhood} &mdash; {property.city}
        </p>
        
        <div className="reveal-meta flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-muted">
          <span>{property.status}</span>
          <span className="w-[1px] h-3 bg-white/20 hidden sm:block" />
          <span>{property.type}</span>
          <span className="w-[1px] h-3 bg-white/20 hidden sm:block" />
          <span>{property.beds} Beds</span>
          <span className="w-[1px] h-3 bg-white/20 hidden sm:block" />
          <span>{property.baths} Baths</span>
          <span className="w-[1px] h-3 bg-white/20 hidden sm:block" />
          <span className="text-gold font-semibold text-[13px]">{property.price}</span>
        </div>
      </div>

      {/* 2. Editorial Masonry Gallery */}
      <div className="gallery-container relative w-full max-w-[1600px] mx-auto px-4 md:px-8 mb-8 flex gap-2 md:gap-4">
        {/* Main large image */}
        <div className="relative w-full md:w-2/3 h-[50vh] md:h-[65vh] overflow-hidden group">
          {photoGallery[0] ? (
            <Image
              src={photoGallery[0]}
              alt={`${property.address} main photo`}
              fill
              priority
              className="object-cover cursor-pointer group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
              onClick={() => { setCurrentPhoto(0); setIsLightboxOpen(true); }}
            />
          ) : (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <span className="uppercase text-gold-light/50 text-[11px] tracking-[0.3em]">
                {property.imagePlaceholder}
              </span>
            </div>
          )}
          
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 flex items-center gap-3 px-5 py-3 bg-black/40 border border-white/10 rounded-sm uppercase tracking-[0.2em] text-[10px] font-semibold text-off-white backdrop-blur-md shadow-xl hover:bg-black/60 hover:text-gold active:scale-95 transition-all duration-300"
            aria-label="Go back"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline font-medium">Back</span>
          </button>
          
          {/* Mobile "View Photos" overlay */}
          <div 
            className="md:hidden absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md text-off-white text-[10px] uppercase tracking-[0.2em] border border-white/20"
            onClick={() => { setCurrentPhoto(0); setIsLightboxOpen(true); }}
          >
            1 / {photoCount} Photos
          </div>
        </div>
        
        {/* Side images stack */}
        <div className="hidden md:flex w-1/3 flex-col gap-4 h-[65vh]">
          <div className="relative flex-1 overflow-hidden group">
            {photoGallery[1] ? (
              <Image 
                src={photoGallery[1]} 
                alt="Photo 2" 
                fill 
                className="object-cover cursor-pointer group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
                onClick={() => { setCurrentPhoto(1); setIsLightboxOpen(true); }} 
              />
            ) : (
              <div className="absolute inset-0 bg-obsidian-light/50" />
            )}
          </div>
          
          <div className="relative flex-1 overflow-hidden group">
            {photoGallery[2] ? (
              <Image 
                src={photoGallery[2]} 
                alt="Photo 3" 
                fill 
                className="object-cover cursor-pointer group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
                onClick={() => { setCurrentPhoto(2); setIsLightboxOpen(true); }} 
              />
            ) : (
              <div className="absolute inset-0 bg-obsidian-light/50" />
            )}
            
            {/* View All Photos Overlay on the last visible image */}
            {photoCount > 3 && (
              <div 
                className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors duration-500 flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                onClick={() => { setCurrentPhoto(0); setIsLightboxOpen(true); }}
              >
                <div className="px-6 py-3 border border-white/30 backdrop-blur-md bg-black/40 text-off-white uppercase tracking-[0.2em] text-[10px] font-semibold flex items-center gap-3 hover:text-gold transition-colors">
                  View All {photoCount} Photos
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action links */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-end gap-8 py-6 mb-12 border-b border-border/20">
          <button
            onClick={() => toggleSave(property.id)}
            className="inline-flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] text-muted hover:text-gold active:scale-95 transition-all duration-300"
          >
            <Heart
              size={16}
              strokeWidth={1.5}
              fill={favourited ? "var(--gold)" : "none"}
              className={favourited ? "text-gold" : "currentColor"}
            />
            Favorites
          </button>
          <button className="inline-flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] text-muted hover:text-off-white transition-colors duration-300">
            <Share2 size={16} strokeWidth={1.5} /> Share
          </button>
          <button className="inline-flex items-center gap-3 uppercase tracking-[0.2em] text-[10px] text-muted hover:text-off-white transition-colors duration-300">
            <Printer size={16} strokeWidth={1.5} /> Print
          </button>
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-16 lg:gap-24 pb-32">
          {/* Left: description */}
          <div>
            {property.rooms.map((room) => (
              <div key={room.heading} className="room-section mb-16">
                <div className="w-8 h-[1px] mb-6 bg-gold" />
                <h2 className="uppercase text-gold-light/90 mb-6 tracking-[0.25em] text-[11px] font-medium">
                  {room.heading}
                </h2>
                <p className="font-serif text-off-white/90 font-light leading-[1.8] text-[20px] lg:text-[22px]">
                  {room.body}
                </p>
              </div>
            ))}
            
            <div className="room-section mb-16">
              <div className="w-8 h-[1px] mb-6 bg-gold" />
              <h2 className="uppercase text-gold-light/90 mb-6 tracking-[0.25em] text-[11px] font-medium">
                Overview
              </h2>
              <p className="font-serif text-off-white/90 font-light leading-[1.8] text-[20px] lg:text-[22px]">
                {property.description}
              </p>
            </div>

            {/* Floor Plan Section */}
            {hasFloorPlans && (
              <div className="room-section mb-16 pt-16 border-t border-border/20">
                <div className="w-8 h-[1px] mb-6 bg-gold" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                  <h2 className="uppercase text-gold-light/90 tracking-[0.25em] text-[11px] font-medium">
                    Architectural Plans
                  </h2>
                  <div className="flex flex-wrap items-center gap-3">
                    {property.floorPlans!.map((plan, index) => (
                      <button
                        key={plan.title}
                        onClick={() => setActiveFloorPlan(index)}
                        className="px-5 py-2 uppercase tracking-[0.15em] text-[9px] transition-all duration-300"
                        style={{
                          border: "1px solid rgba(255,255,255,0.1)",
                          backgroundColor: activeFloorPlan === index ? "var(--gold)" : "transparent",
                          color: activeFloorPlan === index ? "var(--obsidian)" : "var(--off-white)",
                        }}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-full h-[50vh] min-h-[400px] border border-white/5 bg-black/20 rounded-sm overflow-hidden relative">
                  <FloorPlanViewer
                    floorPlans={property.floorPlans!}
                    activeIndex={activeFloorPlan}
                    onIndexChange={setActiveFloorPlan}
                  />
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="room-section mb-8 pt-16 border-t border-border/20">
              <div className="w-8 h-[1px] mb-6 bg-gold" />
              <h2 className="uppercase text-gold-light/90 mb-8 tracking-[0.25em] text-[11px] font-medium flex items-center gap-3">
                <MapPin size={14} /> Location
              </h2>
              <div className="w-full aspect-video bg-obsidian-light border border-border/20 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Abstract map pattern background */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                
                <p className="uppercase text-[11px] tracking-[0.25em] text-gold relative z-10">{property.neighbourhood}</p>
                <p className="text-[13px] text-off-white/80 mt-2 relative z-10">{property.city}</p>
                <div className="mt-8 px-6 py-3 border border-gold/20 bg-gold/5 text-[11px] text-gold uppercase tracking-[0.2em] relative z-10">
                  Exact Coordinates Protected
                </div>
                <p className="mt-6 font-sans text-xs tracking-wide text-muted max-w-xs text-center relative z-10">
                  Detailed location information is provided exclusively to verified clients to ensure the privacy of our residents.
                </p>
              </div>
            </div>
          </div>

          {/* Right: sticky principal card */}
          <aside>
            <div className="principal-card lg:sticky lg:top-32 p-10 bg-obsidian-light border border-border/20 text-center">
              {/* Headshot placeholder */}
              <div className="w-24 h-24 rounded-full mb-6 flex items-center justify-center mx-auto bg-obsidian border border-border/30" aria-hidden="true">
                <span className="uppercase text-gold-light/60 tracking-[0.2em] text-[10px]">
                  Photo
                </span>
              </div>
              <p className="font-serif text-off-white text-[26px] font-light">
                {property.principal.name}
              </p>
              <p className="uppercase mt-3 tracking-[0.25em] text-[10px] text-muted">
                {property.principal.title}
              </p>
              
              <div className="w-full h-[1px] bg-border/30 my-8" />
              
              <a
                href={property.principal?.phone ? `tel:${property.principal.phone.replace(/\s+/g, "")}` : "#"}
                className="block text-off-white hover:text-gold transition-colors font-sans tracking-[0.1em] text-[14px]"
              >
                {property.principal.phone}
              </a>
              
              <Button className="w-full mt-8" onClick={() => setIsModalOpen(true)}>
                Request Private Viewing
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <ViewingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        propertyTitle={property.address} 
      />

      {/* Full-Screen Cinematic Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between p-6 md:p-8 relative z-20">
              <div className="font-serif text-off-white text-lg tracking-wide hidden md:block">
                {property.address}
              </div>
              <div className="font-sans text-gold uppercase tracking-[0.2em] text-[11px] md:absolute md:left-1/2 md:-translate-x-1/2">
                {String(currentPhoto + 1).padStart(2, '0')} / {String(photoCount).padStart(2, '0')}
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-off-white transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Immersive Image Container */}
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
                      alt={`${property.address} — photo ${currentPhoto + 1}`}
                      fill
                      quality={100}
                      className="object-contain"
                      sizes="100vw"
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {photoCount > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/40 border border-white/10 rounded-full text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-black/40 border border-white/10 rounded-full text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-md border-t border-border/20 p-4 pb-safe flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted mb-0.5">Price</span>
          <span className="font-serif text-lg text-off-white leading-none">{property.price}</span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold text-obsidian px-6 py-3 uppercase tracking-[0.2em] text-[10px] font-semibold hover:bg-gold-hover transition-colors duration-300"
        >
          Request Viewing
        </button>
      </div>
    </div>
  );
}
