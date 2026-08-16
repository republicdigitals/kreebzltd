import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting media migration...");
  
  const properties = await prisma.property.findMany();
  
  for (const property of properties) {
    console.log(`Processing property: ${property.id}`);
    
    let order = 0;
    
    // Migrate main image as cover
    if (property.image && property.image.trim() !== "") {
      const existingMedia = await prisma.propertyMedia.findFirst({
        where: { propertyId: property.id, url: property.image }
      });
      
      if (!existingMedia) {
        await prisma.propertyMedia.create({
          data: {
            propertyId: property.id,
            storageKey: property.image, // URL acts as storageKey for old images
            url: property.image,
            mimeType: "image/jpeg",
            size: 0,
            isCover: true,
            order: order++
          }
        });
        console.log(`Migrated cover image for ${property.id}`);
      }
    }
    
    // Migrate gallery images
    if (property.gallery && property.gallery.length > 0) {
      for (const url of property.gallery) {
        if (!url || url.trim() === "") continue;
        
        const existingMedia = await prisma.propertyMedia.findFirst({
          where: { propertyId: property.id, url }
        });
        
        if (!existingMedia) {
          await prisma.propertyMedia.create({
            data: {
              propertyId: property.id,
              storageKey: url,
              url,
              mimeType: "image/jpeg",
              size: 0,
              isCover: false,
              order: order++
            }
          });
          console.log(`Migrated gallery image for ${property.id}`);
        }
      }
    }
  }
  
  console.log("Media migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
