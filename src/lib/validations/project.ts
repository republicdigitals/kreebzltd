import { z } from "zod";

export const progressUpdateSchema = z.object({
  date: z.string().default(""),
  milestone: z.string().min(1, "Milestone is required"),
  detail: z.string().default(""),
  image: z.string().nullable().optional(),
  imageLabel: z.string().nullable().optional(),
});

export const projectMediaItemSchema = z.object({
  src: z.string().min(1, "Media URL is required"),
  label: z.string().default(""),
});

export const siteMediaSchema = z.object({
  clips: z.array(projectMediaItemSchema).default([]),
  photos: z.array(projectMediaItemSchema).default([]),
});

export const updateProjectSchema = z.object({
  progress: z.array(progressUpdateSchema).default([]),
  siteMedia: siteMediaSchema,
});
