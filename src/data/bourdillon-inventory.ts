export type BourdillonHomeType = "A" | "B" | "C" | "D";
export type BourdillonRow = "north" | "south";

export interface BourdillonHome {
  id: string;
  type: BourdillonHomeType;
  row: BourdillonRow;
  column: number;
}

export interface BourdillonFloor {
  id: string;
  label: string;
  shortLabel: string;
  image: string;
  summary: string;
  area: string;
}

const northTypes: BourdillonHomeType[] = ["A", "B", "B", "B", "B", "C"];
const southTypes: BourdillonHomeType[] = ["A", "B", "B", "B", "B", "D"];

export const bourdillonHomeTypeCounts: Record<BourdillonHomeType, number> = {
  A: 2,
  B: 8,
  C: 1,
  D: 1,
};

export const bourdillonHomes: BourdillonHome[] = [
  ...northTypes.map((type, index) => ({
    id: `north-${index + 1}`,
    type,
    row: "north" as const,
    column: index + 1,
  })),
  ...southTypes.map((type, index) => ({
    id: `south-${index + 1}`,
    type,
    row: "south" as const,
    column: index + 1,
  })),
];

export const bourdillonFloors: BourdillonFloor[] = [
  {
    id: "ground",
    label: "Ground floor",
    shortLabel: "G",
    image: "/images/bourdillon/floor-ground-crop.webp",
    summary: "Grand reception/living space, maid's room, outdoor lounge, pool and pool deck.",
    area: "1,224.27 m² total floor plate",
  },
  {
    id: "first",
    label: "First floor",
    shortLabel: "01",
    image: "/images/bourdillon/floor-first-crop.webp",
    summary: "Main living room with show kitchen, dirty kitchen, stair and technical area.",
    area: "1,619.59 m² total floor plate",
  },
  {
    id: "second",
    label: "Second floor",
    shortLabel: "02",
    image: "/images/bourdillon/floor-second-crop.webp",
    summary: "Private cinema, family living space, toilet and technical area.",
    area: "1,619.59 m² total floor plate",
  },
  {
    id: "third",
    label: "Third floor",
    shortLabel: "03",
    image: "/images/bourdillon/floor-third-crop.webp",
    summary: "Two generous bedroom suites with bathrooms, closet and hall.",
    area: "1,619.59 m² total floor plate",
  },
  {
    id: "fourth",
    label: "Fourth floor",
    shortLabel: "04",
    image: "/images/bourdillon/floor-fourth-crop.webp",
    summary: "Two further generous bedroom suites with bathrooms, closet and hall.",
    area: "1,619.59 m² total floor plate",
  },
  {
    id: "fifth",
    label: "Fifth floor",
    shortLabel: "05",
    image: "/images/bourdillon/floor-fifth-crop.webp",
    summary: "Master bedroom suite with master closet, master WC and hall.",
    area: "1,619.59 m² total floor plate",
  },
  {
    id: "rooftop",
    label: "Rooftop",
    shortLabel: "R",
    image: "/images/bourdillon/floor-rooftop-crop.webp",
    summary: "Outdoor lounge, pool and gym; Type B adds spa, sauna and shower.",
    area: "917.60 m² total floor plate",
  },
];

export function describeBourdillonHome(home: BourdillonHome) {
  const rowLabel = home.row === "north" ? "North row" : "South row";
  return `${rowLabel} · position ${home.column} · Type ${home.type}`;
}
