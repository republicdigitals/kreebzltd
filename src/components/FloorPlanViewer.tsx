"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import type { PropertyFloorPlan } from "@/data/properties";

interface FloorPlanViewerProps {
  floorPlans: PropertyFloorPlan[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.6;

export default function FloorPlanViewer({
  floorPlans,
  activeIndex,
  onIndexChange,
}: FloorPlanViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const lastPinchDist = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePlan = floorPlans[activeIndex];

  // Reset transform when lightbox opens or plan changes
  useEffect(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, [lightboxOpen, activeIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "+" || e.key === "=") zoom(ZOOM_STEP);
      if (e.key === "-") zoom(-ZOOM_STEP);
      if (e.key === "0") { setScale(1); setOffset({ x: 0, y: 0 }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, scale]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const zoom = useCallback((delta: number) => {
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
    if (scale + delta <= MIN_SCALE) setOffset({ x: 0, y: 0 });
  }, [scale]);

  // ── Mouse drag ───────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const onMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  // ── Touch pinch-to-zoom & pan ────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        ox: offset.x,
        oy: offset.y,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = (dist - lastPinchDist.current) / 120;
      setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && dragStart.current && scale > 1) {
      setOffset({
        x: dragStart.current.ox + (e.touches[0].clientX - dragStart.current.x),
        y: dragStart.current.oy + (e.touches[0].clientY - dragStart.current.y),
      });
    }
  };

  const onTouchEnd = () => {
    lastPinchDist.current = null;
    dragStart.current = null;
    if (scale <= MIN_SCALE) setOffset({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Inline preview — clicking opens the lightbox */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={activePlan.image}
            alt={activePlan.title}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
          {/* Expand button overlay */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-black/50 backdrop-blur-md text-off-white border border-white/20 hover:border-gold hover:text-gold transition-all duration-500 uppercase text-[10px] tracking-[0.2em]"
            aria-label="Open floor plan full screen"
          >
            <Maximize2 size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Expand</span>
          </button>
        </div>
      </div>

      {/* Full-screen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[200] bg-obsidian/98 backdrop-blur-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={`Floor plan: ${activePlan.title}`}
          >
            {/* Toolbar */}
            <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-4">
                <p className="uppercase text-[10px] tracking-[0.2em] text-muted">
                  Floor Plan —{" "}
                  <span className="text-gold">{activePlan.title}</span>
                </p>
                {/* Plan selector when multiple floor plans */}
                {floorPlans.length > 1 && (
                  <div className="flex items-center gap-2">
                    {floorPlans.map((plan, i) => (
                      <button
                        key={plan.title}
                        onClick={() => onIndexChange(i)}
                        className={`px-3 py-1 text-[9px] uppercase tracking-[0.15em] border transition-colors duration-300 ${
                          activeIndex === i
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-white/10 text-muted hover:border-white/30 hover:text-off-white"
                        }`}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted tracking-widest uppercase mr-2">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => zoom(-ZOOM_STEP)}
                  disabled={scale <= MIN_SCALE}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-muted hover:text-off-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => zoom(ZOOM_STEP)}
                  disabled={scale >= MAX_SCALE}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-muted hover:text-off-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={15} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-muted hover:text-off-white hover:border-white/30 transition-colors"
                  aria-label="Reset view"
                >
                  <RotateCcw size={14} strokeWidth={1.5} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-muted hover:text-gold hover:border-gold/50 transition-colors"
                  aria-label="Close floor plan viewer"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Keyboard hint */}
            <div className="shrink-0 px-6 py-2 flex items-center gap-6 text-[9px] uppercase tracking-[0.15em] text-muted/50 border-b border-white/5">
              <span>+ / − to zoom</span>
              <span>Drag to pan when zoomed</span>
              <span>Esc to close</span>
            </div>

            {/* Image Canvas */}
            <div
              ref={containerRef}
              className={`flex-1 overflow-hidden flex items-center justify-center select-none ${
                scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
              }`}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onClick={() => { if (scale === 1) zoom(ZOOM_STEP); }}
            >
              <motion.div
                animate={{
                  scale,
                  x: offset.x,
                  y: offset.y,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className="relative w-full h-full max-w-6xl max-h-[80vh]"
              >
                <Image
                  src={activePlan.image}
                  alt={activePlan.title}
                  fill
                  priority
                  className="object-contain pointer-events-none"
                  sizes="100vw"
                  draggable={false}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
