import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  // Strip angle brackets — names never need markup; blocks stored-XSS probes.
  name: z.string().trim().max(120).transform((v) => v.replace(/[<>]/g, "")).optional(),
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

    // Always burn a bcrypt round — otherwise the exists-path returns far
    // faster than the create-path and response timing reveals whether the
    // email is registered.
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // Anti-enumeration: identical status + body whether or not the account
    // already exists. The client cannot distinguish "created" from "already
    // registered", and must never auto-sign-in here — a signIn probe after
    // registration would re-open the oracle (success = email was new).
    if (existingUser) {
      return NextResponse.json(
        { message: "Registration successful. You can now sign in." },
        { status: 201 }
      );
    }

    await prisma.user.create({
      data: {
        name: name ?? null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json(
      { message: "Registration successful. You can now sign in." },
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
