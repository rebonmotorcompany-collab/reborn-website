import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// In development, store on globalThis to prevent hot-reload from creating multiple instances.
// In production, the module is cached by Node.js naturally — do NOT assign to globalThis
// because if the engine panics and we need a fresh client, the old crashed one must not be reused.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
