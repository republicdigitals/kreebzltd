"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePropertyFilters } from "./PropertyFilterProvider";
import SearchBar from "./SearchBar";
import PropertyListings from "./PropertyListings";
import MapPlaceholder from "./MapPlaceholder";

type ViewMode = "list" | "split";

export default function PropertiesClient() {
  const { filtered, activePropertyId, setActivePropertyId } = usePropertyFilters();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialView: ViewMode = searchParams.get("view") === "split" ? "split" : "list";
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);

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
    <div className="min-h-[100dvh] bg-obsidian pt-24 md:pt-28 flex flex-col">
      {/* Search / filter bar */}
      <div className="shrink-0 z-20 border-b border-border/20 bg-obsidian">
        <SearchBar viewMode={viewMode} onToggleView={toggleView} />
      </div>

      {/* Content area: list or split */}
      <div className="flex-1 flex overflow-hidden">
        {/* List panel */}
        <div className={`h-full overflow-y-auto custom-scrollbar ${showMap ? "w-full lg:w-1/2" : "w-full"}`}>
          <PropertyListings />
        </div>

        {/* Map panel */}
        {showMap && (
          <div className="hidden lg:block w-1/2 h-full border-l border-border/20 bg-obsidian-light">
            <MapPlaceholder
              properties={filtered}
              activePropertyId={activePropertyId}
              onPinClick={handlePinClick}
              onPinHover={setActivePropertyId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
