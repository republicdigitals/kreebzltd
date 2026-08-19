/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jetId, startDate, endDate, route, passengers } = body;

    if (!jetId || !startDate || !endDate || !route || !passengers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
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
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    const totalAmount = jet.baseHourlyRate * durationHours;

    // 4. Create Pending Booking
    const booking = await prisma.jetBooking.create({
      data: {
        userId: session.user.id,
        jetId: jet.id,
        startDate: start,
        endDate: end,
        route,
        passengers: parseInt(passengers),
        status: "Pending",
        paymentStatus: "Unpaid",
        totalAmount,
      },
    });

    // 5. Initialize Paystack Transaction
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.warn("PAYSTACK_SECRET_KEY not set. Operating in mock mode.");
      return NextResponse.json({
        booking,
        checkoutUrl: `/services/private-jet/mock-checkout?bookingId=${booking.id}`,
      });
    }

    const paystack = require("paystack-api")(paystackSecret);
    
    // We pass the booking ID in the reference to track it
    const reference = `KREEBZ-JET-${booking.id}-${Date.now()}`;
    
    const paymentResponse = await paystack.transaction.initialize({
      amount: totalAmount * 100, // Paystack amount is in kobo
      email: session.user.email,
      reference,
      callback_url: `${process.env.NEXTAUTH_URL}/api/payments/paystack/callback`,
      metadata: {
        bookingId: booking.id,
        type: "JET_CHARTER"
      }
    });

    if (paymentResponse.status) {
      // Update booking with reference
      await prisma.jetBooking.update({
        where: { id: booking.id },
        data: { paymentReference: reference }
      });

      return NextResponse.json({
        booking,
        checkoutUrl: paymentResponse.data.authorization_url
      });
    } else {
      throw new Error(paymentResponse.message);
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Jet Booking Error:", err);
    return NextResponse.json({ error: err.message || "Failed to create booking" }, { status: 500 });
  }
}
