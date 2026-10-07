/**
 * Project registry — links Property rows (via `projectSlug`) to project pages.
 *
 * EDITING GUIDE:
 * - Each entry maps a `projectSlug` (set on the Property row) to a project
 *   page URL and its shared site media.
 * - To add a project: add an entry here, create its data file + page under
 *   `src/app/(main)/developments/<slug>/page.tsx`, then set `projectSlug` on any
 *   Property rows that belong to it.
 */

import { bourdillon, type ProgressUpdate } from "./bourdillon";

export interface SiteMedia {
  clips: { src: string; label: string }[];
  photos: { src: string; label: string }[];
}

export interface ProjectRef {
  slug: string;
  name: string;
  url: string;
  siteMedia: SiteMedia;
  location?: string;
  status?: string;
  positioning?: string;
  image?: string;
  imageLabel?: string;
}

const registry: Record<string, ProjectRef> = {
  bourdillon: {
    slug: "bourdillon",
    name: bourdillon.name,
    url: bourdillon.url,
    siteMedia: bourdillon.siteMedia,
    location: bourdillon.location,
    status: bourdillon.status,
    positioning: bourdillon.positioning,
    image: bourdillon.heroImage,
    imageLabel: bourdillon.heroImageLabel,
  },
};

/** Resolve a Property.projectSlug to its project page, if one exists. */
export function getProjectBySlug(slug: string | null | undefined): ProjectRef | null {
  if (!slug) return null;
  return registry[slug] ?? null;
}

/** All registered projects — e.g. for admin dropdowns. */
export function getAllProjects(): ProjectRef[] {
  return Object.values(registry);
}

export interface ProjectContent {
  progress: ProgressUpdate[];
  siteMedia: SiteMedia;
}

/**
 * File defaults per project — used when no `Project` DB row exists yet.
 * Server code should prefer `getProjectContent` from `./project-content`.
 */
export const FILE_PROJECT_CONTENT: Record<string, ProjectContent> = {
  bourdillon: { progress: bourdillon.progress, siteMedia: bourdillon.siteMedia },
};
