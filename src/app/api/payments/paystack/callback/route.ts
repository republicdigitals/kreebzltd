/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("trxref") || searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(new URL("/account/bookings?error=missing_reference", req.url));
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.warn("PAYSTACK_SECRET_KEY not set. Mock verification.");
      return NextResponse.redirect(new URL("/account/bookings?status=success", req.url));
    }

    const Paystack = require("paystack-api")(paystackSecret);

    const verification = await Paystack.transaction.verify({ reference });

    if (verification.status && verification.data.status === "success") {
      const bookingId = verification.data.metadata.bookingId;
      
      if (bookingId) {
        await prisma.jetBooking.update({
          where: { id: bookingId },
          data: { 
            paymentStatus: "Paid",
            status: "Confirmed"
          }
        });
      }

      return NextResponse.redirect(new URL("/account/bookings?status=success", req.url));
    } else {
      return NextResponse.redirect(new URL("/account/bookings?error=payment_failed", req.url));
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.redirect(new URL("/account/bookings?error=server_error", req.url));
  }
}
