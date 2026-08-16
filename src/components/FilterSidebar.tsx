"use client";

import { usePropertyFilters, pricePresets, type PropertyFilters } from "./PropertyFilterProvider";
import { RotateCcw } from "lucide-react";

export default function FilterSidebar() {
  const {
    filters,
    setFilter,
    clearFilters,
    uniqueNeighbourhoods,
    uniqueTypes,
    activeFilterCount,
  } = usePropertyFilters();

  return (
    <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="h-full flex flex-col bg-obsidian-light p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-xl text-off-white font-light">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="eyebrow inline-flex items-center gap-1.5 text-muted hover:text-gold transition-colors"
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-10">
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
          <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
    </div>
  );
}
