"use client";

import { X, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { usePropertyFilters, pricePresets, type PropertyFilters } from "./PropertyFilterProvider";
import FilterSection from "./ui/FilterSection";
import FilterButton from "./ui/FilterButton";

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
  useScrollLock(isOpen);

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
            className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-obsidian border-l border-border shadow-2xl flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif font-light text-[24px] text-off-white">Filters</h2>
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

            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
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
                <div className="flex flex-col gap-2">
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

            <div className="p-6 border-t border-border bg-obsidian-light">
              <button
                onClick={onClose}
                className="w-full py-4 bg-gold text-ink-fixed text-[15px] font-medium rounded-[var(--radius-pill)] hover:bg-gold-hover transition-colors"
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
