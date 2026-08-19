import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const booking = await prisma.jetBooking.update({
      where: { id: bookingId },
      data: {
        status: "Confirmed",
        paymentStatus: "Paid",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Mock pay error:", error);
    return NextResponse.json({ error: "Failed to process mock payment" }, { status: 500 });
  }
}
