"use client";

import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePropertyFilters, pricePresets, type PropertyFilters } from "./PropertyFilterProvider";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
  const {
    filters,
    setFilter,
    clearFilters,
    uniqueNeighbourhoods,
    uniqueTypes,
    activeFilterCount,
    total,
  } = usePropertyFilters();

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-obsidian border-l border-white/10 shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-serif text-xl text-off-white font-light">Filters</h2>
              <div className="flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="eyebrow inline-flex items-center gap-1.5 text-muted hover:text-gold transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span className="sr-only sm:not-sr-only">Reset</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-muted hover:text-off-white transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              {/* Status Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Status</h3>
                <div className="flex flex-col gap-2">
                  {["all", "For Sale", "For Lease", "Off-Plan"].map((value) => {
                    const isSelected = filters.status === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setFilter("status", value as PropertyFilters["status"])}
                        className={`text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {value === "all" ? "All Properties" : value}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Price Range Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Price Range</h3>
                <div className="flex flex-col gap-2">
                  {pricePresets.map((preset) => {
                    const isSelected = filters.priceMin === preset.min && filters.priceMax === preset.max;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => {
                          setFilter("priceMin", preset.min);
                          setFilter("priceMax", preset.max);
                        }}
                        className={`text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Bedrooms Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Min Bedrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((n) => {
                    const isSelected = filters.beds === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setFilter("beds", isSelected ? null : n)}
                        className={`w-12 h-10 flex items-center justify-center text-[11px] uppercase tracking-[0.1em] transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {n}+
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Bathrooms Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Min Bathrooms</h3>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => {
                    const isSelected = filters.baths === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setFilter("baths", isSelected ? null : n)}
                        className={`w-12 h-10 flex items-center justify-center text-[11px] uppercase tracking-[0.1em] transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {n}+
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Property Type Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Property Type</h3>
                <div className="flex flex-col gap-2">
                  {["all", ...uniqueTypes].map((value) => {
                    const isSelected = filters.type === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setFilter("type", value as PropertyFilters["type"])}
                        className={`text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {value === "all" ? "All Types" : value}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Neighbourhood Filter */}
              <section>
                <h3 className="eyebrow text-muted mb-4">Neighbourhood</h3>
                <div className="flex flex-col gap-2">
                  {["all", ...uniqueNeighbourhoods].map((value) => {
                    const isSelected = filters.neighbourhood === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setFilter("neighbourhood", value as PropertyFilters["neighbourhood"])}
                        className={`text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors border ${
                          isSelected
                            ? "bg-gold/10 border-gold/50 text-gold"
                            : "border-white/10 text-off-white/70 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        {value === "all" ? "All Locations" : value}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-white/10 bg-obsidian-light">
              <button
                onClick={onClose}
                className="w-full py-4 bg-gold text-obsidian uppercase tracking-[0.2em] text-[11px] font-semibold hover:bg-gold-hover transition-colors"
              >
                View {total} Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
