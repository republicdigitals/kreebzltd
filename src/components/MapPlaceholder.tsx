"use client";

import { motion } from "framer-motion";
import { type Property } from "@/data/properties";

interface MapPlaceholderProps {
  properties: Property[];
  activePropertyId: string | null;
  onPinClick: (id: string) => void;
  onPinHover: (id: string | null) => void;
}

const BOUNDS = {
  minLat: 6.42,
  maxLat: 6.465,
  minLng: 3.4,
  maxLng: 3.485,
};

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = 100 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

const neighbourhoodLabels = [
  { name: "Eko Atlantic", x: 48, y: 88 },
  { name: "Victoria Island", x: 52, y: 68 },
  { name: "Ikoyi", x: 42, y: 44 },
  { name: "Banana Island", x: 74, y: 36 },
  { name: "Lekki", x: 82, y: 62 },
];

export default function MapPlaceholder({
  properties,
  activePropertyId,
  onPinClick,
  onPinHover,
}: MapPlaceholderProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#DCE4E8]">
      {/* Water layers */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        {/* Atlantic / ocean */}
        <path d="M0 0 L35 0 L30 100 L0 100 Z" fill="#C8D5DB" />
        {/* Lagoon / east water */}
        <path d="M70 0 L100 0 L100 100 L65 100 Z" fill="#C8D5DB" />
        {/* Main Lagos peninsula */}
        <path
          d="M35 0 L70 0 L72 20 L78 35 L80 55 L70 75 L60 85 L50 100 L30 100 L32 70 L30 45 L32 20 Z"
          fill="#E4EDF0"
        />
        {/* Sandbars / islands */}
        <ellipse cx="74" cy="28" rx="10" ry="8" fill="#EBF2F4" />
        <ellipse cx="55" cy="88" rx="8" ry="6" fill="#EBF2F4" />

        {/* Roads */}
        <path
          d="M34 42 Q50 48 72 40"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
        <path
          d="M38 70 Q52 74 78 68"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <path
          d="M50 30 L50 88"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />

        {/* Neighbourhood labels */}
        {neighbourhoodLabels.map((n) => (
          <text
            key={n.name}
            x={n.x}
            y={n.y}
            textAnchor="middle"
            fontSize="2.4"
            fill="#7B8A91"
            fontWeight="500"
            style={{ letterSpacing: "0.05em" }}
          >
            {n.name}
          </text>
        ))}

        {/* Property pins */}
        {properties.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const isActive = activePropertyId === p.id;
          return (
            <g
              key={p.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer"
              onClick={() => onPinClick(p.id)}
              onMouseEnter={() => onPinHover(p.id)}
              onMouseLeave={() => onPinHover(null)}
            >
              <motion.path
                d="M0,-8 C-4.4,-8 -8,-4.4 -8,0 C-8,4.4 0,11 0,11 C0,11 8,4.4 8,0 C8,-4.4 4.4,-8 0,-8 Z"
                fill={isActive ? "var(--gold)" : "var(--off-white)"}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: isActive ? 1.35 : 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              />
              <circle r={2.5} fill="#FFFFFF" cy={-1} />
              {isActive && (
                <motion.circle
                  r={14}
                  fill="none"
                  stroke="var(--gold)"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.4 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Active property label */}
      {activePropertyId && (
        <div className="absolute top-4 left-4 right-4 pointer-events-none">
          <div className="inline-block bg-white/95 shadow px-4 py-2 rounded-lg max-w-full">
            {(() => {
              const p = properties.find((prop) => prop.id === activePropertyId);
              if (!p) return null;
              return (
                <div>
                  <p className="font-serif text-off-white text-base">{p.price}</p>
                  <p className="text-xs text-muted truncate">{p.address}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Pin count badge */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/90 shadow text-off-white text-xs tracking-wide">
        {properties.length} {properties.length === 1 ? "property" : "properties"} on map
      </div>
    </div>
  );
}
