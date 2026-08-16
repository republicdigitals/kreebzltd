import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { updatePropertySchema } from "@/lib/validations/property";
import { syncPropertyMedia, deletePropertyWithMedia } from "@/lib/services/property-media";
import { getAdminPropertyById } from "@/data/properties";


export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const property = await getAdminPropertyById(id);
    
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
    const parsed = updatePropertySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }
    
    const { media, ...updatedData } = parsed.data;

    if (Object.keys(updatedData).length === 0 && !media) {
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

    if (media && Array.isArray(media)) {
      await syncPropertyMedia(id, media);
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
    await deletePropertyWithMedia(id);

    revalidateTag("properties", "default");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Property delete error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
