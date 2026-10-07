/**
 * Lagos area guides — editorial + trust layer, primarily for diaspora buyers.
 * Each guide links real inventory via the `neighbourhood` field on Property.
 * Images live in /public/images/areas/ (Morphix-generated dusk photography).
 */

export interface Area {
  slug: string;
  name: string;
  /** One-line character sketch used on index cards and guide headers. */
  tagline: string;
  /** 2-3 line editor's note — "why this area". */
  note: string;
  /** Market snapshot facts shown as a small stat row. */
  snapshot: { label: string; value: string }[];
  /** What Kreebz checks when inspecting in this area. */
  inspections: string[];
  /** Property.neighbourhood values that belong to this guide. */
  neighbourhoods: string[];
  image: string;
  imageAlt: string;
}

export const areas: Area[] = [
  {
    slug: "ikoyi",
    name: "Ikoyi",
    tagline: "The established address — tree-lined, diplomatic, quiet.",
    note: "Ikoyi is where Lagos wealth settled first and stays longest. Leafy avenues, embassies, private clubs — the market is tight because owners rarely sell, and the best stock trades quietly before it is ever listed.",
    snapshot: [
      { label: "Character", value: "Established diplomatic quarter" },
      { label: "Stock", value: "Detached homes, low-rise luxury apartments" },
      { label: "Buyer", value: "Legacy families, executives, returning diaspora" },
    ],
    inspections: [
      "Title and registered survey — Ikoyi titles are layered and worth reading twice",
      "Flood grading on lower-elevation streets near the lagoon edges",
      "Staff quarters and service access — often missed in glossy listings",
    ],
    neighbourhoods: ["Ikoyi"],
    image: "/images/areas/ikoyi.png",
    imageAlt: "Dusk aerial over Ikoyi, Lagos — tree-lined streets and lagoon light",
  },
  {
    slug: "banana-island",
    name: "Banana Island",
    tagline: "Nigeria's most exclusive postcode — a private island of record prices.",
    note: "A man-made enclave behind gates and checkpoints, where land alone trades in billions of naira. Inventory is thin, standards are absolute, and privacy is the entire point — most sales here never reach a portal.",
    snapshot: [
      { label: "Character", value: "Gated private island" },
      { label: "Stock", value: "Signature villas, penthouses, prime plots" },
      { label: "Buyer", value: "Ultra-HNW, corporate principals, diaspora investors" },
    ],
    inspections: [
      "Estate service-charge terms and infrastructure levies",
      "Shoreline works, revetment condition and drainage",
      "Construction quality against approved drawings — bespoke builds vary wildly",
    ],
    neighbourhoods: ["Banana Island"],
    image: "/images/areas/banana-island.png",
    imageAlt: "Dusk view of Banana Island villas along the waterfront",
  },
  {
    slug: "victoria-island",
    name: "Victoria Island",
    tagline: "Lagos at work — towers, hotels, and apartments that earn.",
    note: "VI is the commercial heart — banks, HQs, hotels, and the densest short-let market in the country. Apartments here are bought for yield as much as lifestyle, which makes building management quality the real differentiator.",
    snapshot: [
      { label: "Character", value: "Commercial and corporate core" },
      { label: "Stock", value: "High-rise apartments, serviced residences" },
      { label: "Buyer", value: "Yield investors, corporate tenants, expatriates" },
    ],
    inspections: [
      "Facility-management history — lifts, generators, water systems, service charge arrears",
      "Short-let licence status where yield is the pitch",
      "Noise, traffic access and parking ratios per unit",
    ],
    neighbourhoods: ["Victoria Island"],
    image: "/images/areas/victoria-island.png",
    imageAlt: "Victoria Island skyline at dusk with tower lights",
  },
  {
    slug: "eko-atlantic",
    name: "Eko Atlantic",
    tagline: "The engineered city — new land, new towers, global ambitions.",
    note: "Built on reclaimed Atlantic coastline with its own power, roads and sea wall, Eko Atlantic is Lagos's answer to a master-planned district. The product is new, the promise is long-term, and buying well here means understanding phasing — which tower, which stage, which developer.",
    snapshot: [
      { label: "Character", value: "Master-planned new city" },
      { label: "Stock", value: "Branded towers, off-plan apartments" },
      { label: "Buyer", value: "Off-plan investors, international buyers" },
    ],
    inspections: [
      "Developer delivery track record and escrow terms on off-plan purchases",
      "Actual handover stage versus brochure renders",
      "Sea-defence and infrastructure obligations in the purchase terms",
    ],
    neighbourhoods: ["Eko Atlantic"],
    image: "/images/areas/eko-atlantic.png",
    imageAlt: "Eko Atlantic towers and marina at dusk",
  },
  {
    slug: "lekki",
    name: "Lekki",
    tagline: "The growth corridor — new estates, family compounds, momentum.",
    note: "Lekki is where the market is moving — newer estates, larger compounds, and prices still below the Island core. Quality varies street by street, which is exactly why inspections matter here more than anywhere else we work.",
    snapshot: [
      { label: "Character", value: "Fast-growing residential corridor" },
      { label: "Stock", value: "Terraces, semi-detached, gated estates" },
      { label: "Buyer", value: "Young families, first luxury buyers, diaspora" },
    ],
    inspections: [
      "Drainage and road condition after rain — the honest test of any Lekki estate",
      "Power and water infrastructure inside the estate, not just the street",
      "Title chain — Governor's consent status on newer developments",
    ],
    neighbourhoods: ["Lekki"],
    image: "/images/areas/lekki.png",
    imageAlt: "Lekki residential estates at dusk, Lagos",
  },
];

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}
