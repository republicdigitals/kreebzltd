import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ ids: [] });
    }

    const saved = await prisma.savedProperty.findMany({
      where: { userId: session.user.id },
      select: { propertyId: true }
    });

    return NextResponse.json({ ids: saved.map(s => s.propertyId) });
  } catch (error) {
    console.error("Error fetching saved property ids:", error);
    return NextResponse.json({ ids: [] });
  }
}
