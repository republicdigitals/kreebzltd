/*
 * ASSET SWAP: Replace image `null` placeholders with real photography paths
 * (e.g. "/images/property-ikoyi-1.jpg") when supplied to /public/images/.
 * Cards and detail pages fall back to a #1a1a1a placeholder with a filename
 * label whenever `image` is null.
 */

export interface PropertyRoom {
  heading: string;
  body: string;
}

export interface Property {
  id: string;
  price: string;
  address: string;
  neighbourhood: string;
  city: string;
  beds: number;
  baths: number;
  status: "For Sale" | "For Lease";
  /** Placeholder filename shown until real photography is supplied */
  imagePlaceholder: string;
  /** Real image path when supplied, otherwise null */
  image: string | null;
  /** Number of gallery photos (placeholder count) */
  photoCount: number;
  description: string;
  rooms: PropertyRoom[];
  principal: {
    name: string;
    title: string;
    phone: string;
  };
}

export const properties: Property[] = [
  {
    id: "ikoyi-banana-crescent",
    price: "₦2,850,000,000",
    address: "14 Banana Crescent, Ikoyi",
    neighbourhood: "Ikoyi",
    city: "Lagos, Nigeria",
    beds: 5,
    baths: 6,
    status: "For Sale",
    imagePlaceholder: "property-ikoyi.jpg",
    image: null,
    photoCount: 20,
    description:
      "A commanding residence on one of Ikoyi's most established streets. Designed for principals who expect discretion without compromise, the home balances generous entertaining space with private family quarters. Floor-to-ceiling glazing frames the mature gardens, while the interior architecture favours restraint — stone, warm timber, and considered light.",
    rooms: [
      {
        heading: "The Residence",
        body: "Five bedroom suites arranged across two floors, each with private bathing and dressing rooms. A double-height reception hall anchors the ground floor.",
      },
      {
        heading: "Principal Rooms",
        body: "Formal drawing room, a panelled study, a chef's kitchen with adjoining scullery, and a covered terrace overlooking the pool and grounds.",
      },
    ],
    principal: {
      name: "Adaeze Okonkwo",
      title: "Kreebz Principal",
      phone: "+234 800 000 0001",
    },
  },
  {
    id: "vi-eko-atlantic",
    price: "₦1,650,000,000",
    address: "Tower Two, Eko Atlantic, Victoria Island",
    neighbourhood: "Victoria Island",
    city: "Lagos, Nigeria",
    beds: 4,
    baths: 5,
    status: "For Sale",
    imagePlaceholder: "property-vi.jpg",
    image: null,
    photoCount: 16,
    description:
      "A full-floor apartment in the commercial and residential heart of Lagos. Panoramic views span the Atlantic and the marina below. The layout is engineered for entertaining at scale, with seamless flow between the reception rooms and a wraparound terrace.",
    rooms: [
      {
        heading: "The Residence",
        body: "Four bedroom suites, a media room, and staff accommodation, all served by a private lift lobby.",
      },
      {
        heading: "Principal Rooms",
        body: "Open-plan reception, a formal dining room for twelve, and a show kitchen finished in stone and brushed brass.",
      },
    ],
    principal: {
      name: "Tunde Balogun",
      title: "Kreebz Principal",
      phone: "+234 800 000 0002",
    },
  },
  {
    id: "banana-island-waterfront",
    price: "₦4,200,000,000",
    address: "9 Ocean Parade, Banana Island",
    neighbourhood: "Banana Island",
    city: "Lagos, Nigeria",
    beds: 6,
    baths: 7,
    status: "For Sale",
    imagePlaceholder: "property-banana-island.jpg",
    image: null,
    photoCount: 24,
    description:
      "Exclusive waterfront living at its finest. This landmark home occupies a rare double plot with direct lagoon frontage, a private jetty, and grounds designed by an internationally recognised landscape studio. Every principal room opens to water.",
    rooms: [
      {
        heading: "The Residence",
        body: "Six bedroom suites, a wellness wing with pool and spa, and a self-contained guest pavilion.",
      },
      {
        heading: "Principal Rooms",
        body: "Waterfront drawing room, a cinema, a temperature-controlled cellar, and an entertainer's terrace with an outdoor kitchen.",
      },
    ],
    principal: {
      name: "Ngozi Eze",
      title: "Kreebz Principal",
      phone: "+234 800 000 0003",
    },
  },
  {
    id: "ikoyi-parkview-villa",
    price: "₦1,980,000,000",
    address: "3 Parkview Estate, Ikoyi",
    neighbourhood: "Ikoyi",
    city: "Lagos, Nigeria",
    beds: 4,
    baths: 5,
    status: "For Lease",
    imagePlaceholder: "property-parkview.jpg",
    image: null,
    photoCount: 18,
    description:
      "A discreet villa within the gated calm of Parkview Estate. Recently reimagined, the home pairs a classical envelope with a fully contemporary interior. Ideal for a principal seeking a turnkey residence with mature privacy and immediate presence.",
    rooms: [
      {
        heading: "The Residence",
        body: "Four bedroom suites, a family lounge, and a home office positioned for quiet.",
      },
      {
        heading: "Principal Rooms",
        body: "Reception room, dining room, and a kitchen opening to a landscaped courtyard and pool.",
      },
    ],
    principal: {
      name: "Chidi Nwankwo",
      title: "Kreebz Principal",
      phone: "+234 800 000 0004",
    },
  },
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}
