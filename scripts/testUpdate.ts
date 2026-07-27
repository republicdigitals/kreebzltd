import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.property.findFirst();
  if (!p) {
    console.log('No properties found');
    return;
  }
  console.log('Found:', p.id);
  const updated = await prisma.property.update({
    where: { id: p.id },
    data: { address: p.address + ' updated' }
  });
  console.log('Updated:', updated.id);
}

main().finally(() => prisma.$disconnect());
