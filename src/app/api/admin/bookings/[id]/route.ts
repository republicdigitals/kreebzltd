import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

const patchSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Completed", "Cancelled"]).optional(),
  paymentStatus: z.enum(["Unpaid", "Paid", "Refunded"]).optional(),
}).refine((d) => d.status || d.paymentStatus, { message: "Nothing to update" });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await params;
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updated = await prisma.jetBooking.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ...updated, totalAmount: Number(updated.totalAmount) });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
