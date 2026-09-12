import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

const jetPatchSchema = z.object({
  tailNumber: z.string().trim().min(2).max(20).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  class: z.enum(["Light Jet", "Midsize Jet", "Heavy Jet"]).optional(),
  passengers: z.number().int().min(1).max(30).optional(),
  range: z.string().trim().min(1).max(60).optional(),
  hourlyRateNaira: z.number().positive().max(1_000_000_000).optional(),
  image: z.string().trim().max(500).optional().nullable(),
  status: z.enum(["Active", "Maintenance"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await params;
    const parsed = jetPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { hourlyRateNaira, ...rest } = parsed.data;
    const updated = await prisma.jet.update({
      where: { id },
      data: {
        ...rest,
        ...(hourlyRateNaira !== undefined && {
          baseHourlyRate: BigInt(Math.round(hourlyRateNaira * 100)),
        }),
      },
    });

    return NextResponse.json({ ...updated, baseHourlyRate: Number(updated.baseHourlyRate) });
  } catch (error) {
    console.error("Admin jet update error:", error);
    return NextResponse.json({ error: "Failed to update aircraft" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await params;
    const bookingCount = await prisma.jetBooking.count({ where: { jetId: id } });
    if (bookingCount > 0) {
      // Preserve financial history — mark inactive instead of deleting
      await prisma.jet.update({ where: { id }, data: { status: "Maintenance" } });
      return NextResponse.json({ archived: true, reason: "Aircraft has bookings — set to Maintenance" });
    }

    await prisma.jet.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Admin jet delete error:", error);
    return NextResponse.json({ error: "Failed to delete aircraft" }, { status: 500 });
  }
}
