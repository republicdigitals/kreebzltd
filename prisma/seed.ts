import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const propertiesPath = path.join(process.cwd(), 'src/data/properties.json')
  const data = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'))

  console.log(`Start seeding...`)
  for (const p of data) {
    const property = await prisma.property.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        slug: p.slug ?? p.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        price: p.price,
        address: p.address,
        neighbourhood: p.neighbourhood,
        city: p.city,
        beds: p.beds,
        baths: p.baths,
        status: p.status,
        type: p.type,
        priceValue: p.priceValue,
        lat: p.lat,
        lng: p.lng,
        imagePlaceholder: p.imagePlaceholder,
        image: p.image,
        photoCount: p.photoCount,
        gallery: p.gallery || [],
        description: p.description,
        rooms: p.rooms || [],
        floorPlans: p.floorPlans || [],
        principal: p.principal || {}
      },
    })
    console.log(`Created property with id: ${property.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
