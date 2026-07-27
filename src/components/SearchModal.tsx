"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface LocationChild {
  id: string;
  name: string;
  image: string;
}

interface LocationRegion {
  id: string;
  name: string;
  image: string;
  children: LocationChild[];
}

const locations: LocationRegion[] = [
  {
    id: "lagos",
    name: "Lagos",
    image: "/images/hero-placeholder.jpg",
    children: [
      { id: "ikoyi", name: "Ikoyi", image: "/images/hero-placeholder.jpg" },
      { id: "victoria-island", name: "Victoria Island", image: "/images/hero-placeholder.jpg" },
      { id: "lekki", name: "Lekki", image: "/images/hero-placeholder.jpg" },
      { id: "lagos-island", name: "Lagos Island", image: "/images/hero-placeholder.jpg" },
      { id: "ikeja", name: "Ikeja", image: "/images/hero-placeholder.jpg" },
    ],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelect,
}: SearchModalProps) {
  const [selectedRegionId, setSelectedRegionId] = useState("lagos");
  const [hoveredChildId, setHoveredChildId] = useState<string | null>(null);

  const selectedRegion = useMemo(
    () => locations.find((r) => r.id === selectedRegionId) || locations[0],
    [selectedRegionId]
  );

  const hoveredChild = useMemo(() => {
    if (!hoveredChildId) return null;
    return selectedRegion.children.find((c) => c.id === hoveredChildId) || null;
  }, [hoveredChildId, selectedRegion]);

  const displayedImage = hoveredChild?.image || selectedRegion.image;

  const handleRegionClick = (regionId: string) => {
    setSelectedRegionId(regionId);
    setHoveredChildId(null);
  };

  const handleChildClick = (childName: string) => {
    onSelect(childName);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className={cn(
                  "fixed z-50 left-[50%] top-[50%] w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-2xl shadow-2xl",
                  "max-h-[85vh] md:max-h-[480px] bg-[#0f0f0f]/95 backdrop-blur-md"
                )}
              >
                <Dialog.Title className="sr-only">Select a location</Dialog.Title>
                <Dialog.Description className="sr-only">Choose a region and neighborhood to search for properties.</Dialog.Description>

                {/* Mobile close + drag handle */}
                <div className="md:hidden flex flex-col items-center pt-4 pb-2">
                  <div className="w-12 h-1 rounded-full bg-white/30 mb-4" />
                  <Dialog.Close asChild>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Close location selector"
                    >
                      <X size={20} className="text-off-white" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                  {/* Column 1: Primary Regions */}
                  <div className="border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6">
                    <h3 className="text-white/50 uppercase text-[11px] mb-4 tracking-[0.25em]">
                      Region
                    </h3>
                    <div className="overflow-y-auto max-h-[200px] md:max-h-[380px] pr-2 location-scrollbar">
                      {locations.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => handleRegionClick(region.id)}
                          onMouseEnter={() => {
                            setSelectedRegionId(region.id);
                            setHoveredChildId(null);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 text-left text-sm uppercase tracking-wider transition-all duration-200 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-gold",
                            selectedRegionId === region.id
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          <span>{region.name}</span>
                          <ChevronRight
                            size={16}
                            className={cn(
                              "transition-transform duration-200",
                              selectedRegionId === region.id
                                ? "text-white translate-x-0.5"
                                : "text-white/30"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Sub-locations */}
                  <div className="border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6">
                    <h3 className="text-white/50 uppercase text-[11px] mb-4 tracking-[0.25em]">
                      {selectedRegion.name} Neighbourhoods
                    </h3>
                    <div className="overflow-y-auto max-h-[200px] md:max-h-[380px] pr-2 location-scrollbar">
                      {selectedRegion.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child.name)}
                          onMouseEnter={() => setHoveredChildId(child.id)}
                          onMouseLeave={() => setHoveredChildId(null)}
                          className={cn(
                            "w-full px-4 py-3.5 text-left text-sm uppercase tracking-wider transition-all duration-200 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-gold",
                            hoveredChildId === child.id
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Featured Image */}
                  <div className="relative hidden md:block h-[200px] md:h-[420px] bg-obsidian">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={displayedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={displayedImage}
                          alt={`${hoveredChild?.name || selectedRegion.name} properties`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 33vw, 0vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <p className="text-white uppercase text-xs tracking-[0.25em] mb-1 opacity-70">
                        Viewing
                      </p>
                      <p className="text-white font-serif text-2xl">
                        {hoveredChild?.name || selectedRegion.name}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
