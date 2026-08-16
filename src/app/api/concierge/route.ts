import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      name,
      email,
      phone,
      budget,
      bedrooms,
      neighbourhoods,
      propertyType,
      additionalInfo
    } = data;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const message = `Concierge Request
Budget: ${budget || "Not specified"}
Bedrooms: ${bedrooms || "Not specified"}
Neighbourhoods: ${neighbourhoods || "Not specified"}
Property Type: ${propertyType || "Not specified"}
Additional Info: ${additionalInfo || "None"}
`;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        interest: "concierge",
        message,
        status: "New",
      }
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Concierge lead capture error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
