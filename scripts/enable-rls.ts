import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Enabling Row Level Security (RLS) on all tables...");
  
  const tables = [
    "Property",
    "PropertyMedia",
    "Lead",
    "AgencySettings",
    "User",
    "SavedProperty",
    "Jet",
    "JetBooking"
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled for table: ${table}`);
    } catch (e) {
      console.error(`❌ Failed to enable RLS for ${table}:`, e);
    }
  }

  console.log("Done! You can now rerun the linter in the Supabase Dashboard.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
