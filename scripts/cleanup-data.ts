import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
  const properties = await prisma.property.findMany();
  for (const p of properties) {
    let changed = false;
    const data: Record<string, string | number> = {};

    // 1. Numeric price: string "price" into numeric "priceValue"
    if (!p.priceValue || p.priceValue === 0) {
      if (p.price) {
        const numeric = parseInt(p.price.replace(/[^0-9]/g, ''));
        if (!isNaN(numeric) && numeric > 0) {
          data.priceValue = numeric;
          changed = true;
        }
      }
    }

    // 2. Photo count: sync with actual media items if they exist
    const media = await prisma.propertyMedia.findMany({ where: { propertyId: p.id }});
    if (media.length > 0 && p.photoCount !== media.length) {
      data.photoCount = media.length;
      changed = true;
    }

    // 3. Cover image cleanup
    if (media.length > 0) {
      const cover = media.find(m => m.isCover) || media[0];
      if (p.image !== cover.url) {
        data.image = cover.url;
        changed = true;
      }
    }

    if (changed) {
      console.log(`Updating ${p.id}...`, data);
      await prisma.property.update({
        where: { id: p.id },
        data
      });
    }
  }
}

clean().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
