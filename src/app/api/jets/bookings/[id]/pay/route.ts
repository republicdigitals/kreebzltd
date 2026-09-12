import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { initializeTransaction, PaystackError } from "@/lib/paystack";

/**
 * POST /api/jets/bookings/[id]/pay
 * Re-initializes a Paystack checkout for an existing Unpaid booking.
 * Owner-only, idempotent-safe: each attempt issues a fresh reference.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.jetBooking.findFirst({
      where: { id, userId: session.user.id },
      include: { jet: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json({ error: "Booking is already paid" }, { status: 409 });
    }

    if (booking.status === "Cancelled" || booking.status === "Completed") {
      return NextResponse.json({ error: "Booking can no longer be paid" }, { status: 400 });
    }

    if (!rateLimit(`jet-pay:${session.user.id}`, 10, 60_000).ok) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json({
        checkoutUrl: `/services/private-jet/mock-checkout?bookingId=${booking.id}`,
      });
    }

    const reference = `KREEBZ-JET-${booking.id}-${Date.now()}`;

    let paymentResponse;
    try {
      paymentResponse = await initializeTransaction({
        amount: Number(booking.totalAmount), // already in kobo
        email: session.user.email ?? "",
        reference,
        callback_url: `${process.env.NEXTAUTH_URL}/api/payments/paystack/callback`,
        metadata: {
          bookingId: booking.id,
          type: "JET_CHARTER",
        },
      });
    } catch (error) {
      console.error("Paystack init failed:", error instanceof PaystackError ? error.message : error);
      return NextResponse.json({ error: "Could not initialize payment" }, { status: 502 });
    }

    await prisma.jetBooking.update({
      where: { id: booking.id },
      data: { paymentReference: reference },
    });

    return NextResponse.json({ checkoutUrl: paymentResponse.data.authorization_url });
  } catch (error) {
    console.error("Resume payment error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
