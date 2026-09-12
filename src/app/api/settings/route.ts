import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

const SINGLETON_ID = "singleton";

// The admin settings form may submit "" to clear an email field.
const optionalEmail = z.union([z.literal(""), z.string().trim().email().max(254)]).optional();

const updateSettingsSchema = z.object({
  agencyName: z.string().trim().max(200).optional(),
  agencyEmail: optionalEmail,
  agencyPhone: z.string().trim().max(40).optional(),
  agencyAddress: z.string().trim().max(500).optional(),
  principalName: z.string().trim().max(120).optional(),
  principalTitle: z.string().trim().max(120).optional(),
  notifyNewLeads: z.boolean().optional(),
  notifyEmail: optionalEmail,
}).strict();

/**
 * Ensures the singleton AgencySettings record exists, returning it.
 * Uses upsert so the first GET call auto-creates defaults.
 */
async function getOrCreateSettings() {
  return prisma.agencySettings.upsert({
    where: { id: SINGLETON_ID },
    update: {},
    create: { id: SINGLETON_ID },
  });
}

/**
 * GET /api/settings
 * Returns current agency settings. Admin-protected via proxy.ts.
 */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const settings = await getOrCreateSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[GET /api/settings]", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Replaces agency settings fields. Admin-protected via proxy.ts.
 */
export async function PUT(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const parsed = updateSettingsSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    const updates = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined)
    );

    const settings = await prisma.agencySettings.upsert({
      where: { id: SINGLETON_ID },
      update: updates,
      create: { id: SINGLETON_ID, ...updates },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[PUT /api/settings]", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
