"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, RotateCcw, Map, List, SlidersHorizontal } from "lucide-react";
import { usePropertyFilters, type PropertyFilters } from "./PropertyFilterProvider";

type ViewMode = "list" | "split";

const statusHeadlines: Record<PropertyFilters["status"], string> = {
  "all": "Homes and investments in Lagos",
  "For Sale": "Homes and investments for sale",
  "For Lease": "Homes for rent in Lagos",
  "Off-Plan": "Off-plan homes in Lagos",
};

export default function SearchBar({
  viewMode,
  onToggleView,
  onOpenFilters,
}: {
  viewMode: ViewMode;
  onToggleView: () => void;
  onOpenFilters: () => void;
}) {
  const {
    filters,
    setFilter,
    clearFilters,
    total,
    activeFilterCount,
  } = usePropertyFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showChip, setShowChip] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState(filters.query);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== filters.query) {
        setFilter("query", localQuery);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localQuery, filters.query, setFilter]);

  useEffect(() => {
    if (filters.query === "" && localQuery !== "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalQuery("");
    }
  }, [filters.query, localQuery]);

  useEffect(() => {
    if (!showChip) searchRef.current?.focus();
  }, [showChip]);

  const toggle = (name: string) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  return (
    <section className="w-full bg-obsidian border-b border-border/20 relative z-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-5">
        <div className="flex flex-col gap-4 lg:gap-6">
          {/* Row 1: search field + meta controls */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <div className="flex items-center gap-3 px-4 lg:px-5 py-3 flex-1 max-w-xl bg-obsidian-light border border-border rounded-full focus-within:border-gold/50 transition-colors duration-300">
              {showChip && (
                <span className="hidden lg:inline-flex items-center gap-2 px-3 py-1 shrink-0 bg-obsidian border border-gold/30 rounded-full text-gold-light uppercase text-[11px] tracking-[0.1em]">
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
                ref={searchRef}
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search area, address, or property"
                className="flex-1 bg-transparent border-none outline-none text-off-white placeholder:text-muted text-sm min-w-0"
              />
              <button
                aria-label="Search"
                className="shrink-0 text-muted hover:text-gold transition-colors"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Meta: count · filters · sort — single compact row on mobile too */}
            <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 lg:ml-auto">
              <p className="eyebrow text-muted whitespace-nowrap">
                <span className="text-off-white">{total}</span> residence{total === 1 ? "" : "s"}
              </p>

              <div className="flex items-center gap-3 lg:gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="eyebrow inline-flex items-center gap-1.5 text-muted hover:text-off-white transition-colors"
                  >
                    <RotateCcw size={12} />
                    <span className="hidden sm:inline">Clear</span> {activeFilterCount}
                  </button>
                )}

                <button
                  onClick={onOpenFilters}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 eyebrow text-off-white bg-obsidian-light border border-border rounded-full hover:border-gold/50 transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-ink-fixed text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => toggle("sort")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 eyebrow text-muted bg-obsidian-light border border-border rounded-full hover:text-off-white hover:border-gold/50 transition-colors"
                  >
                    <span className="hidden sm:inline">Sort:</span> {sortLabels[filters.sort]}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${
                        openDropdown === "sort" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === "sort" && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => toggle("sort")} aria-hidden="true" />
                      <div className="absolute top-full right-0 mt-3 z-20 min-w-[200px] bg-obsidian border border-border shadow-card rounded-[var(--radius-sm)] p-2">
                        {(Object.keys(sortLabels) as PropertyFilters["sort"][]).map((key) => (
                          <button
                            key={key}
                            onClick={() => {
                              setFilter("sort", key);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                              filters.sort === key
                                ? "bg-gold text-ink-fixed"
                                : "text-muted hover:text-off-white hover:bg-white/5"
                            }`}
                          >
                            {sortLabelsFull[key]}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results headline */}
          <div className="flex items-end justify-between border-t border-border/20 pt-4 lg:pt-6">
            <h1 className="font-serif font-light text-off-white" style={{ fontSize: "clamp(24px, 3.2vw, 40px)", lineHeight: 1.15 }}>
              {statusHeadlines[filters.status]}
            </h1>
            <div className="flex items-center gap-6 shrink-0">
              <button
                onClick={onToggleView}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2 eyebrow text-gold bg-obsidian border border-gold/40 rounded-full hover:bg-gold/5 hover:border-gold transition-all duration-300"
                aria-label={viewMode === "list" ? "Show map and list" : "Show list only"}
              >
                {viewMode === "list" ? <Map size={14} /> : <List size={14} />}
                {viewMode === "list" ? "Map and List" : "List Only"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const sortLabels: Record<PropertyFilters["sort"], string> = {
  featured: "Featured",
  "price-asc": "Price ↑",
  "price-desc": "Price ↓",
  newest: "Newest",
};

const sortLabelsFull: Record<PropertyFilters["sort"], string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};
