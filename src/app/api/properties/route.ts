import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Property } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";


export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: { media: true }
    });
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Properties list error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to read properties data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newProperty = await request.json() as Property;
    
    // Simple validation
    if (!newProperty.id || !newProperty.price || !newProperty.address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.property.findUnique({
      where: { id: newProperty.id }
    });

    if (existing) {
      return NextResponse.json({ error: "Property ID already exists" }, { status: 409 });
    }

    const { media, ...restData } = newProperty as any;
    
    // Default Json structures
    const propertyData = {
      ...restData,
      gallery: restData.gallery || [],
      rooms: restData.rooms || [],
      floorPlans: restData.floorPlans || [],
      principal: restData.principal || {},
      media: media && Array.isArray(media) ? {
        create: media.map((m: any) => ({
          storageKey: m.storageKey || m.url,
          url: m.url,
          mimeType: "image/jpeg",
          size: 0,
          isCover: m.isCover,
          order: m.order,
        }))
      } : undefined
    };

    const created = await prisma.property.create({
      data: propertyData,
      include: { media: true }
    });

    revalidateTag("properties", "default");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Property create error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
