"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

const filters = ["Status", "Price", "Bed / Bath", "Property Type"];

export default function SearchBar() {
  const [showChip, setShowChip] = useState(true);

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "#111111", borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Search Input (pill) */}
          <div className="input-pill flex items-center gap-3 px-5 py-3">
            {showChip && (
              <span
                className="inline-flex items-center gap-2 px-3 py-1 shrink-0"
                style={{
                  backgroundColor: "var(--surface-chip)",
                  color: "var(--off-white)",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Lagos, Nigeria
                <button
                  onClick={() => setShowChip(false)}
                  aria-label="Remove location filter"
                  className="hover:text-gold transition-colors"
                >
                  <X size={13} />
                </button>
              </span>
            )}
            <input
              type="text"
              placeholder="Enter your location, address, or property ID"
              className="flex-1 bg-transparent border-none outline-none text-off-white placeholder:text-muted text-sm min-w-0"
            />
            <button
              aria-label="Search"
              className="shrink-0 text-gold hover:text-gold-hover transition-colors"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-6">
            {filters.map((filter) => (
              <button
                key={filter}
                className="eyebrow text-off-white/80 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5"
              >
                {filter}
                <ChevronDown size={13} />
              </button>
            ))}

            {/* All Filters pill (center-ish) */}
            <button
              className="inline-flex items-center gap-2 px-5 py-2 eyebrow text-off-white/90 hover:text-gold hover:border-gold transition-colors duration-300"
              style={{
                border: "1px solid var(--border-strong)",
                borderRadius: "9999px",
              }}
            >
              <SlidersHorizontal size={13} />
              All Filters
            </button>

            {/* View toggle (far right) */}
            <button className="eyebrow text-off-white/80 hover:text-gold transition-colors duration-300 inline-flex items-center gap-1.5 md:ml-auto">
              View: Map and List
              <ChevronDown size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
