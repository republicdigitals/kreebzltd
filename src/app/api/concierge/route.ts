import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const conciergeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  budget: z.string().trim().max(120).optional(),
  bedrooms: z.string().trim().max(40).optional(),
  neighbourhoods: z.string().trim().max(500).optional(),
  propertyType: z.string().trim().max(80).optional(),
  additionalInfo: z.string().trim().max(5000).optional(),
  website: z.string().max(200).optional(), // honeypot
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 submissions per minute per IP
    const rl = rateLimit(`concierge:${clientIp(request)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();

    // Honeypot — bots that fill it get a fake success
    if (body?.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = conciergeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      budget,
      bedrooms,
      neighbourhoods,
      propertyType,
      additionalInfo,
    } = parsed.data;

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
        email: email.toLowerCase(),
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
