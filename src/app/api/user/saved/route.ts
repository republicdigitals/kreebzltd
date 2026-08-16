import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedProperty.findMany({
      where: { userId: session.user.id },
      include: {
        property: {
          include: {
            media: {
              where: { isCover: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    const saved = await prisma.savedProperty.create({
      data: {
        userId: session.user.id,
        propertyId,
      }
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: "Property already saved" }, { status: 400 });
    }
    console.error("Error saving property:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    await prisma.savedProperty.delete({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Saved property not found" }, { status: 404 });
    }
    console.error("Error removing saved property:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
