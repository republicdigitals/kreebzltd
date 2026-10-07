"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePropertyFilters } from "./PropertyFilterProvider";
import PropertyIndexRow from "./PropertyIndexRow";
import RentalRequestForm from "./RentalRequestForm";
import ConciergeCTA from "./ConciergeCTA";

export default function PropertyListings() {
  const { filtered, activePropertyId, setActivePropertyId, filters } = usePropertyFilters();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Only animate cards on initial mount — not on every filter change
  useEffect(() => {
    if (hasAnimated.current || filtered.length === 0 || !containerRef.current) return;
    hasAnimated.current = true;
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
  }, [filtered]);

  return (
    <section className="bg-obsidian px-6 py-6 lg:px-12" ref={containerRef}>
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
        <div className="border-b border-border/25">
          {filtered.map((property, index) => {
            const isActive = activePropertyId === property.id;
            return (
              <div
                key={property.id}
                id={`property-${property.id}`}
                onMouseEnter={() => setActivePropertyId(property.id)}
                onMouseLeave={() => setActivePropertyId(null)}
                className={`property-item @container transition-colors duration-500 px-3 -mx-3 lg:px-4 lg:-mx-4 rounded-[var(--radius-lg)] ${
                  isActive ? "bg-gold/[0.04]" : ""
                }`}
              >
                <PropertyIndexRow property={property} index={index} />
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
