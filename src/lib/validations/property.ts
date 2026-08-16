import { z } from "zod";
import { PublicationStatus } from "@prisma/client";

export const mediaMutationSchema = z.object({
  id: z.string().optional(),
  isNew: z.boolean().optional(),
  storageKey: z.string().optional(),
  url: z.string().url(),
  isCover: z.boolean().default(false),
  order: z.number().default(0),
});

export const createPropertySchema = z.object({
  id: z.string().min(1, "ID is required"),
  price: z.string().min(1, "Price is required"),
  address: z.string().min(1, "Address is required"),
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
  publicationStatus: z.nativeEnum(PublicationStatus).optional(),
  media: z.array(mediaMutationSchema).optional()
});

export const updatePropertySchema = createPropertySchema.partial().omit({ id: true });
