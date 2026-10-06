import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { updateProjectSchema } from "@/lib/validations/project";
import { getProjectBySlug } from "@/data/projects";
import { getProjectContent } from "@/data/project-content";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const content = await getProjectContent(slug);
    return NextResponse.json({ slug: project.slug, name: project.name, url: project.url, ...content });
  } catch (error) {
    console.error("Project fetch error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.format() }, { status: 400 });
    }

    const updated = await prisma.project.upsert({
      where: { slug },
      update: { progress: parsed.data.progress, siteMedia: parsed.data.siteMedia },
      create: {
        slug,
        name: project.name,
        progress: parsed.data.progress,
        siteMedia: parsed.data.siteMedia,
      },
    });

    revalidatePath(project.url);
    revalidatePath("/properties");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Project update error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
