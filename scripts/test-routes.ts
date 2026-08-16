
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function testRoute(url: string, expectedStatus: number, name: string) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    if (res.status === expectedStatus || (expectedStatus === 200 && (res.status === 307 || res.status === 308))) {
      let finalStatus = res.status;
      if (res.status === 307 || res.status === 308) {
        const location = res.headers.get('location');
        if (location) {
          const finalRes = await fetch(new URL(location, BASE_URL).toString());
          finalStatus = finalRes.status;
        }
      }
      if (finalStatus === 200) {
        console.log(`✅ PASS: ${name} (${url}) -> ${finalStatus}`);
      } else if (finalStatus === expectedStatus) {
         console.log(`✅ PASS: ${name} (${url}) -> ${finalStatus}`);
      } else {
        console.log(`❌ FAIL: ${name} (${url}) -> Expected ${expectedStatus}, got ${finalStatus}`);
      }
    } else {
      console.log(`❌ FAIL: ${name} (${url}) -> Expected ${expectedStatus}, got ${res.status}`);
    }
  } catch (err) {
    console.log(`❌ ERROR: ${name} (${url}) -> ${err.message}`);
  }
}

async function runTests() {
  console.log("Starting Route Tests...");

  await testRoute(`${BASE_URL}/property/semi-detached-duplex`, 200, "Canonical Slug URL");
  await testRoute(`${BASE_URL}/property/Semi%20%20Detached%20Duplex`, 200, "Legacy Double-Space URL Redirect");
  await testRoute(`${BASE_URL}/property/banana-house-ibj`, 200, "Another Canonical Slug URL");
  await testRoute(`${BASE_URL}/property/does-not-exist`, 404, "Unknown Property URL");

  // Get a draft property
  const draft = await prisma.property.findFirst({ where: { publicationStatus: 'DRAFT' } });
  if (draft && draft.slug) {
    await testRoute(`${BASE_URL}/property/${draft.slug}`, 404, "Draft Property URL");
  }

  console.log("Tests completed.");
}

runTests().finally(() => prisma.$disconnect());
