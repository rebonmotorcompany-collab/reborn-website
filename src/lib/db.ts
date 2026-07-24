import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

function createPrismaClient() {
  let dbUrl = process.env.DATABASE_URL
  if (dbUrl) {
    // Hostinger local loopback optimization: replace public IP with 127.0.0.1 to avoid firewall timeouts
    if (dbUrl.includes('@31.97.208.32')) {
      dbUrl = dbUrl.replace('@31.97.208.32', '@127.0.0.1')
    }
    try {
      const adapter = new PrismaMariaDb(dbUrl)
      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    } catch (err) {
      console.error('⚠️ MariaDB pool adapter initialization error:', err)
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
