import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function main() {
  const properties = await prisma.property.findMany();
  let count = 0;

  for (const property of properties) {
    if (!property.slug) {
      let baseSlug = generateSlug(property.id);
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure uniqueness
      while (true) {
        const existing = await prisma.property.findFirst({
          where: { slug }
        });
        if (!existing || existing.id === property.id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.property.update({
        where: { id: property.id },
        data: { slug }
      });
      console.log(`Migrated: ${property.id} -> ${slug}`);
      count++;
    }
  }

  console.log(`Successfully generated slugs for ${count} properties.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
