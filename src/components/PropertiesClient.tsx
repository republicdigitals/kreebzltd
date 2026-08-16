"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePropertyFilters } from "./PropertyFilterProvider";
import SearchBar from "./SearchBar";
import PropertyListings from "./PropertyListings";
import MapPlaceholder from "./MapPlaceholder";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";

type ViewMode = "list" | "split";

export default function PropertiesClient() {
  const { filtered, activePropertyId, setActivePropertyId } = usePropertyFilters();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialView: ViewMode = searchParams.get("view") === "split" ? "split" : "list";
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const setView = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
      const params = new URLSearchParams(searchParams.toString());
      if (mode === "split") params.set("view", "split");
      else params.delete("view");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleView = useCallback(() => {
    setView(viewMode === "list" ? "split" : "list");
  }, [setView, viewMode]);

  const handlePinClick = (id: string) => {
    setActivePropertyId(id);
    const el = document.getElementById(`property-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const showMap = viewMode === "split";

  return (
    <div className="bg-obsidian pt-28 md:pt-[120px] flex flex-col">
      {/* Search / filter bar */}
      <div className="border-b border-border/20 bg-obsidian sticky top-28 md:top-[120px] z-40">
        <SearchBar
          viewMode={viewMode}
          onToggleView={toggleView}
          onOpenFilters={() => setIsMobileFiltersOpen(true)}
        />
      </div>

      {/* Content area: list or split */}
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[300px] shrink-0 border-r border-border/20 bg-obsidian z-10">
          <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="sticky top-[200px] h-[calc(100vh-200px)] w-full overflow-y-auto custom-scrollbar">
            <FilterSidebar />
          </div>
        </div>

        <div className="flex-1 flex min-w-0">
          {/* List panel (native scroll) */}
          <div className={`pb-20 ${showMap ? "w-full xl:w-1/2" : "w-full"}`}>
            <PropertyListings />
          </div>

          {/* Map panel (Sticky sidebar) */}
          {showMap && (
            <div className="hidden xl:block w-1/2 border-l border-border/20 bg-obsidian-light">
              <div className="sticky top-[200px] h-[calc(100vh-200px)]">
                <MapPlaceholder
                  properties={filtered}
                  activePropertyId={activePropertyId}
                  onPinClick={handlePinClick}
                  onPinHover={setActivePropertyId}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
      />
    </div>
  );
}
