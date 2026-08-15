"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Share2, Printer, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Property } from "@/data/properties";
import Button from "./ui/Button";
import FloorPlanViewer from "./FloorPlanViewer";
import Breadcrumbs from "./Breadcrumbs";
import ViewingModal from "./ViewingModal";

/*
 * ASSET SWAP: When `property.image` is supplied, the hero gallery renders the
 * real photo. Until then a #1a1a1a placeholder with the target filename shows.
 */
export default function PropertyDetail({ property }: { property: Property }) {
  const router = useRouter();
  const [favourited, setFavourited] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "floor" | "map">("photos");
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const hasFloorPlans = property.floorPlans && property.floorPlans.length > 0;
  const floorPlan = hasFloorPlans ? property.floorPlans![activeFloorPlan] : null;

  const photoGallery = property.gallery?.length
    ? property.gallery
    : property.image
      ? [property.image]
      : [];
  const photoCount = photoGallery.length;
  const currentPhotoSrc = photoCount > 0 ? photoGallery[currentPhoto] : null;

  const tabs: { key: typeof activeTab; label: string; disabled?: boolean }[] = [
    { key: "photos", label: `Photos (${property.photoCount})` },
    { key: "floor", label: "Floor Plan" },
    { key: "map", label: "Map" },
  ];

  const nextPhoto = () => setCurrentPhoto((i) => (i + 1) % photoCount);
  const prevPhoto = () => setCurrentPhoto((i) => (i - 1 + photoCount) % photoCount);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    
    // Desktop: Full cinematic animations
    mm.add("(min-width: 768px)", () => {
      // Gallery initial reveal
      gsap.from(".gallery-container", {
        opacity: 0,
        scale: 0.98,
        duration: 1.5,
        ease: "power2.out"
      });

      // Content reveal sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".content-header",
          start: "top 80%",
        }
      });

      tl.from(".reveal-title", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })
      .from(".reveal-price", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6")
      .from(".reveal-meta", {
        y: 10,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");

      // Room reveals
      const rooms = gsap.utils.toArray('.room-section') as HTMLElement[];
      rooms.forEach((room, i) => {
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
      {/* Gallery */}
      <div className="gallery-container relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-obsidian-light border-y border-border/20">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-20 flex items-center gap-3 px-5 py-3 bg-black/40 border border-gold/30 rounded-sm uppercase tracking-[0.2em] text-[10px] font-semibold text-gold-light backdrop-blur-md shadow-xl hover:bg-black/60 hover:border-gold/60 hover:text-gold active:scale-95 transition-all duration-300"
          aria-label="Go back"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span className="hidden sm:inline font-medium">Back</span>
        </button>

        {activeTab === "photos" && (
          <div className="absolute inset-0">
            {currentPhotoSrc ? (
              <Image
                src={currentPhotoSrc}
                alt={`${property.address} — photo ${currentPhoto + 1} of ${photoCount}`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="uppercase text-gold-light/50 text-[11px] tracking-[0.3em]">
                  {property.imagePlaceholder}
                </span>
              </div>
            )}
            
            {/* Gradient overlay for gallery */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            {/* Photo controls */}
            {photoCount > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 border border-gold/30 rounded-sm text-gold-light backdrop-blur-md shadow-xl hover:bg-black/60 hover:border-gold/60 hover:text-gold active:scale-90 transition-all duration-300"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/40 border border-gold/30 rounded-sm text-gold-light backdrop-blur-md shadow-xl hover:bg-black/60 hover:border-gold/60 hover:text-gold active:scale-90 transition-all duration-300"
                  aria-label="Next photo"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-none bg-black/40 backdrop-blur-md text-off-white border border-white/20 font-serif text-[14px] tracking-[0.1em]">
                  {String(currentPhoto + 1).padStart(2, '0')} / {String(photoCount).padStart(2, '0')}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "floor" && (
          <div className="absolute inset-0 flex flex-col">
            {hasFloorPlans && floorPlan ? (
              <FloorPlanViewer
                floorPlans={property.floorPlans!}
                activeIndex={activeFloorPlan}
                onIndexChange={setActiveFloorPlan}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <p className="font-serif text-off-white font-light" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                  Floor plans available upon request
                </p>
                <p className="mt-4 font-sans text-[15px] tracking-wide text-muted max-w-md mx-auto">
                  Contact a Kreebz principal to receive the full architectural package.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "map" && (
          <div className="absolute inset-0 bg-obsidian border-y border-border/20 flex flex-col items-center justify-center">
            <p className="uppercase text-[11px] tracking-[0.25em] text-gold">{property.neighbourhood}</p>
            <p className="text-[13px] text-off-white/80 mt-1">{property.city}</p>
            <div className="mt-6 px-6 py-3 border border-gold/20 bg-gold/5 text-[11px] text-gold uppercase tracking-[0.2em]">
              Map View Unavailable
            </div>
            <p className="mt-4 font-sans text-xs tracking-wide text-muted max-w-xs text-center">
              Detailed location information is provided exclusively to verified clients to ensure the privacy of our residents.
            </p>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-8 py-8 border-b border-border/20">
          <div className="flex flex-col gap-4">
            {/* Gallery tabs */}
            <div className="flex flex-wrap items-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-6 py-3 uppercase tracking-[0.2em] text-[10px] font-medium active:scale-95 transition-all duration-300"
                  style={{
                    border: activeTab === tab.key ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.1)",
                    backgroundColor: activeTab === tab.key ? "rgba(201, 169, 104, 0.1)" : "transparent",
                    color: activeTab === tab.key ? "var(--gold)" : "var(--muted)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Floor plan sub-navigation */}
            {activeTab === "floor" && hasFloorPlans && (
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
            )}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setFavourited((f) => !f)}
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
        </div>

        {/* Content Header */}
        <div className="content-header text-center py-20 relative">
          <div className="absolute top-8 left-0 right-0 flex justify-center">
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
          <div className="w-12 h-[1px] mx-auto my-10 bg-gold/50" />
          <p className="reveal-price font-serif text-off-white font-light" style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.1 }}>
            {property.price}
          </p>
          <div className="reveal-meta flex flex-wrap items-center justify-center gap-6 mt-8 uppercase tracking-[0.2em] text-[11px] text-muted">
            <span>{property.status}</span>
            <span className="w-[1px] h-3 bg-white/20" />
            <span>{property.type}</span>
            <span className="w-[1px] h-3 bg-white/20" />
            <span>{property.beds} Beds</span>
            <span className="w-[1px] h-3 bg-white/20" />
            <span>{property.baths} Baths</span>
          </div>
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
            <div className="room-section mb-8">
              <div className="w-8 h-[1px] mb-6 bg-gold" />
              <h2 className="uppercase text-gold-light/90 mb-6 tracking-[0.25em] text-[11px] font-medium">
                Overview
              </h2>
              <p className="font-serif text-off-white/90 font-light leading-[1.8] text-[20px] lg:text-[22px]">
                {property.description}
              </p>
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
                href={`tel:${property.principal.phone.replace(/\s+/g, "")}`}
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
    </div>
  );
}
