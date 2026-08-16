import type { Property as PrismaProperty, PropertyMedia } from "@prisma/client";
import prisma from "@/lib/prisma";
export interface PropertyRoom {
  heading: string;
  body: string;
}

export interface PropertyFloorPlan {
  title: string;
  image: string;
}

export interface PropertyPrincipal {
  name: string;
  title: string;
  phone: string;
}

// Map Prisma JSON types to our concrete types
export interface Property extends Omit<PrismaProperty, 'rooms' | 'floorPlans' | 'principal'> {
  rooms: PropertyRoom[];
  floorPlans: PropertyFloorPlan[] | null;
  principal: PropertyPrincipal;
  media?: PropertyMedia[];
}

// Convert from Prisma to our typed object
function mapPrismaProperty(p: PrismaProperty & { media?: PropertyMedia[] }): Property {
  // Try to use the media relation if available
  let computedImage = p.image;
  let computedGallery = Array.isArray(p.gallery) ? p.gallery as string[] : [];
  
  if (p.media && p.media.length > 0) {
    const cover = p.media.find(m => m.isCover) || p.media[0];
    computedImage = cover.url;
    computedGallery = p.media.filter(m => !m.isCover).map(m => m.url);
  }

  return {
    ...p,
    image: computedImage,
    gallery: computedGallery,
    rooms: p.rooms as unknown as PropertyRoom[],
    floorPlans: p.floorPlans as unknown as PropertyFloorPlan[] | null,
    principal: p.principal as unknown as PropertyPrincipal,
    media: p.media,
  };
}

export async function getProperties(includeArchived = false): Promise<Property[]> {
  try {
    const properties = await prisma.property.findMany({
      where: includeArchived ? {} : { publicationStatus: "PUBLISHED" },
      include: { media: true }
    });
    return properties.map(mapPrismaProperty);
  } catch (error) {
    console.error("Failed to fetch properties from database", error);
    return [];
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { media: true }
    });
    if (!property) return null;
    return mapPrismaProperty(property);
  } catch (error) {
    console.error("Failed to fetch property from database", error);
    return null;
  }
}

// Keeping this as an empty array to prevent synchronous import errors if any components still use it.
export const properties: Property[] = [];
