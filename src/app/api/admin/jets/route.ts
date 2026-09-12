import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

const jetSchema = z.object({
  tailNumber: z.string().trim().min(2).max(20),
  name: z.string().trim().min(1).max(120),
  class: z.enum(["Light Jet", "Midsize Jet", "Heavy Jet"]),
  passengers: z.number().int().min(1).max(30),
  range: z.string().trim().min(1).max(60),
  /** Naira amount from the form — stored as kobo */
  hourlyRateNaira: z.number().positive().max(1_000_000_000),
  image: z.string().trim().max(500).optional().nullable(),
  status: z.enum(["Active", "Maintenance"]).default("Active"),
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const jets = await prisma.jet.findMany({ orderBy: { baseHourlyRate: "asc" } });
    return NextResponse.json({
      jets: jets.map((j) => ({ ...j, baseHourlyRate: Number(j.baseHourlyRate) })),
    });
  } catch (error) {
    console.error("Admin jets list error:", error);
    return NextResponse.json({ error: "Failed to load fleet" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const parsed = jetSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const { hourlyRateNaira, ...rest } = parsed.data;

    const existing = await prisma.jet.findUnique({ where: { tailNumber: rest.tailNumber } });
    if (existing) {
      return NextResponse.json({ error: "Tail number already exists" }, { status: 409 });
    }

    const created = await prisma.jet.create({
      data: { ...rest, baseHourlyRate: BigInt(Math.round(hourlyRateNaira * 100)) },
    });

    return NextResponse.json({ ...created, baseHourlyRate: Number(created.baseHourlyRate) }, { status: 201 });
  } catch (error) {
    console.error("Admin jet create error:", error);
    return NextResponse.json({ error: "Failed to create aircraft" }, { status: 500 });
  }
}
