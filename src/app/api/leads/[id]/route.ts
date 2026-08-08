import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PATCH /api/leads/[id]
 * Updates a lead's status. Admin-protected via proxy.ts.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["New", "Contacted", "Qualified", "Lost"];
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
 * Permanently removes a lead. Admin-protected via proxy.ts.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
