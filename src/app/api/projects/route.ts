import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guard";
import { getAllProjects } from "@/data/projects";

export const dynamic = "force-dynamic";

/** Lists registered projects so the admin property form can link listings. */
export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const projects = getAllProjects().map((p) => ({ slug: p.slug, name: p.name, url: p.url }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects list error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}
