"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export interface Neighbourhood {
  id: string;
  name: string;
  image: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  neighbourhoods: Neighbourhood[];
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelect,
  neighbourhoods,
}: SearchModalProps) {
  // Fallback to prevent crash if array is empty
  const safeNeighbourhoods = useMemo(() => {
    return neighbourhoods?.length > 0 ? neighbourhoods : [
      { id: "ikoyi", name: "Ikoyi", image: "/images/hero-placeholder.jpg" }
    ];
  }, [neighbourhoods]);

  const [hoveredId, setHoveredId] = useState<string>(safeNeighbourhoods[0].id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Reset hover state when opened (update during render to avoid effect cascading)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setHoveredId(safeNeighbourhoods[0].id);
    }
  }

  const displayedImage = safeNeighbourhoods.find(n => n.id === hoveredId)?.image || safeNeighbourhoods[0].image;

  // Responsive font size calculation logic for arrow
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    // Use timeout to avoid synchronous setState inside effect
    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  const clampSize = () => {
    if (windowWidth === 0) return 40; // Default SSR
    if (windowWidth < 768) return 24;
    return 40; 
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
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-40 bg-obsidian"
              />
            </Dialog.Overlay>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[999] flex flex-col md:flex-row overflow-hidden bg-obsidian"
              >
                <Dialog.Title className="sr-only">Select a location</Dialog.Title>
                <Dialog.Description className="sr-only">Choose a neighborhood to search for properties.</Dialog.Description>

                {/* Left Column / Foreground (Mobile) */}
                <div className="w-full md:w-[45%] h-full md:h-full relative z-20 flex flex-col justify-center px-4 sm:px-6 md:px-16 pt-20 pb-8">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-8 left-6 md:left-16 p-3 rounded-full border border-white/10 text-white/50 hover:text-gold hover:border-gold/50 transition-colors z-50 backdrop-blur-md"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="absolute top-10 right-6 md:hidden z-50">
                    <p className="text-white/70 uppercase text-[10px] tracking-[0.25em]">Lagos Portfolio</p>
                  </div>

                  <div className="hidden md:block absolute top-10 left-32">
                    <p className="text-white/50 uppercase text-[10px] tracking-[0.25em] mb-2 border-b border-white/10 pb-2 inline-block">Region</p>
                    <p className="text-white/80 uppercase text-[12px] tracking-[0.2em]">Lagos</p>
                  </div>

                  <div data-lenis-prevent="true" onWheel={(e) => e.stopPropagation()} className="flex flex-col justify-center gap-4 md:gap-8 mt-auto md:mt-0 max-h-[70vh] overflow-y-auto location-scrollbar pr-4">
                    {safeNeighbourhoods.map((child, i) => (
                      <motion.button
                        key={child.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ delay: 0.1 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        onClick={() => {
                          onSelect(child.name);
                          onClose();
                        }}
                        onMouseEnter={() => setHoveredId(child.id)}
                        className={cn(
                          "group w-full flex items-center gap-6 text-left transition-all duration-700 py-2",
                          hoveredId === child.id ? "text-gold" : "text-white/20 hover:text-white/50"
                        )}
                      >
                        <span className="font-sans text-[10px] md:text-xs tracking-widest opacity-50 mb-auto mt-4 md:mt-6">
                          0{i + 1}
                        </span>
                        <span className={cn(
                          "font-serif font-light text-[clamp(36px,10vw,100px)] leading-[1] transition-all duration-700 origin-left break-words whitespace-normal",
                          hoveredId === child.id ? "italic translate-x-4 md:translate-x-8" : ""
                        )}>
                          {child.name}
                        </span>
                        
                        <div className="ml-auto flex items-center justify-center">
                          <ArrowRight 
                            size={clampSize()} 
                            strokeWidth={1}
                            className={cn(
                              "transition-all duration-700",
                              hoveredId === child.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                            )}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Right Column / Background */}
                <div className="absolute inset-0 md:relative md:inset-auto md:w-[55%] h-full z-10 md:z-20 bg-obsidian overflow-hidden pointer-events-none">
                  {/* Mobile dark gradient to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/90 to-transparent md:hidden z-10" />
                  
                  {/* Desktop smooth ultra-wide fade gradient */}
                  <div className="hidden md:block absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent z-10" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={displayedImage}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 0.85, scale: 1.02 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 origin-right"
                    >
                      <Image
                        src={displayedImage}
                        alt="Location view"
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 55vw, 100vw"
                        priority
                      />
                      {/* Deep vignette overlay to integrate with the dark luxury aesthetic */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-obsidian/20 to-obsidian/80 mix-blend-multiply" />
                    </motion.div>
                  </AnimatePresence>

                  <div className="hidden md:block absolute bottom-16 right-16 z-20 text-right">
                    <p className="text-gold/50 uppercase text-[10px] tracking-[0.4em] mb-4">Selected Region</p>
                    <p className="text-white font-serif text-5xl md:text-6xl italic drop-shadow-2xl">
                      {safeNeighbourhoods.find(n => n.id === hoveredId)?.name}
                    </p>
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
