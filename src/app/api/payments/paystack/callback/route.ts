import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("trxref") || searchParams.get("reference");

    if (!reference || reference.length > 120) {
      return NextResponse.redirect(new URL("/account/bookings?error=missing_reference", req.url));
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.warn("PAYSTACK_SECRET_KEY not set. Mock verification.");
      return NextResponse.redirect(new URL("/account/bookings?status=success", req.url));
    }

    const verification = await verifyTransaction(reference);
    const data = verification?.data;

    if (!verification.status || data?.status !== "success") {
      return NextResponse.redirect(new URL("/account/bookings?error=payment_failed", req.url));
    }

    // Bind the verified transaction to OUR booking: the reference must match
    // the one we issued, and the amount charged must equal the booking total
    // (both stored in kobo). Without this, a user could pass a reference for
    // a cheaper/forged transaction and get a booking marked Paid.
    const bookingId = data.metadata?.bookingId;
    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.redirect(new URL("/account/bookings?error=invalid_reference", req.url));
    }

    const booking = await prisma.jetBooking.findUnique({ where: { id: bookingId } });

    if (
      !booking ||
      booking.paymentReference !== reference ||
      Number(booking.totalAmount) !== Number(data.amount)
    ) {
      console.warn(`Paystack callback mismatch for reference ${reference}`);
      return NextResponse.redirect(new URL("/account/bookings?error=payment_mismatch", req.url));
    }

    // Idempotent — only transition Unpaid bookings
    if (booking.paymentStatus !== "Paid") {
      await prisma.jetBooking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "Paid",
          status: "Confirmed",
        },
      });
    }

    return NextResponse.redirect(new URL("/account/bookings?status=success", req.url));
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.redirect(new URL("/account/bookings?error=server_error", req.url));
  }
}
