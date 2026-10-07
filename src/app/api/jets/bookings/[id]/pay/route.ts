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

    // Reuse an in-flight checkout — idempotent retry instead of a new
    // transaction. Paystack links live ~24h; we rotate after 15 min anyway
    // so an abandoned attempt can still be re-initialized.
    const INIT_TTL_MS = 15 * 60_000;
    if (
      booking.checkoutUrl &&
      booking.paymentInitiatedAt &&
      Date.now() - booking.paymentInitiatedAt.getTime() < INIT_TTL_MS
    ) {
      return NextResponse.json({ checkoutUrl: booking.checkoutUrl });
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

    // Atomically claim the init slot: the update only lands when no fresh
    // claim exists, so concurrent /pay calls can't both reach Paystack and
    // mint duplicate transactions. The loser gets the winner's URL (or a
    // 409 if it hasn't finished writing yet — client retries).
    const claim = await prisma.jetBooking.updateMany({
      where: {
        id: booking.id,
        userId: session.user.id,
        paymentStatus: { not: "Paid" },
        OR: [
          { paymentInitiatedAt: null },
          { paymentInitiatedAt: { lt: new Date(Date.now() - INIT_TTL_MS) } },
        ],
      },
      data: { paymentInitiatedAt: new Date() },
    });

    if (claim.count === 0) {
      const current = await prisma.jetBooking.findUnique({
        where: { id: booking.id },
        select: { checkoutUrl: true, paymentStatus: true },
      });
      if (current?.paymentStatus === "Paid") {
        return NextResponse.json({ error: "Booking is already paid" }, { status: 409 });
      }
      if (current?.checkoutUrl) {
        return NextResponse.json({ checkoutUrl: current.checkoutUrl });
      }
      return NextResponse.json(
        { error: "Payment initialization already in progress" },
        { status: 409 }
      );
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
      // Release the claim so an immediate retry isn't blocked by our failed init.
      await prisma.jetBooking.updateMany({
        where: { id: booking.id },
        data: { paymentInitiatedAt: null },
      });
      console.error("Paystack init failed:", error instanceof PaystackError ? error.message : error);
      return NextResponse.json({ error: "Could not initialize payment" }, { status: 502 });
    }

    const checkoutUrl = paymentResponse.data.authorization_url;

    await prisma.jetBooking.update({
      where: { id: booking.id },
      data: {
        paymentReference: reference,
        checkoutUrl,
        paymentInitiatedAt: new Date(),
      },
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Resume payment error:", error);
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
  }
}
