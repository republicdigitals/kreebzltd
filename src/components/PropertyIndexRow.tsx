"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";
import { useSavedProperties } from "@/context/SavedPropertiesContext";
import type { Property } from "@/data/properties";

interface PropertyIndexRowProps {
  property: Property;
  index: number;
}

export default function PropertyIndexRow({ property, index }: PropertyIndexRowProps) {
  const { savedIds, toggleSave } = useSavedProperties();
  const favourited = savedIds.has(property.id);
  const flip = index % 2 === 1;

  return (
    <Link
      href={`/property/${property.slug}`}
      className="block group active:scale-[0.99] transition-transform duration-300"
    >
      <article className="grid items-center gap-6 border-t border-border/25 py-10 @3xl:grid-cols-12 @3xl:gap-14 @3xl:py-14">
        {/* Image */}
        <div className={flip ? "@3xl:order-2 @3xl:col-span-7" : "@3xl:col-span-7"}>
          <div className="listing-grade relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-lg)] bg-obsidian-light">
            {property.image ? (
              <Image
                src={property.image}
                alt={`${property.type} in ${property.neighbourhood}, ${property.address}`}
                fill
                quality={88}
                className="object-cover object-center transition-transform duration-[1.8s] ease-[cubic-bezier(0.25,0.1,0.25,1)] md:group-hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
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

            <span className="absolute top-5 left-5 z-10 inline-flex items-center px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[9px] uppercase tracking-[0.18em] text-gold-light">
              {property.status}
            </span>

            <span className="absolute bottom-5 left-5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[9px] uppercase tracking-[0.16em] text-white/80">
              <ShieldCheck size={11} strokeWidth={1.5} className="text-gold-light" />
              Inspected by Kreebz
            </span>

            <button
              onClick={(e) => {
                e.preventDefault();
                toggleSave(property.id);
              }}
              aria-label="Save to favourites"
              className="absolute top-5 right-5 z-10 text-white/90 hover:text-gold transition-colors duration-300 drop-shadow-md"
            >
              <Heart
                size={20}
                fill={favourited ? "var(--gold)" : "none"}
                stroke={favourited ? "var(--gold)" : "currentColor"}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Copy */}
        <div className={flip ? "@3xl:order-1 @3xl:col-span-5" : "@3xl:col-span-5"}>
          <p className="uppercase text-[10px] tracking-[0.28em] text-muted">
            {property.type} &nbsp;/&nbsp; {property.neighbourhood}
          </p>

          <h3 className="font-serif font-light text-off-white text-[clamp(26px,3.4cqw,40px)] leading-[1.12] mt-5">
            {property.address}
          </h3>

          <p className="text-muted text-sm mt-2 tracking-wide">
            {property.neighbourhood}, Lagos
          </p>

          <p className="font-serif text-gold-light text-[clamp(20px,2.2cqw,26px)] mt-7">
            {property.price}
          </p>

          <div className="mt-7 pt-6 border-t border-border/40 flex items-center justify-between gap-4">
            <p className="uppercase text-[10px] tracking-[0.18em] text-muted">
              {property.beds} Beds &nbsp;&nbsp; {property.baths} Baths
            </p>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gold opacity-100 md:opacity-0 md:-translate-x-2 transition-all duration-500 ease-out md:group-hover:opacity-100 md:group-hover:translate-x-0">
              View residence
              <ArrowRight size={15} strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
