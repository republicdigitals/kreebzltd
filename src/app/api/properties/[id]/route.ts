import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id }
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
    const { id } = await params;
    const body = await request.json();
    
    // Whitelist: only allow these fields to be updated via the API
    const allowedFields = [
      "price", "address", "neighbourhood", "city",
      "beds", "baths", "status", "type", "priceValue",
      "description", "image", "gallery", "photoCount",
      "rooms", "floorPlans",
    ] as const;

    const updatedData: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in body) {
        updatedData[key] = body[key];
      }
    }

    if (Object.keys(updatedData).length === 0) {
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
    const { id } = await params;
    
    const existing = await prisma.property.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    await prisma.property.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Property delete error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
