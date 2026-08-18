"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, RotateCcw, Map, List, SlidersHorizontal } from "lucide-react";
import { usePropertyFilters, type PropertyFilters } from "./PropertyFilterProvider";

type ViewMode = "list" | "split";

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
    if (filters.query !== localQuery && filters.query === "") {
      setLocalQuery("");
    }
  }, [filters.query]);

  useEffect(() => {
    if (!showChip) searchRef.current?.focus();
  }, [showChip]);

  const toggle = (name: string) => {
    setOpenDropdown((current) => (current === name ? null : name));
  };

  return (
    <section className="w-full bg-obsidian border-b border-border/20 relative z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5">
        <div className="flex flex-col gap-6">
          {/* Top row: search + meta */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3 px-5 py-3 flex-1 max-w-xl bg-obsidian-light border border-white/10 rounded-none focus-within:border-gold/50 transition-colors duration-300">
              {showChip && (
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 shrink-0 bg-black/40 border border-gold/30 rounded-sm text-gold-light backdrop-blur-md shadow-xl uppercase text-[11px] tracking-[0.1em]"
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
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
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
              <div className="flex items-center gap-4">
                <button
                  onClick={onOpenFilters}
                  className="lg:hidden eyebrow inline-flex items-center gap-1.5 text-muted hover:text-off-white transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  Filters
                </button>

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
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2 eyebrow text-gold-light bg-black/40 border border-gold/30 rounded-sm backdrop-blur-md shadow-xl hover:bg-black/60 hover:border-gold/60 hover:text-gold transition-all duration-300"
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

