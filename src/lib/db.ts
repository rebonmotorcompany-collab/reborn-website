import { PrismaClient } from '@prisma/client'
import { Pool } from 'mysql2/promise'
import { PrismaMysql } from '@prisma/adapter-mysql'
import mysql from 'mysql2/promise'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  const pool = mysql.createPool(connectionString as string)
  const adapter = new PrismaMysql(pool)

  return new PrismaClient({
    adapter,
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
