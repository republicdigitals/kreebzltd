import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Credentials come from the environment — never hardcode them.
//   ADMIN_EMAIL=you@kreebzltd.com ADMIN_PASSWORD='long-random-secret' node scripts/seed-admin.mjs
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment before running this script.');
  process.exit(1);
}

if (password.length < 16) {
  console.error('ADMIN_PASSWORD must be at least 16 characters.');
  process.exit(1);
}

async function main() {
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user seeded:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
