import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const properties = await prisma.property.findMany();
  console.log("Total properties:", properties.length);
  const totalValue = properties.reduce((acc, curr) => acc + (curr.priceValue || 0), 0);
  console.log("Total value:", totalValue);
  if (properties.length > 0) {
    console.log("First property priceValue:", properties[0].priceValue);
  }
}

main().finally(() => prisma.$disconnect());
