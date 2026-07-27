"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { type Property } from "@/data/properties";

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface PropertyFilters {
  query: string;
  status: "For Sale" | "For Lease" | "Off-Plan" | "all";
  priceMin: number | null;
  priceMax: number | null;
  beds: number | null;
  baths: number | null;
  neighbourhood: string | "all";
  type: string | "all";
  sort: SortOption;
}

interface FilterContextValue {
  filters: PropertyFilters;
  filtered: Property[];
  total: number;
  activeFilterCount: number;
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  clearFilters: () => void;
  uniqueNeighbourhoods: string[];
  uniqueTypes: string[];
  activePropertyId: string | null;
  setActivePropertyId: (id: string | null) => void;
}

const PropertyFilterContext = createContext<FilterContextValue | null>(null);

const defaultFilters: PropertyFilters = {
  query: "",
  status: "all",
  priceMin: null,
  priceMax: null,
  beds: null,
  baths: null,
  neighbourhood: "all",
  type: "all",
  sort: "featured",
};

const pricePresets = [
  { label: "Any", min: null, max: null },
  { label: "Under $1M", min: null, max: 1_000_000 },
  { label: "$1M – $3M", min: 1_000_000, max: 3_000_000 },
  { label: "$3M – $5M", min: 3_000_000, max: 5_000_000 },
  { label: "$5M+", min: 5_000_000, max: null },
];

export { pricePresets };

function parseNumberParam(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function intentToStatus(intent: string | null): PropertyFilters["status"] {
  if (intent === "buy") return "For Sale";
  if (intent === "rent") return "For Lease";
  return "all";
}

function filtersFromParams(params: URLSearchParams): PropertyFilters {
  return {
    query: params.get("q") || params.get("location") || "",
    status:
      (params.get("status") as PropertyFilters["status"]) ||
      intentToStatus(params.get("intent")),
    priceMin: parseNumberParam(params.get("priceMin")),
    priceMax: parseNumberParam(params.get("priceMax")),
    beds: parseNumberParam(params.get("beds")),
    baths: parseNumberParam(params.get("baths")),
    neighbourhood: params.get("neighbourhood") || "all",
    type: params.get("type") || "all",
    sort: (params.get("sort") as SortOption) || "featured",
  };
}

function paramsFromFilters(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.priceMin !== null) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
  if (filters.beds !== null) params.set("beds", String(filters.beds));
  if (filters.baths !== null) params.set("baths", String(filters.baths));
  if (filters.neighbourhood !== "all") params.set("neighbourhood", filters.neighbourhood);
  if (filters.type !== "all") params.set("type", filters.type);
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  return params;
}

export function PropertyFilterProvider({ children, initialProperties }: { children: ReactNode; initialProperties: Property[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>(() => filtersFromParams(searchParams));
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  // Sync filter changes to URL query params
  useEffect(() => {
    const params = paramsFromFilters(filters);
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, pathname, router]);

  const setFilter = useCallback(<K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filtered = useMemo(() => {
    let result = initialProperties.filter((p) => {
      const matchesQuery =
        !filters.query ||
        [p.address, p.neighbourhood, p.principal.name, p.type]
          .join(" ")
          .toLowerCase()
          .includes(filters.query.toLowerCase());

      const matchesStatus = filters.status === "all" || p.status === filters.status;
      const matchesNeighbourhood = filters.neighbourhood === "all" || p.neighbourhood === filters.neighbourhood;
      const matchesType = filters.type === "all" || p.type === filters.type;
      const matchesBeds = filters.beds === null || p.beds >= filters.beds;
      const matchesBaths = filters.baths === null || p.baths >= filters.baths;
      const matchesPriceMin = filters.priceMin === null || p.priceValue >= filters.priceMin;
      const matchesPriceMax = filters.priceMax === null || p.priceValue <= filters.priceMax;

      return (
        matchesQuery &&
        matchesStatus &&
        matchesNeighbourhood &&
        matchesType &&
        matchesBeds &&
        matchesBaths &&
        matchesPriceMin &&
        matchesPriceMax
      );
    });

    switch (filters.sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.priceValue - a.priceValue);
        break;
      default:
        break;
    }

    return result;
  }, [filters, initialProperties]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.status !== "all") count++;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    if (filters.beds !== null) count++;
    if (filters.baths !== null) count++;
    if (filters.neighbourhood !== "all") count++;
    if (filters.type !== "all") count++;
    return count;
  }, [filters]);

  const uniqueNeighbourhoods = useMemo(
    () => Array.from(new Set(initialProperties.map((p) => p.neighbourhood))).sort(),
    [initialProperties]
  );

  const uniqueTypes = useMemo(
    () => Array.from(new Set(initialProperties.map((p) => p.type))).sort(),
    [initialProperties]
  );

  const value = useMemo(
    () => ({
      filters,
      filtered,
      total: filtered.length,
      activeFilterCount,
      setFilter,
      clearFilters,
      uniqueNeighbourhoods,
      uniqueTypes,
      activePropertyId,
      setActivePropertyId,
    }),
    [
      filters,
      filtered,
      activeFilterCount,
      setFilter,
      clearFilters,
      uniqueNeighbourhoods,
      uniqueTypes,
      activePropertyId,
    ]
  );

  return <PropertyFilterContext.Provider value={value}>{children}</PropertyFilterContext.Provider>;
}

export function usePropertyFilters() {
  const context = useContext(PropertyFilterContext);
  if (!context) {
    throw new Error("usePropertyFilters must be used within a PropertyFilterProvider");
  }
  return context;
}
