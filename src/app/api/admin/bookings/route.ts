import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const bookings = await prisma.jetBooking.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        jet: { select: { name: true, class: true, tailNumber: true } },
      },
    });

    // BigInt → Number (kobo, safe integer range)
    const serialized = bookings.map((b) => ({
      ...b,
      totalAmount: Number(b.totalAmount),
    }));

    return NextResponse.json({ bookings: serialized });
  } catch (error) {
    console.error("Admin bookings list error:", error);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}
