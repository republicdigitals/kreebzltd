import prisma from "@/lib/prisma";
import { FILE_PROJECT_CONTENT, type ProjectContent } from "./projects";

export type { ProjectContent };

/**
 * Living project content (progress updates + site media).
 * Reads the `Project` DB row when present so admins can publish updates
 * without a deploy; falls back to the file defaults otherwise.
 *
 * Server-only — client components receive this data via props.
 */
export async function getProjectContent(slug: string): Promise<ProjectContent> {
  const fallback = FILE_PROJECT_CONTENT[slug] ?? { progress: [], siteMedia: { clips: [], photos: [] } };
  try {
    const row = await prisma.project.findUnique({ where: { slug } });
    if (!row) return fallback;
    const dbProgress = row.progress as unknown as ProjectContent["progress"];
    const dbMedia = row.siteMedia as unknown as ProjectContent["siteMedia"];
    return {
      progress: Array.isArray(dbProgress) && dbProgress.length > 0 ? dbProgress : fallback.progress,
      siteMedia:
        dbMedia && (dbMedia.clips?.length || dbMedia.photos?.length)
          ? { clips: dbMedia.clips ?? [], photos: dbMedia.photos ?? [] }
          : fallback.siteMedia,
    };
  } catch (error) {
    console.error("Failed to fetch project content", error);
    return fallback;
  }
}
