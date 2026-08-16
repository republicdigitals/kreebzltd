"use client";

import { useSavedProperties } from "@/context/SavedPropertiesContext";
import type { Property } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export default function SavedClient({ initialProperties }: { initialProperties: Property[] }) {
  const { savedIds } = useSavedProperties();
  
  // Filter initialProperties to only include ones that are still in savedIds
  // This helps when the user unsaves a property from this page - it will disappear.
  const displayProperties = initialProperties.filter(p => savedIds.has(p.id));

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-off-white mb-4">Saved Properties</h1>
        <p className="text-muted text-sm tracking-wide max-w-xl">
          Your curated collection of premium real estate. Return here to review your favorite properties or contact our concierge when you&apos;re ready to arrange a private viewing.
        </p>
      </div>

      {displayProperties.length === 0 ? (
        <div className="py-24 border-y border-border/20 text-center">
          <p className="font-serif text-2xl text-off-white mb-4">Your collection is empty</p>
          <p className="text-muted text-sm mb-8">You haven&apos;t saved any properties yet.</p>
          <Link 
            href="/#properties" 
            className="inline-block px-8 py-4 bg-gold text-obsidian font-medium tracking-[0.2em] text-[11px] uppercase hover:bg-gold-light transition-colors duration-300"
          >
            Explore Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
