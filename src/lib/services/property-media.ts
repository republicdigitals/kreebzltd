import prisma from "@/lib/prisma";
import { deleteMedia } from "@/lib/storage";
import { z } from "zod";
import { mediaMutationSchema } from "@/lib/validations/property";

type MediaInput = z.infer<typeof mediaMutationSchema>;

export async function syncPropertyMedia(propertyId: string, newMedia: MediaInput[]) {
  // Fetch existing media from DB
  const existingMedia = await prisma.propertyMedia.findMany({
    where: { propertyId }
  });
  
  const newMediaIds = newMedia.map((m) => m.id).filter(Boolean) as string[];
  
  // Find media to delete (exists in DB but not in new array)
  const mediaToDelete = existingMedia.filter((m) => !newMediaIds.includes(m.id));
  
  // Delete orphaned media from Supabase Storage
  for (const media of mediaToDelete) {
    if (media.storageKey) {
      await deleteMedia(media.storageKey);
    }
  }
  
  // Delete from DB
  if (mediaToDelete.length > 0) {
    await prisma.propertyMedia.deleteMany({
      where: {
        id: { in: mediaToDelete.map((m) => m.id) }
      }
    });
  }
  
  // Create or Update new media
  for (const m of newMedia) {
    const payloadData = {
      propertyId,
      storageKey: m.storageKey || m.url,
      url: m.url,
      mimeType: "image/jpeg",
      size: 0,
      isCover: m.isCover,
      order: m.order,
    };
    
    if (m.isNew || !m.id || m.id.startsWith("temp-")) {
      await prisma.propertyMedia.create({ data: payloadData });
    } else {
      await prisma.propertyMedia.update({
        where: { id: m.id },
        data: payloadData
      });
    }
  }
}

export async function deletePropertyWithMedia(propertyId: string) {
  const existingMedia = await prisma.propertyMedia.findMany({
    where: { propertyId }
  });
  
  // Delete media files from Supabase Storage
  for (const media of existingMedia) {
    if (media.storageKey) {
      await deleteMedia(media.storageKey);
    }
  }
  
  // Hard delete property (cascades to PropertyMedia in DB)
  await prisma.property.delete({
    where: { id: propertyId }
  });
}
