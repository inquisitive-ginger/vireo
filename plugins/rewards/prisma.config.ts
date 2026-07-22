import path from 'path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://familyos:familyos@localhost:5432/familyos'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: connectionString,
  },
  migrate: {
    migrationTableSchema: 'rewards',
    async adapter() {
      const { Pool } = await import('pg')
      const pool = new Pool({ connectionString })
      return new PrismaPg(pool)
    },
  },
})
