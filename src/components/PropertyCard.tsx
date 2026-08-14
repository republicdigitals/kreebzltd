"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import type { Property } from "@/data/properties";
import RichTooltip from "./ui/RichTooltip";

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  const [favourited, setFavourited] = useState(false);

  return (
    <Link href={`/property/${property.id}`} className="block group h-full active:scale-[0.98] transition-transform duration-300">
      <article
        className="h-full flex flex-col overflow-hidden transition-all duration-700 bg-transparent hover:bg-obsidian-light"
      >
        {/* Cinematic Aspect Ratio Image (4:5) */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {property.image ? (
            <Image
              src={property.image}
              alt={`${property.type} in ${property.neighbourhood} — ${property.address}`}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.1,0.25,1)] md:group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-obsidian-light"
              aria-hidden="true"
            >
              <span className="uppercase text-[10px] text-muted tracking-[0.3em]">
                {property.imagePlaceholder || "IMAGE PENDING"}
              </span>
            </div>
          )}
          
          {/* Subtle gradient overlay to darken bottom of image for contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700" />

          {/* Favourite heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setFavourited((f) => !f);
            }}
            aria-label="Save to favourites"
            className="absolute top-4 right-4 z-10 text-off-white/80 hover:text-gold transition-colors duration-300"
          >
            <Heart
              size={20}
              fill={favourited ? "var(--gold)" : "none"}
              stroke={favourited ? "var(--gold)" : "currentColor"}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Details — Minimal, Quiet Luxury Typography */}
        <div className="px-6 pt-6 pb-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="shrink-0 px-3 py-1 text-[9px] uppercase tracking-[0.25em] bg-gold/10 border border-gold/30 rounded-sm text-gold-light backdrop-blur-md">
                {property.status}
              </span>
              <p className="uppercase text-[10px] tracking-[0.2em] text-muted text-right">
                {property.type}
              </p>
            </div>
            
            <RichTooltip content="Subject to contract and availability" position="top">
              <p className="font-serif text-off-white font-light text-[clamp(24px,2.5vw,28px)] leading-[1.1] mt-5">
                {property.price}
              </p>
            </RichTooltip>
            
            <p className="text-off-white/90 font-light mt-3 text-sm leading-relaxed tracking-wide truncate">
              {property.address}
            </p>
            <p className="text-muted text-xs mt-1 tracking-wider">
              {property.neighbourhood}, Lagos
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-border/50 flex items-center justify-between">
            <p className="uppercase text-[10px] tracking-[0.15em] text-muted">
              {property.beds} Beds &nbsp;|&nbsp; {property.baths} Baths
            </p>
            
            {/* Minimal view details arrow indicator */}
            <span className="text-gold opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 transition-all duration-500 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
