"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Printer } from "lucide-react";
import type { Property } from "@/data/properties";

/*
 * ASSET SWAP: When `property.image` is supplied, the hero gallery renders the
 * real photo. Until then a #1a1a1a placeholder with the target filename shows.
 */
export default function PropertyDetail({ property }: { property: Property }) {
  const [favourited, setFavourited] = useState(false);
  const [activeTab, setActiveTab] = useState<"photos" | "floor" | "map">("photos");

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "photos", label: `Photos (${property.photoCount})` },
    { key: "floor", label: "Floor Plan" },
    { key: "map", label: "Map" },
  ];

  return (
    <div className="bg-obsidian">
      {/* Gallery */}
      <div className="relative w-full aspect-[21/9] mt-20 overflow-hidden">
        {property.image ? (
          <Image
            src={property.image}
            alt={property.address}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <span
              className="uppercase"
              style={{ color: "#D4AF37", fontSize: "12px", letterSpacing: "0.3em" }}
            >
              {property.imagePlaceholder}
            </span>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className="flex flex-wrap items-center justify-between gap-6 py-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {/* Gallery tabs (pills) */}
          <div className="flex flex-wrap items-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-5 py-2 eyebrow transition-colors duration-300"
                style={{
                  border: "1px solid var(--border-strong)",
                  borderRadius: "9999px",
                  backgroundColor: activeTab === tab.key ? "var(--gold)" : "transparent",
                  color: activeTab === tab.key ? "var(--obsidian)" : "var(--off-white)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setFavourited((f) => !f)}
              className="inline-flex items-center gap-2 eyebrow text-off-white/80 hover:text-gold transition-colors"
            >
              <Heart
                size={15}
                fill={favourited ? "#D4AF37" : "none"}
                stroke={favourited ? "#D4AF37" : "currentColor"}
              />
              Favorites
            </button>
            <button className="inline-flex items-center gap-2 eyebrow text-off-white/80 hover:text-gold transition-colors">
              <Share2 size={15} /> Share
            </button>
            <button className="inline-flex items-center gap-2 eyebrow text-off-white/80 hover:text-gold transition-colors">
              <Printer size={15} /> Print
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center py-14">
          <h1
            className="font-serif text-off-white font-normal"
            style={{ fontSize: "clamp(30px, 4vw, 52px)" }}
          >
            {property.address}
          </h1>
          <p
            className="uppercase mt-3"
            style={{ fontSize: "11px", letterSpacing: "0.25em", color: "var(--muted)" }}
          >
            {property.neighbourhood} &mdash; {property.city}
          </p>
          <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: "var(--gold)" }} />
          <p className="font-serif text-off-white" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
            {property.price}
          </p>
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-12 pb-24">
          {/* Left: description */}
          <div>
            {property.rooms.map((room) => (
              <div key={room.heading} className="mb-12">
                <div className="w-10 h-px mb-4" style={{ backgroundColor: "var(--gold)" }} />
                <h2
                  className="uppercase text-off-white mb-4"
                  style={{ fontSize: "12px", letterSpacing: "0.25em" }}
                >
                  {room.heading}
                </h2>
                <p
                  className="font-serif text-off-white"
                  style={{ fontSize: "18px", lineHeight: 1.7 }}
                >
                  {room.body}
                </p>
              </div>
            ))}
            <div className="mb-4">
              <div className="w-10 h-px mb-4" style={{ backgroundColor: "var(--gold)" }} />
              <h2
                className="uppercase text-off-white mb-4"
                style={{ fontSize: "12px", letterSpacing: "0.25em" }}
              >
                Overview
              </h2>
              <p
                className="font-serif text-off-white"
                style={{ fontSize: "18px", lineHeight: 1.7 }}
              >
                {property.description}
              </p>
            </div>
          </div>

          {/* Right: sticky principal card */}
          <aside>
            <div
              className="lg:sticky lg:top-28 p-8"
              style={{
                backgroundColor: "#111111",
                border: "1px solid var(--border)",
              }}
            >
              {/* Headshot placeholder */}
              <div
                className="w-20 h-20 rounded-full mb-5 flex items-center justify-center mx-auto"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <span
                  className="uppercase text-gold"
                  style={{ fontSize: "9px", letterSpacing: "0.2em" }}
                >
                  Photo
                </span>
              </div>
              <p className="font-serif text-off-white text-center" style={{ fontSize: "22px" }}>
                {property.principal.name}
              </p>
              <p
                className="uppercase text-center mt-2"
                style={{ fontSize: "10px", letterSpacing: "0.25em", color: "var(--muted)" }}
              >
                {property.principal.title}
              </p>
              <a
                href={`tel:${property.principal.phone.replace(/\s+/g, "")}`}
                className="block text-center mt-4 text-off-white hover:text-gold transition-colors"
                style={{ fontSize: "15px", letterSpacing: "0.05em" }}
              >
                {property.principal.phone}
              </a>
              <button className="btn-primary w-full mt-6">Connect</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
