import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { jetBookings: true, savedProperties: true } },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1).optional(),
  password: z.string().min(12, "Password must be at least 12 characters"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).nullable().optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  password: z.string().min(12, "Password must be at least 12 characters").optional(),
});

export async function POST(request: Request) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const parsed = createUserSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }
    const { email, name, password, role } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name ?? null,
        password: await bcrypt.hash(password, 12),
        role,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Admin user create error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const parsed = updateUserSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }
    const { id, name, role, password } = parsed.data;

    // Never let an admin demote or lock out the last remaining admin.
    if (role === "USER") {
      const target = await prisma.user.findUnique({ where: { id } });
      if (target?.role === "ADMIN") {
        const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
        if (adminCount <= 1) {
          return NextResponse.json({ error: "Cannot demote the last admin account" }, { status: 400 });
        }
      }
    }

    const data: { name?: string | null; role?: string; password?: string; tokenVersion?: { increment: number } } = {};
    if (name !== undefined) data.name = name;
    if (role) data.role = role;
    if (password) {
      data.password = await bcrypt.hash(password, 12);
      // Bump tokenVersion so existing sessions for this user are revoked.
      data.tokenVersion = { increment: 1 };
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "User id is required" }, { status: 400 });

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the last admin account" }, { status: 400 });
      }
    }
    if (target.id === guard.session?.user?.id) {
      return NextResponse.json({ error: "You cannot delete your own account while signed in" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
