import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { initializeTransaction } from "@/lib/paystack";

const MAX_BOOKING_DAYS = 30;

const bookingSchema = z.object({
  jetId: z.string().trim().min(1).max(80),
  // datetime-local emits "YYYY-MM-DDTHH:mm" — validated via Date parsing below
  startDate: z.string().trim().min(8).max(40),
  endDate: z.string().trim().min(8).max(40),
  route: z.string().trim().min(2).max(200),
  passengers: z.number().int().min(1).max(50),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Throttle booking creation per user — prevents inventory/payment spam
    if (!rateLimit(`jet-booking:${session.user.id}`, 10, 60_000).ok) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const parsed = bookingSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid booking fields" }, { status: 400 });
    }

    const { jetId, startDate, endDate, route, passengers } = parsed.data;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    const durationMs = end.getTime() - start.getTime();
    if (durationMs > MAX_BOOKING_DAYS * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: `Bookings cannot exceed ${MAX_BOOKING_DAYS} days` }, { status: 400 });
    }

    // 1. Fetch Jet to ensure it exists and get its rate
    const jet = await prisma.jet.findUnique({
      where: { id: jetId },
    });

    if (!jet) {
      return NextResponse.json({ error: "Aircraft not found" }, { status: 404 });
    }

    if (jet.status !== "Active") {
      return NextResponse.json({ error: "Aircraft is currently unavailable" }, { status: 400 });
    }

    if (passengers > jet.passengers) {
      return NextResponse.json({ error: `Aircraft maximum capacity is ${jet.passengers} passengers` }, { status: 400 });
    }

    // 2. Inventory Check: Ensure no overlapping confirmed bookings
    const overlappingBookings = await prisma.jetBooking.findMany({
      where: {
        jetId: jet.id,
        status: { in: ["Confirmed", "Completed"] },
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingBookings.length > 0) {
      return NextResponse.json({ error: "Aircraft is not available for the selected dates" }, { status: 409 });
    }

    // 3. Calculate estimated cost
    // For simplicity, we calculate hours based on start/end date difference
    // In a real scenario, flight hours are much shorter than reservation blocks,
    // so this is a simplified calculation: rate * block duration (in hours)
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    // baseHourlyRate is a Prisma BigInt (kobo); keep the total in BigInt to match the schema.
    const totalAmount = jet.baseHourlyRate * BigInt(durationHours);

    // 4. Create Pending Booking
    const booking = await prisma.jetBooking.create({
      data: {
        userId: session.user.id,
        jetId: jet.id,
        startDate: start,
        endDate: end,
        route,
        passengers,
        status: "Pending",
        paymentStatus: "Unpaid",
        totalAmount,
      },
    });

    // BigInt isn't JSON-serializable — expose totalAmount as a Number (kobo).
    const serializedBooking = { ...booking, totalAmount: Number(booking.totalAmount) };

    // 5. Initialize Paystack Transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.warn("PAYSTACK_SECRET_KEY not set. Operating in mock mode.");
      return NextResponse.json({
        booking: serializedBooking,
        checkoutUrl: `/services/private-jet/mock-checkout?bookingId=${booking.id}`,
      });
    }

    // We pass the booking ID in the reference to track it
    const reference = `KREEBZ-JET-${booking.id}-${Date.now()}`;

    const paymentResponse = await initializeTransaction({
      // totalAmount is already in kobo — do NOT multiply by 100 again.
      amount: Number(totalAmount),
      email: session.user.email ?? "",
      reference,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/paystack/callback`,
      metadata: {
        bookingId: booking.id,
        type: "JET_CHARTER"
      }
    });

    // Update booking with the reference we issued
    await prisma.jetBooking.update({
      where: { id: booking.id },
      data: { paymentReference: reference }
    });

    return NextResponse.json({
      booking: serializedBooking,
      checkoutUrl: paymentResponse.data.authorization_url
    });

  } catch (error: unknown) {
    console.error("Jet Booking Error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
