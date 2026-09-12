import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Mock payment endpoint — ONLY for local development when Paystack
 * is not configured. Disabled entirely when PAYSTACK_SECRET_KEY is set
 * so it can never bypass real payment verification in production.
 */
export async function POST(req: Request) {
  try {
    if (process.env.PAYSTACK_SECRET_KEY || process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await req.json();

    if (!bookingId || typeof bookingId !== "string" || bookingId.length > 80) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    // Only the booking's owner may confirm it — prevents IDOR
    const booking = await prisma.jetBooking.updateMany({
      where: { id: bookingId, userId: session.user.id },
      data: {
        status: "Confirmed",
        paymentStatus: "Paid",
      },
    });

    if (booking.count === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mock pay error:", error);
    return NextResponse.json({ error: "Failed to process mock payment" }, { status: 500 });
  }
}
