import { PrismaClient } from '@prisma/client'
import { PrismaClientOptions } from '@prisma/client/runtime/library'
import { PrismaClient as PrismaClientBase } from '.prisma/client'
import { Pool, createPool } from 'mariadb'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    return new PrismaClient()
  }

  // Load dynamically so that it doesn't break if dependencies are missing during initial build
  const { PrismaClient } = require('@prisma/client')
  const { PrismaClient: PrismaClientBase } = require('.prisma/client')
  const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
  const mariadb = require('mariadb')
  
  const pool = mariadb.createPool(connectionString)
  const adapter = new PrismaMariaDb(pool)
  
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
