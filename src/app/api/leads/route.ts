import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createLeadSchema } from "@/lib/validations/lead";

/**
 * GET /api/leads
 * Returns all leads, newest first. Admin-protected.
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

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
    // Rate limit: 5 submissions per minute per IP
    const rl = rateLimit(`leads:${clientIp(request)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const body = await request.json();

    // Honeypot check for bots — return 201 so the bot thinks it succeeded
    if (body?.website) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = createLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone ?? null,
        interest: data.interest,
        message: data.message ?? null,
        propertyId: data.propertyId ?? null,
        project: data.project ?? null,
        nextStep: data.nextStep ?? null,
        timeframe: data.timeframe ?? null,
        preferredContact: data.preferredContact ?? null,
        consent: data.consent === true,
        utmSource: data.utmSource ?? null,
        utmMedium: data.utmMedium ?? null,
        utmCampaign: data.utmCampaign ?? null,
        utmContent: data.utmContent ?? null,
        referrer: data.referrer ?? null,
        landingPage: data.landingPage ?? null,
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
