import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const ADMIN_ROLE = "ADMIN";

/**
 * Resolves the current session and enforces the ADMIN role.
 * Returns the session on success, or a ready-to-return 401/403 response.
 *
 * Usage:
 *   const guard = await requireAdmin();
 *   if (guard.response) return guard.response;
 *   const session = guard.session;
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== ADMIN_ROLE) {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}

/** Resolves the current session for any authenticated user (customer or admin). */
export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, response: null };
}

/**
 * Page-level admin guard for server components in src/app/admin/(authed).
 * Layouts are not re-rendered on client-side navigation between sibling
 * pages, so the layout guard alone would let a revoked session keep
 * reading dashboard data until a hard reload. Each page calls this.
 */
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== ADMIN_ROLE) {
    redirect("/admin/login");
  }
  return session;
}
