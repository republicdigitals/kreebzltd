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

    // BigInt isn't JSON-serializable — convert kobo amounts to Number
    // (well within Number.MAX_SAFE_INTEGER).
    const serialized = jets.map((jet) => ({
      ...jet,
      baseHourlyRate: Number(jet.baseHourlyRate),
    }));

    return NextResponse.json({ jets: serialized });
  } catch (error: unknown) {
    console.error("Failed to fetch jets:", error);
    return NextResponse.json({ error: "Failed to fetch aircraft inventory" }, { status: 500 });
  }
}
