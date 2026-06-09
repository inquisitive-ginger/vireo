import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma'

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos',
})
const adapter = new PrismaPg(pool)

export const feedPrisma = new PrismaClient({ adapter })
