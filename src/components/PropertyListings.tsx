"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePropertyFilters } from "./PropertyFilterProvider";
import PropertyCard from "./PropertyCard";
import RentalRequestForm from "./RentalRequestForm";
import ConciergeCTA from "./ConciergeCTA";

export default function PropertyListings() {
  const { filtered, activePropertyId, setActivePropertyId, filters } = usePropertyFilters();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filtered.length > 0 && containerRef.current) {
      const cards = gsap.utils.toArray('.property-item');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all"
        }
      );
    }
  }, [filtered]);

  return (
    <section className="bg-obsidian px-6 py-6 lg:px-8" ref={containerRef}>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center w-full">
          {filters.status === "For Lease" ? (
            <div className="w-full max-w-2xl mx-auto">
              <RentalRequestForm />
            </div>
          ) : (
            <div className="w-full">
              <ConciergeCTA />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {filtered.map((property) => {
            const isActive = activePropertyId === property.id;
            return (
              <div
                key={property.id}
                id={`property-${property.id}`}
                onMouseEnter={() => setActivePropertyId(property.id)}
                onMouseLeave={() => setActivePropertyId(null)}
                className={`property-item transition-all duration-500 p-2 -m-2 rounded-xl ${
                  isActive ? "bg-black/5" : ""
                }`}
              >
                <PropertyCard property={property} />
              </div>
            );
          })}
        </div>
      )}
      
      {/* Show the Matchmaking CTA at the bottom of the list only if there are results */}
      {filtered.length > 0 && <ConciergeCTA />}
    </section>
  );
}
