"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, RotateCcw, Map, List } from "lucide-react";
import {
  usePropertyFilters,
  pricePresets,
  type PropertyFilters,
} from "./PropertyFilterProvider";

type ViewMode = "list" | "split";

function FilterPill({
  label,
  active,
  children,
  open,
  onClick,
}: {
  label: string;
  active?: boolean;
  children: React.ReactNode;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`eyebrow inline-flex items-center gap-1.5 transition-colors duration-300 ${
          active ? "text-off-white" : "text-muted hover:text-off-white"
        }`}
      >
        {label}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onClick} aria-hidden="true" />
          <div className="absolute top-full left-0 mt-3 z-20 min-w-[220px] bg-obsidian-light border border-white/20 shadow-2xl shadow-black rounded-none p-4">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchBar({
  viewMode,
  onToggleView,
}: {
  viewMode: ViewMode;
  onToggleView: () => void;
}) {
  const {
    filters,
    setFilter,
    clearFilters,
    total,
    activeFilterCount,
    uniqueNeighbourhoods,
    uniqueTypes,
  } = usePropertyFilters();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showChip, setShowChip] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showChip) searchRef.current?.focus();
  }, [showChip]);

  const toggle = (name: string) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  const activePriceLabel = useActivePriceLabel(filters);

  return (
    <section className="w-full bg-obsidian dark-mode border-b border-border/20 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5">
        <div className="flex flex-col gap-6">
          {/* Top row: search + meta */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3 px-5 py-3 flex-1 max-w-xl bg-obsidian-light border border-white/10 rounded-none focus-within:border-gold/50 transition-colors duration-300">
              {showChip && (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 shrink-0"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--obsidian)",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Lagos, Nigeria
                  <button
                    onClick={() => setShowChip(false)}
                    aria-label="Remove location filter"
                    className="hover:text-obsidian-light transition-colors"
                  >
                    <X size={13} />
                  </button>
                </span>
              )}
              <input
                ref={searchRef}
                type="text"
                value={filters.query}
                onChange={(e) => setFilter("query", e.target.value)}
                placeholder="Enter address, neighbourhood, or property ID"
                className="flex-1 bg-transparent border-none outline-none text-off-white placeholder:text-muted text-sm min-w-0"
              />
              <button
                aria-label="Search"
                className="shrink-0 text-muted hover:text-gold transition-colors"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-6 lg:ml-auto">
              <p className="eyebrow text-muted">
                <span className="text-off-white">{total}</span> residence{total === 1 ? "" : "s"}
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="eyebrow inline-flex items-center gap-1.5 text-muted hover:text-off-white transition-colors"
                >
                  <RotateCcw size={13} />
                  Clear {activeFilterCount}
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => toggle("sort")}
                  className="eyebrow inline-flex items-center gap-1.5 text-muted hover:text-off-white transition-colors"
                >
                  Sort: {sortLabels[filters.sort]}
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
                    <div className="absolute top-full right-0 mt-3 z-20 min-w-[200px] bg-obsidian-light border border-white/20 shadow-2xl shadow-black rounded-none p-2">
                      {(Object.keys(sortLabels) as PropertyFilters["sort"][]).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setFilter("sort", key);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                            filters.sort === key
                              ? "bg-gold text-obsidian"
                              : "text-muted hover:text-off-white hover:bg-white/5"
                          }`}
                        >
                          {sortLabels[key]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <FilterPill
              label={filters.status === "all" ? "Status" : filters.status}
              active={filters.status !== "all"}
              open={openDropdown === "status"}
              onClick={() => toggle("status")}
            >
              {["all", "For Sale", "For Lease", "Off-Plan"].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setFilter("status", value as PropertyFilters["status"]);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors mb-1 last:mb-0 ${
                    filters.status === value
                      ? "bg-gold text-obsidian"
                      : "text-muted hover:text-off-white hover:bg-white/5"
                  }`}
                >
                  {value === "all" ? "All" : value}
                </button>
              ))}
            </FilterPill>

            <FilterPill
              label={activePriceLabel}
              active={filters.priceMin !== null || filters.priceMax !== null}
              open={openDropdown === "price"}
              onClick={() => toggle("price")}
            >
              <div className="space-y-1">
                {pricePresets.map((preset) => {
                  const selected =
                    filters.priceMin === preset.min && filters.priceMax === preset.max;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setFilter("priceMin", preset.min);
                        setFilter("priceMax", preset.max);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                        selected 
                          ? "bg-gold text-obsidian" 
                          : "text-muted hover:text-off-white hover:bg-white/5"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </FilterPill>

            <FilterPill
              label={bedBathLabel(filters.beds, filters.baths)}
              active={filters.beds !== null || filters.baths !== null}
              open={openDropdown === "bedbath"}
              onClick={() => toggle("bedbath")}
            >
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Min Bedrooms</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        onClick={() => setFilter("beds", filters.beds === n ? null : n)}
                        className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                          filters.beds === n
                            ? "bg-gold text-obsidian border-gold"
                            : "border-white/20 text-muted hover:text-off-white hover:bg-white/5"
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Min Bathrooms</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <button
                        key={n}
                        onClick={() => setFilter("baths", filters.baths === n ? null : n)}
                        className={`px-4 py-2 text-[11px] uppercase tracking-[0.1em] border transition-colors ${
                          filters.baths === n
                            ? "bg-gold text-obsidian border-gold"
                            : "border-white/20 text-muted hover:text-off-white hover:bg-white/5"
                        }`}
                      >
                        {n}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FilterPill>

            <FilterPill
              label={filters.type === "all" ? "Property Type" : filters.type}
              active={filters.type !== "all"}
              open={openDropdown === "type"}
              onClick={() => toggle("type")}
            >
              <div className="space-y-1">
                {["all", ...uniqueTypes].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter("type", value as PropertyFilters["type"]);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      filters.type === value
                        ? "bg-gold text-obsidian"
                        : "text-muted hover:text-off-white hover:bg-white/5"
                    }`}
                  >
                    {value === "all" ? "All Types" : value}
                  </button>
                ))}
              </div>
            </FilterPill>

            <FilterPill
              label={filters.neighbourhood === "all" ? "Neighbourhood" : filters.neighbourhood}
              active={filters.neighbourhood !== "all"}
              open={openDropdown === "neighbourhood"}
              onClick={() => toggle("neighbourhood")}
            >
              <div className="space-y-1 max-h-[240px] overflow-y-auto custom-scrollbar">
                {["all", ...uniqueNeighbourhoods].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter("neighbourhood", value as PropertyFilters["neighbourhood"]);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      filters.neighbourhood === value
                        ? "bg-gold text-obsidian"
                        : "text-muted hover:text-off-white hover:bg-white/5"
                    }`}
                  >
                    {value === "all" ? "All Neighbourhoods" : value}
                  </button>
                ))}
              </div>
            </FilterPill>

            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-2 eyebrow text-muted hover:text-gold transition-colors duration-300 ml-2"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>

          {/* Results headline */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-2">
            <h1 className="font-serif text-off-white font-light" style={{ fontSize: "28px", lineHeight: 1.2 }}>
              Luxury listings {filters.status !== "all" ? `for ${filters.status.toLowerCase()}` : ""} in Lagos
            </h1>
            <div className="flex items-center gap-6">
              <p className="eyebrow text-muted hidden lg:block">
                {total} {total === 1 ? "result" : "results"}
              </p>
              <button
                onClick={onToggleView}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2 eyebrow text-muted hover:text-off-white hover:border-gold transition-all duration-300"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
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
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
};

function bedBathLabel(beds: number | null, baths: number | null) {
  if (beds && baths) return `${beds}+ BD / ${baths}+ BA`;
  if (beds) return `${beds}+ BD`;
  if (baths) return `${baths}+ BA`;
  return "Bed / Bath";
}

function useActivePriceLabel(filters: PropertyFilters) {
  if (filters.priceMin === null && filters.priceMax === null) return "Price";
  const preset = pricePresets.find(
    (p) => p.min === filters.priceMin && p.max === filters.priceMax
  );
  if (preset) return preset.label;
  if (filters.priceMin !== null && filters.priceMax === null) return `$${(filters.priceMin / 1_000_000).toFixed(0)}M+`;
  if (filters.priceMin === null && filters.priceMax !== null) return `Under $${(filters.priceMax / 1_000_000).toFixed(0)}M`;
  return `$${(filters.priceMin! / 1_000_000).toFixed(0)}M – $${(filters.priceMax! / 1_000_000).toFixed(0)}M`;
}
