import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | PrismaClient
}

let prismaInstance: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaInstance
}

// ─── Self-Healing Auto-Reconnect Proxy ───────────────────────────────────────
// Intercepts Prisma engine Rust panics ("timer has gone away", code 101) caused
// by Hostinger/Linux process idling, automatically resets the query engine,
// and transparently retries the query without throwing a 500 error to the user.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, propKey, receiver) {
    const originalValue = Reflect.get(prismaInstance, propKey, receiver)

    if (typeof originalValue === 'function') {
      return function (...args: any[]) {
        return originalValue.apply(prismaInstance, args)
      }
    }

    if (originalValue && typeof originalValue === 'object') {
      return new Proxy(originalValue, {
        get(modelTarget, actionKey) {
          const actionFn = Reflect.get(modelTarget, actionKey)
          if (typeof actionFn !== 'function') return actionFn

          return async function (...args: any[]) {
            try {
              return await actionFn.apply(modelTarget, args)
            } catch (err: any) {
              const errStr = String(err?.message || err)
              if (
                errStr.includes('timer has gone away') ||
                errStr.includes('code 101') ||
                errStr.includes('PrismaClientRustPanicError') ||
                errStr.includes('Query engine exited')
              ) {
                console.error('⚠️ Prisma Engine Panicked. Auto-healing Prisma Client...', errStr)
                try {
                  await prismaInstance.$disconnect()
                } catch (_) {}
                prismaInstance = createPrismaClient()
                if (process.env.NODE_ENV !== 'production') {
                  globalThis.prismaGlobal = prismaInstance
                }
                // Transparently retry query once with fresh PrismaClient instance
                const freshModel = (prismaInstance as any)[propKey]
                if (freshModel && typeof freshModel[actionKey] === 'function') {
                  return await freshModel[actionKey].apply(freshModel, args)
                }
              }
              throw err
            }
          }
        },
      })
    }

    return originalValue
  },
})
