import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateTag, revalidatePath } from "next/cache";
import { createPropertySchema } from "@/lib/validations/property";
import { getAdminProperties } from "@/data/properties";


export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const properties = await getAdminProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Properties list error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to read properties data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const body = await request.json();
    
    // Auto-generate slug from ID if not provided
    if (!body.slug && body.id) {
      body.slug = body.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const parsed = createPropertySchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }
    
    const newProperty = parsed.data;

    const existing = await prisma.property.findUnique({
      where: { id: newProperty.id }
    });

    if (existing) {
      return NextResponse.json({ error: "Property ID already exists" }, { status: 409 });
    }

    const { media, ...restData } = newProperty;
    
    // Default Json structures
    const propertyData = {
      ...restData,
      media: media && Array.isArray(media) ? {
        create: media.map((m) => ({
          storageKey: m.storageKey || m.url,
          url: m.url,
          mimeType: "image/jpeg",
          size: 0,
          isCover: m.isCover,
          order: m.order,
        }))
      } : undefined
    } as unknown as Prisma.PropertyCreateInput;

    const created = await prisma.property.create({
      data: propertyData,
      include: { media: true }
    });

    revalidateTag("properties", "default");
    revalidatePath("/properties");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Property create error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
