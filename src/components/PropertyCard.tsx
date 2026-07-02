"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import type { Property } from "@/data/properties";

/*
 * ASSET SWAP: When `property.image` is supplied, the real photo renders.
 * Until then a #1a1a1a placeholder with the target filename is shown.
 */
export default function PropertyCard({ property }: { property: Property }) {
  const [favourited, setFavourited] = useState(false);

  return (
    <Link href={`/property/${property.id}`} className="block group">
      <article className="bg-obsidian">
        {/* Image (16:9), sharp corners, no shadow */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {property.image ? (
            <Image
              src={property.image}
              alt={property.address}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <span
                className="uppercase"
                style={{ color: "#D4AF37", fontSize: "11px", letterSpacing: "0.3em" }}
              >
                {property.imagePlaceholder}
              </span>
            </div>
          )}

          {/* Favourite heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setFavourited((f) => !f);
            }}
            aria-label="Save to favourites"
            className="absolute top-4 right-4 z-10 text-off-white hover:text-gold transition-colors"
          >
            <Heart
              size={22}
              fill={favourited ? "#D4AF37" : "none"}
              stroke={favourited ? "#D4AF37" : "currentColor"}
            />
          </button>
        </div>

        {/* Details */}
        <div className="pt-5">
          <p className="font-serif text-off-white" style={{ fontSize: "30px", lineHeight: 1.1 }}>
            {property.price}
          </p>
          <p
            className="uppercase text-off-white mt-3"
            style={{ fontSize: "12px", letterSpacing: "0.12em" }}
          >
            {property.address}
          </p>
          <p
            className="uppercase mt-2"
            style={{ fontSize: "11px", letterSpacing: "0.15em", color: "var(--muted)" }}
          >
            {property.beds} BR &nbsp;|&nbsp; {property.baths} BA &nbsp;|&nbsp; {property.neighbourhood}
          </p>
        </div>

        {/* Exclusive bar */}
        <div
          className="mt-5 py-3 text-center"
          style={{ backgroundColor: "#1a1a1a", borderTop: "1px solid var(--border)" }}
        >
          <span
            className="uppercase text-gold"
            style={{ fontSize: "11px", letterSpacing: "0.3em" }}
          >
            Kreebz Exclusive
          </span>
        </div>
      </article>
    </Link>
  );
}
