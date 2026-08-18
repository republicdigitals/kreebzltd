import { z } from "zod";
import { PublicationStatus } from "@prisma/client";

export const mediaMutationSchema = z.object({
  id: z.string().optional(),
  isNew: z.boolean().optional(),
  storageKey: z.string().nullable().optional(),
  url: z.string().min(1, "URL is required"),
  isCover: z.boolean().default(false),
  order: z.number().default(0),
});

const basePropertySchema = z.object({
  id: z.string().min(1, "ID is required"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  price: z.string().default(""),
  address: z.string().default(""),
  neighbourhood: z.string().default(""),
  city: z.string().default(""),
  beds: z.number().int().nonnegative().default(0),
  baths: z.number().int().nonnegative().default(0),
  status: z.string().default("For Sale"),
  type: z.string().default("Property"),
  priceValue: z.number().nonnegative().default(0),
  lat: z.number().default(0),
  lng: z.number().default(0),
  imagePlaceholder: z.string().default(""),
  image: z.string().optional().nullable(),
  photoCount: z.number().int().nonnegative().default(0),
  gallery: z.array(z.string()).default([]),
  description: z.string().default(""),
  rooms: z.any().default([]),
  floorPlans: z.any().default([]).nullable(),
  principal: z.any().default({}),
  publicationStatus: z.nativeEnum(PublicationStatus).default("DRAFT"),
  media: z.array(mediaMutationSchema).optional()
});

const publicationRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.publicationStatus === "PUBLISHED") {
    if (!data.price || data.price.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price is required to publish",
        path: ["price"],
      });
    }
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required to publish",
        path: ["address"],
      });
    }
    if (!data.description || data.description.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description (min 10 chars) is required to publish",
        path: ["description"],
      });
    }
    const hasMedia = data.media && data.media.length > 0;
    const hasImage = data.image && data.image.trim() !== "";
    if (!hasMedia && !hasImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one image is required to publish",
        path: ["media"],
      });
    }
  }
};

export const createPropertySchema = basePropertySchema.superRefine(publicationRefinement);

export const updatePropertySchema = basePropertySchema.partial().omit({ id: true }).superRefine(publicationRefinement);
