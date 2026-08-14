import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SINGLETON_ID = "singleton";

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      agencyName,
      agencyEmail,
      agencyPhone,
      agencyAddress,
      principalName,
      principalTitle,
      notifyNewLeads,
      notifyEmail,
    } = body;

    const settings = await prisma.agencySettings.upsert({
      where: { id: SINGLETON_ID },
      update: {
        ...(agencyName !== undefined && { agencyName: String(agencyName) }),
        ...(agencyEmail !== undefined && { agencyEmail: String(agencyEmail) }),
        ...(agencyPhone !== undefined && { agencyPhone: String(agencyPhone) }),
        ...(agencyAddress !== undefined && { agencyAddress: String(agencyAddress) }),
        ...(principalName !== undefined && { principalName: String(principalName) }),
        ...(principalTitle !== undefined && { principalTitle: String(principalTitle) }),
        ...(notifyNewLeads !== undefined && { notifyNewLeads: Boolean(notifyNewLeads) }),
        ...(notifyEmail !== undefined && { notifyEmail: String(notifyEmail) }),
      },
      create: {
        id: SINGLETON_ID,
        ...(agencyName !== undefined && { agencyName: String(agencyName) }),
        ...(agencyEmail !== undefined && { agencyEmail: String(agencyEmail) }),
        ...(agencyPhone !== undefined && { agencyPhone: String(agencyPhone) }),
        ...(agencyAddress !== undefined && { agencyAddress: String(agencyAddress) }),
        ...(principalName !== undefined && { principalName: String(principalName) }),
        ...(principalTitle !== undefined && { principalTitle: String(principalTitle) }),
        ...(notifyNewLeads !== undefined && { notifyNewLeads: Boolean(notifyNewLeads) }),
        ...(notifyEmail !== undefined && { notifyEmail: String(notifyEmail) }),
      },
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
