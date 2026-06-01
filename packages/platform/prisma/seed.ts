import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.profile.upsert({
    where: { id: 'family' },
    update: {},
    create: { id: 'family', name: 'Family', tier: 1, avatarUrl: null },
  })

  await prisma.profile.upsert({
    where: { id: 'seed-parent-1' },
    update: {},
    create: { id: 'seed-parent-1', name: 'Parent', tier: 4, avatarUrl: null },
  })

  await prisma.profile.upsert({
    where: { id: 'seed-child-1' },
    update: {},
    create: { id: 'seed-child-1', name: 'Child', tier: 1, avatarUrl: null },
  })

  console.log('Seeded: family, seed-parent-1, seed-child-1')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
