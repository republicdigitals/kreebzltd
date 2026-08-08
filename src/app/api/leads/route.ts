import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/leads
 * Returns all leads, newest first. Admin-protected (via proxy.ts).
 */
export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Creates a new lead. PUBLIC — called by the Contact form, Concierge
 * modal, and newsletter signup without requiring admin auth.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, interest, message, propertyId } = body;

    if (!name || !email || !interest) {
      return NextResponse.json(
        { error: "name, email, and interest are required" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        interest: String(interest).trim(),
        message: message ? String(message).trim() : null,
        propertyId: propertyId ? String(propertyId).trim() : null,
        status: "New",
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
