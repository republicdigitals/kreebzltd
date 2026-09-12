import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(254),
  // bcrypt only uses the first 72 bytes — cap there to avoid silent truncation
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registration attempts per minute per IP
    const rl = rateLimit(`register:${clientIp(request)}`, 5, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid registration details" },
        { status: 400 }
      );
    }

    const { name, password } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name ?? null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
