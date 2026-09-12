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
    if (reference) {
      try {
        // Bind to the reference we issued at initialize-time; verify the
        // charged amount equals the booking total (both in kobo).
        const booking = await prisma.jetBooking.findUnique({
          where: { paymentReference: reference },
        });

        if (booking && Number(booking.totalAmount) === Number(event.data?.amount)) {
          await prisma.jetBooking.updateMany({
            where: { id: booking.id, paymentStatus: { not: "Paid" } },
            data: { paymentStatus: "Paid", status: "Confirmed" },
          });
        } else {
          console.warn(`Webhook reference mismatch: ${reference}`);
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
