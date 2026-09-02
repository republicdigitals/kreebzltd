import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
p.jet.findMany().then((j: unknown[]) => {
  console.log("Jets in DB:", j.length);
  if(j.length) console.log(JSON.stringify(j, null, 2));
}).catch((e: unknown) => {
  console.error(e);
}).finally(async () => {
  await p.$disconnect();
});
