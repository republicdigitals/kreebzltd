import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";


export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: { media: true }
    });
    
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error("Property fetch error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Whitelist: only allow these fields to be updated via the API
    const allowedFields = [
      "price", "address", "neighbourhood", "city",
      "beds", "baths", "status", "type", "priceValue",
      "description", "image", "gallery", "photoCount",
      "rooms", "floorPlans", "publicationStatus", "media"
    ] as const;

    const updatedData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body && key !== 'media') {
        updatedData[key] = body[key];
      }
    }

    if (Object.keys(updatedData).length === 0 && !body.media) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const existing = await prisma.property.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: updatedData
    });

    if (body.media && Array.isArray(body.media)) {
      // Very basic media sync:
      // Delete missing ones, create/update remaining
      const currentMediaIds = body.media.map((m: any) => m.id);
      
      // Delete ones not in the payload
      await prisma.propertyMedia.deleteMany({
        where: {
          propertyId: id,
          id: { notIn: currentMediaIds }
        }
      });
      
      // Update or create ones in payload
      for (const m of body.media) {
        const payloadData = {
          propertyId: id,
          storageKey: m.storageKey || m.url,
          url: m.url,
          mimeType: "image/jpeg",
          size: 0,
          isCover: m.isCover,
          order: m.order,
        };
        
        if (m.isNew) {
          // New objects are marked with "temp-" id from the UI, so we strip it.
          await prisma.propertyMedia.create({ data: payloadData });
        } else {
          await prisma.propertyMedia.update({
            where: { id: m.id },
            data: payloadData
          });
        }
      }
    }

    revalidateTag("properties", "default");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Property update error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    const existing = await prisma.property.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (existing.publicationStatus !== "ARCHIVED") {
      // Archive-first deletion
      await prisma.property.update({
        where: { id },
        data: { publicationStatus: "ARCHIVED" }
      });
      return new NextResponse(null, { status: 204 });
    }

    // Hard delete if already archived
    await prisma.property.delete({
      where: { id }
    });

    revalidateTag("properties", "default");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Property delete error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
