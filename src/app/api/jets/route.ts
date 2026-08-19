import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const jets = await prisma.jet.findMany({
      where: {
        status: "Active",
      },
      orderBy: {
        baseHourlyRate: "asc",
      },
    });

    return NextResponse.json({ jets });
  } catch (error: unknown) {
    console.error("Failed to fetch jets:", error);
    return NextResponse.json({ error: "Failed to fetch aircraft inventory" }, { status: 500 });
  }
}
