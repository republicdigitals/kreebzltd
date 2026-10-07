import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import prisma from "@/lib/prisma";

/**
 * POST /api/payments/paystack/webhook
 *
 * Paystack's authoritative payment signal (the browser callback is only a UX
 * redirect — this webhook is what actually confirms money moved).
 *
 * Per Paystack docs:
 *  - Verify `x-paystack-signature` = HMAC-SHA512 of the RAW body, keyed with
 *    the secret key. Must verify before trusting any field.
 *  - Respond 200 quickly; retries are hourly (test) / up to 72h (live).
 *
 * Configure the URL in Dashboard → Settings → API Keys & Webhooks
 * (separate URLs for test and live modes).
 */
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  // Raw body required — signature is over the exact bytes sent.
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; amount?: number; metadata?: { bookingId?: string } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    const bookingId = event.data?.metadata?.bookingId;
    if (reference && bookingId && typeof bookingId === "string") {
      try {
        // Bind to the booking via metadata — NOT the stored paymentReference:
        // a user may re-initialize (rotating the stored reference) and then
        // pay on the older checkout link. The signature above already proves
        // this event came from Paystack, so metadata is trustworthy; we still
        // require the reference prefix we issue AND amount equality.
        const booking = await prisma.jetBooking.findUnique({
          where: { id: bookingId },
        });

        const referenceOurs = reference.startsWith(`KREEBZ-JET-${bookingId}-`);
        if (!booking || !referenceOurs || Number(booking.totalAmount) !== Number(event.data?.amount)) {
          console.warn(`Webhook reference mismatch: ${reference}`);
        } else {
          // Confirm-time overlap check — two buyers can hold Pending bookings
          // for the same dates and both pay; whoever confirms first wins. The
          // loser is marked Paid but left Pending for manual review/refund
          // rather than silently double-booking the aircraft.
          const conflict = await prisma.jetBooking.count({
            where: {
              jetId: booking.jetId,
              id: { not: booking.id },
              status: { in: ["Confirmed", "Completed"] },
              startDate: { lte: booking.endDate },
              endDate: { gte: booking.startDate },
            },
          });

          if (conflict > 0) {
            await prisma.jetBooking.updateMany({
              where: { id: booking.id, paymentStatus: { not: "Paid" } },
              data: { paymentStatus: "Paid" },
            });
            console.error(`Booking ${booking.id} paid but overlaps a confirmed booking — needs manual review/refund`);
          } else {
            await prisma.jetBooking.updateMany({
              where: { id: booking.id, paymentStatus: { not: "Paid" } },
              data: { paymentStatus: "Paid", status: "Confirmed" },
            });
          }
        }
      } catch (error) {
        console.error("Webhook processing error:", error);
        // Still return 200 — a 5xx triggers retries for a payload we may have
        // already applied; the updateMany above is idempotent.
      }
    }
  }

  return NextResponse.json({ received: true });
}
