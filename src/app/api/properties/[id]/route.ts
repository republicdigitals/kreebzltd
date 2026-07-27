import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Property, Prisma } from "@prisma/client";

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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedData = await request.json() as Prisma.PropertyUpdateInput;
    
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
    console.error(error);
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
    console.error(error);
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
