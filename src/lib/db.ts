import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    try {
      const adapter = new PrismaMariaDb(dbUrl, {
        connectionLimit: 10,
        connectTimeout: 10000,
        acquireTimeout: 10000,
      })
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch (err) {
      console.warn('⚠️ MariaDB pool adapter initialization warning, using standard client fallback:', err)
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | PrismaClient
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
