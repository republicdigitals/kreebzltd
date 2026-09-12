"use client";

import { usePropertyFilters, pricePresets, type PropertyFilters } from "./PropertyFilterProvider";
import { RotateCcw } from "lucide-react";
import FilterSection from "./ui/FilterSection";
import FilterButton from "./ui/FilterButton";

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
        <FilterSection title="Status">
          <div className="flex flex-col gap-2">
            {["all", "For Sale", "For Lease", "Off-Plan"].map((value) => (
              <FilterButton
                key={value}
                label={value === "all" ? "All Properties" : value}
                isSelected={filters.status === value}
                onClick={() => setFilter("status", value as PropertyFilters["status"])}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="flex flex-col gap-2">
            {pricePresets.map((preset) => (
              <FilterButton
                key={preset.label}
                label={preset.label}
                isSelected={filters.priceMin === preset.min && filters.priceMax === preset.max}
                onClick={() => {
                  setFilter("priceMin", preset.min);
                  setFilter("priceMax", preset.max);
                }}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Min Bedrooms">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <FilterButton
                key={n}
                label={`${n}+`}
                isSelected={filters.beds === n}
                onClick={() => setFilter("beds", filters.beds === n ? null : n)}
                className="w-12 h-10 flex items-center justify-center"
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Min Bathrooms">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <FilterButton
                key={n}
                label={`${n}+`}
                isSelected={filters.baths === n}
                onClick={() => setFilter("baths", filters.baths === n ? null : n)}
                className="w-12 h-10 flex items-center justify-center"
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Property Type">
          <div className="flex flex-col gap-2">
            {["all", ...uniqueTypes].map((value) => (
              <FilterButton
                key={value}
                label={value === "all" ? "All Types" : value}
                isSelected={filters.type === value}
                onClick={() => setFilter("type", value as PropertyFilters["type"])}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Neighbourhood">
          <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {["all", ...uniqueNeighbourhoods].map((value) => (
              <FilterButton
                key={value}
                label={value === "all" ? "All Locations" : value}
                isSelected={filters.neighbourhood === value}
                onClick={() => setFilter("neighbourhood", value as PropertyFilters["neighbourhood"])}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
