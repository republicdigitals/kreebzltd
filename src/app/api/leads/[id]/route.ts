import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

/**
 * PATCH /api/leads/[id]
 * Updates a lead's status. Admin-only.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Consultation booked",
      "Viewing booked",
      "Nurture",
      "Closed",
      "Not suitable",
      "Lost",
    ];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(status && { status }),
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("[PATCH /api/leads/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads/[id]
 * Permanently removes a lead. Admin-only.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await params;
    await prisma.lead.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/leads/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
