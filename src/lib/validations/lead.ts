import { z } from "zod";

/**
 * Server-side schema for POST /api/leads.
 * Every string is length-capped so oversized payloads can't bloat the DB.
 */
// Names and phone numbers never legitimately contain HTML markup — strip
// angle brackets so stored values can't carry tags into any future render
// context (emails, CSV export, non-React surfaces).
const noMarkup = (v: string) => v.replace(/[<>]/g, "");

export const createLeadSchema = z.object({
  name: z.string().trim().min(1).max(120).transform(noMarkup),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).transform(noMarkup).optional(),
  interest: z.string().trim().min(1).max(60),
  message: z.string().trim().max(5000).optional(),
  propertyId: z.string().trim().max(80).optional(),

  // Contextual enquiry fields
  project: z.enum(["bourdillon", "other", "not-sure"]).optional(),
  nextStep: z.enum(["brochure", "call", "consultation", "viewing", "info"]).optional(),
  timeframe: z
    .enum(["immediately", "1-3-months", "3-6-months", "6-12-months", "researching"])
    .optional(),
  preferredContact: z.enum(["email", "phone", "whatsapp"]).optional(),
  consent: z.boolean().optional(),

  // Attribution
  utmSource: z.string().trim().max(200).optional(),
  utmMedium: z.string().trim().max(200).optional(),
  utmCampaign: z.string().trim().max(200).optional(),
  utmContent: z.string().trim().max(200).optional(),
  referrer: z.string().trim().max(500).optional(),
  landingPage: z.string().trim().max(500).optional(),

  // Honeypot — must be empty; bots that fill it are silently discarded
  website: z.string().max(200).optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
