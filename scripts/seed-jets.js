/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding jets...");
  const jets = [
    {
      tailNumber: "5N-KRB-1",
      name: "Cessna Citation CJ4",
      class: "Light Jet",
      passengers: 7,
      range: "2,000 km",
      baseHourlyRate: 250000000, // 2,500,000 NGN in kobo (Paystack format)
      image: "/images/jets/light.jpg",
      status: "Active"
    },
    {
      tailNumber: "5N-KRB-2",
      name: "Gulfstream G280",
      class: "Midsize Jet",
      passengers: 9,
      range: "4,000 km",
      baseHourlyRate: 450000000, // 4,500,000 NGN in kobo
      image: "/images/jets/midsize.jpg",
      status: "Active"
    },
    {
      tailNumber: "5N-KRB-3",
      name: "Bombardier Global 6000",
      class: "Heavy Jet",
      passengers: 14,
      range: "6,000+ km",
      baseHourlyRate: 850000000, // 8,500,000 NGN in kobo
      image: "/images/jets/heavy.jpg",
      status: "Active"
    }
  ];

  for (const jet of jets) {
    await prisma.jet.upsert({
      where: { tailNumber: jet.tailNumber },
      update: jet,
      create: jet,
    });
  }

  console.log("Seeded jets successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
