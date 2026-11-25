"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MoveHorizontal } from "lucide-react";
import {
  bourdillonFloors,
  bourdillonHomes,
  bourdillonHomeTypeCounts,
  describeBourdillonHome,
  type BourdillonHome,
} from "@/data/bourdillon-inventory";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const renderViews = [
  {
    src: "/images/townhouse-ibj-render-aerial.webp",
    label: "Aerial",
    alt: "Aerial concept render of the Bourdillon homes",
  },
  {
    src: "/images/bourdillon/facade-one.webp",
    label: "Facade 01",
    alt: "Facade concept render of the Bourdillon homes",
  },
  {
    src: "/images/bourdillon/facade-two.webp",
    label: "Facade 02",
    alt: "Opposite facade concept render of the Bourdillon homes",
  },
  {
    src: "/images/townhouse-ibj-render-angle.webp",
    label: "Angle",
    alt: "Angled concept render of the Bourdillon homes",
  },
];

function homePosition(home: BourdillonHome) {
  return `${home.row === "north" ? "North" : "South"} ${home.column}`;
}

interface BourdillonExplorerProps {
  representativeHref?: string;
}

export default function BourdillonExplorer({ representativeHref }: BourdillonExplorerProps) {
  const [selectedHomeId, setSelectedHomeId] = useState("south-2");
  const [selectedFloorId, setSelectedFloorId] = useState("ground");
  const [viewIndex, setViewIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const selectedHome = bourdillonHomes.find((home) => home.id === selectedHomeId) ?? bourdillonHomes[0];
  const selectedFloor = bourdillonFloors.find((floor) => floor.id === selectedFloorId) ?? bourdillonFloors[0];
  const activeView = renderViews[viewIndex];

  const selectHome = (home: BourdillonHome) => {
    setSelectedHomeId(home.id);
    trackEvent("select_bourdillon_home", {
      home: home.id,
      type: home.type,
      row: home.row,
      column: home.column,
    });
  };

  const selectFloor = (floorId: string) => {
    setSelectedFloorId(floorId);
    trackEvent("select_bourdillon_floor", { floor: floorId });
  };

  const rotateView = (direction: 1 | -1) => {
    setViewIndex((current) => (current + direction + renderViews.length) % renderViews.length);
    trackEvent("rotate_bourdillon_render", { direction });
  };

  const handlePointerEnd = (clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) >= 48) rotateView(delta < 0 ? 1 : -1);
  };

  const scrollToEnquiry = () => {
    const interest = `Interest in Bourdillon ${describeBourdillonHome(selectedHome)}. Please send the approved release status, pricing and documentation for this home type.`;
    trackEvent("click_bourdillon_home_enquiry", {
      home: selectedHome.id,
      type: selectedHome.type,
    });
    window.dispatchEvent(new CustomEvent("bourdillon:home-interest", { detail: interest }));
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="residence-explorer" className="bd-explorer-section scroll-mt-24 py-14 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-14 mb-10 lg:mb-14">
          <div>
            <p className="bd-kicker mb-5">Compound explorer</p>
            <h2 className="bd-section-title">
              Twelve homes.
              <br />
              One compound.
            </h2>
          </div>
          <div className="flex flex-col justify-end max-w-2xl">
            <p className="text-body text-black leading-relaxed">
              Select a position in the compound, rotate the concept render, then move through
              the six floors and rooftop amenity level. Release status and pricing remain private
              until enquiry.
            </p>
            <div className="grid grid-cols-2 gap-px bg-black border border-black mt-7 max-w-xl">
              <div className="bg-white px-4 py-3">
                <p className="bd-panel-label text-black">Plot area</p>
                <p className="font-black text-lg">3,149.44 m²</p>
              </div>
              <div className="bg-white px-4 py-3">
                <p className="bd-panel-label text-black">Construction area</p>
                <p className="font-black text-lg">10,941.83 m²</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[7fr_5fr] border border-black bg-black text-white">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <p className="bd-panel-label">Concept render</p>
                <p className="text-white/60 text-sm">Four angles. Swipe or use the arrows.</p>
              </div>
              <div className="flex items-center gap-2" aria-label="Change render angle">
                <button
                  type="button"
                  onClick={() => rotateView(-1)}
                  className="bd-icon-button"
                  aria-label="Previous render angle"
                >
                  <ArrowLeft size={17} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={() => rotateView(1)}
                  className="bd-icon-button"
                  aria-label="Next render angle"
                >
                  <ArrowRight size={17} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div
              className="bd-render-stage group"
              role="img"
              aria-label={`${activeView.label} concept render of the Bourdillon homes`}
              onPointerDown={(event) => {
                dragStartX.current = event.clientX;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={(event) => handlePointerEnd(event.clientX)}
              onPointerCancel={() => {
                dragStartX.current = null;
              }}
            >
              {renderViews.map((view, index) => (
                <Image
                  key={view.src}
                  src={view.src}
                  alt=""
                  fill
                  priority={index === 0}
                  className={cn(
                    "object-cover transition-opacity duration-200 ease-out",
                    index === viewIndex ? "opacity-100" : "opacity-0"
                  )}
                  sizes="(max-width: 1280px) 100vw, 58vw"
                  draggable={false}
                />
              ))}
              <span className="bd-render-badge">
                <MoveHorizontal size={13} strokeWidth={1.8} />
                {activeView.label} · illustrative render
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4" aria-label="Render angle selector">
              {renderViews.map((view, index) => (
                <button
                  key={view.src}
                  type="button"
                  onClick={() => setViewIndex(index)}
                  className={cn("bd-view-tab", index === viewIndex && "bd-view-tab-active")}
                  aria-pressed={index === viewIndex}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
                <div>
                  <p className="bd-panel-label">Unit-type plan</p>
                  <p className="text-white/60 text-sm">Simplified from the ground-floor plan.</p>
                </div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                  Not to scale · subject to approved drawings
                </p>
              </div>

              <div className="bd-compound-scroll">
              <div className="bd-compound-plan" role="group" aria-label="Select a Bourdillon home position">
                {(["north", "south"] as const).map((row) => (
                  <div key={row} className="contents">
                    <div className="bd-plan-row-label">{row}</div>
                    <div className="grid grid-cols-6 gap-[2px]">
                      {bourdillonHomes
                        .filter((home) => home.row === row)
                        .map((home) => {
                          const active = home.id === selectedHomeId;
                          return (
                            <button
                              key={home.id}
                              type="button"
                              onClick={() => selectHome(home)}
                              className={cn("bd-home-cell", active && "bd-home-cell-active")}
                              aria-pressed={active}
                              aria-label={`${describeBourdillonHome(home)}. Select this home.`}
                            >
                              <span className="text-[10px] uppercase tracking-[0.14em] opacity-70">
                                {homePosition(home)}
                              </span>
                              <span className="text-2xl sm:text-3xl font-black leading-none">
                                {home.type}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                    {row === "north" && (
                      <div className="bd-circulation-lane" aria-hidden="true">
                        Shared circulation
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 border border-white/20 border-t-0">
                {(Object.keys(bourdillonHomeTypeCounts) as Array<keyof typeof bourdillonHomeTypeCounts>).map((type) => (
                  <div key={type} className="px-4 py-3 border-r border-white/20 last:border-r-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Type {type}</p>
                    <p className="text-white font-bold">{bourdillonHomeTypeCounts[type]} home{bourdillonHomeTypeCounts[type] === 1 ? "" : "s"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="bg-white text-black border-t xl:border-t-0 xl:border-l border-black p-6 sm:p-8 lg:p-10 flex flex-col">
            <div className="flex items-start justify-between gap-6 pb-8 border-b border-black">
              <div>
                <p className="bd-kicker mb-3">Selected position</p>
                <h3 className="bd-selected-title">Type {selectedHome.type}</h3>
              </div>
              <span className="bd-asterisk" aria-hidden="true" />
            </div>

            <dl className="bd-fact-list">
              <div>
                <dt>Position</dt>
                <dd>{describeBourdillonHome(selectedHome)}</dd>
              </div>
              <div>
                <dt>Home type</dt>
                <dd>One of {bourdillonHomeTypeCounts[selectedHome.type]} Type {selectedHome.type} home{bourdillonHomeTypeCounts[selectedHome.type] === 1 ? "" : "s"}</dd>
              </div>
              <div>
                <dt>Residence scale</dt>
                <dd>5 bedrooms with service quarter · over 800 m² built-up area</dd>
              </div>
              <div>
                <dt>Vertical plan</dt>
                <dd>Six floors plus rooftop amenity level</dd>
              </div>
              <div>
                <dt>Completion</dt>
                <dd>Estimated December 2027</dd>
              </div>
              <div>
                <dt>Release status</dt>
                <dd>Private enquiry</dd>
              </div>
            </dl>

            <div className="mt-8">
              <p className="bd-panel-label text-black mb-4">Shared home provisions</p>
              <ul className="space-y-3 text-sm leading-relaxed text-black">
                <li>Internal lift connecting all floors</li>
                <li>Private swimming pool and expansive pool deck</li>
                <li>Cinema, family lounge and rooftop wellness deck</li>
                <li>Rooftop pool, gym and outdoor lounge{selectedHome.type === "B" ? " with spa, sauna and shower" : ""}</li>
              </ul>
              <p className="text-xs text-[#737373] leading-relaxed mt-5">
                Final specification, release status and pricing are confirmed through the approved
                brochure and private consultation.
              </p>
            </div>

            <div className="mt-auto pt-10 flex flex-col gap-3">
              <button type="button" onClick={scrollToEnquiry} className="bd-primary-button">
                Request this home type
                <ArrowRight size={16} strokeWidth={1.8} />
              </button>
              {representativeHref && (
                <Link href={representativeHref} className="bd-secondary-button">
                  View representative residence details
                </Link>
              )}
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-14 mt-14 lg:mt-20">
          <div>
            <p className="bd-kicker mb-5">Inside each home</p>
            <h3 className="bd-section-title bd-section-title-small">
              Six floors.
              <br />
              One vertical life.
            </h3>
            <p className="text-body text-black mt-6 max-w-md">
              Move through the floor-plan sequence. Ground to fifth form the six-floor
              home; the rooftop carries the private amenity level.
            </p>
          </div>

          <div className="border border-black bg-white">
            <div className="flex flex-col md:grid md:grid-cols-[180px_1fr]">
              <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r border-black">
                {bourdillonFloors.map((floor) => {
                  const active = floor.id === selectedFloorId;
                  return (
                    <button
                      key={floor.id}
                      type="button"
                      onClick={() => selectFloor(floor.id)}
                      className={cn("bd-floor-tab", active && "bd-floor-tab-active")}
                      aria-pressed={active}
                    >
                      <span className="text-[10px] uppercase tracking-[0.16em]">{floor.shortLabel}</span>
                      <span>{floor.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="relative aspect-[16/9] bg-[#f1f1f1] border border-black overflow-hidden">
                  <Image
                    key={selectedFloor.image}
                    src={selectedFloor.image}
                    alt={`${selectedFloor.label} floor plan for the Bourdillon homes`}
                    fill
                    className="object-contain bd-floor-image"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 mt-5 items-end">
                  <div>
                    <p className="bd-panel-label text-black">{selectedFloor.label}</p>
                    <p className="text-black text-sm leading-relaxed mt-2">{selectedFloor.summary}</p>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#737373] mt-3">
                      {selectedFloor.area}
                    </p>
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#737373]">
                    Illustrative plan · subject to approval
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
