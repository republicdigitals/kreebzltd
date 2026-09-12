import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { jetBookings: true, savedProperties: true } },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
