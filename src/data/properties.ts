import type { Property as PrismaProperty } from "@prisma/client";
import prisma from "@/lib/prisma";
import propertiesJson from "./properties.json";

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
}

// Convert from Prisma to our typed object
function mapPrismaProperty(p: PrismaProperty): Property {
  return {
    ...p,
    rooms: p.rooms as unknown as PropertyRoom[],
    floorPlans: p.floorPlans as unknown as PropertyFloorPlan[] | null,
    principal: p.principal as unknown as PropertyPrincipal,
  };
}

export async function getProperties(): Promise<Property[]> {
  try {
    const properties = await prisma.property.findMany();
    return properties.map(mapPrismaProperty);
  } catch (error) {
    console.warn("Prisma connection failed (database might be paused). Falling back to local JSON.", error);
    return propertiesJson as unknown as Property[];
  }
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id }
    });
    if (!property) return null;
    return mapPrismaProperty(property);
  } catch (error) {
    console.warn("Prisma connection failed (database might be paused). Falling back to local JSON.", error);
    const p = (propertiesJson as unknown as Property[]).find(p => p.id === id);
    return p || null;
  }
}

// Keeping this as an empty array to prevent synchronous import errors if any components still use it.
export const properties: Property[] = [];
