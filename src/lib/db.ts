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

let tablesEnsured = false

export async function ensureDbTables() {
  if (tablesEnsured) return
  try {
    console.log('📦 Auto-ensuring MySQL database tables...')
    await prismaInstance.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`AboutSection\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`key\` VARCHAR(191) NOT NULL,
        \`data\` JSON NOT NULL,
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`AboutSection_key_key\`(\`key\`),
        INDEX \`AboutSection_key_idx\`(\`key\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
    await prismaInstance.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`VisitingCardTemplate\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`name\` VARCHAR(191) NOT NULL,
        \`templateType\` VARCHAR(191) NOT NULL DEFAULT 'MODERN',
        \`primaryColor\` VARCHAR(191) NOT NULL DEFAULT '#D72626',
        \`secondaryColor\` VARCHAR(191) NOT NULL DEFAULT '#1E1E1E',
        \`backgroundColor\` VARCHAR(191) NOT NULL DEFAULT '#0F0F11',
        \`textColor\` VARCHAR(191) NOT NULL DEFAULT '#FFFFFF',
        \`fontFamily\` VARCHAR(191) NOT NULL DEFAULT 'Inter',
        \`fontSize\` VARCHAR(191) NOT NULL DEFAULT 'medium',
        \`borderRadius\` VARCHAR(191) NOT NULL DEFAULT '16px',
        \`logoPosition\` VARCHAR(191) NOT NULL DEFAULT 'center',
        \`qrPosition\` VARCHAR(191) NOT NULL DEFAULT 'bottom-right',
        \`iconStyle\` VARCHAR(191) NOT NULL DEFAULT 'circle',
        \`isDefault\` TINYINT(1) NOT NULL DEFAULT 0,
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
    await prismaInstance.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`VisitingCard\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`cardName\` VARCHAR(191) NOT NULL,
        \`employeeId\` VARCHAR(191) NULL,
        \`templateId\` VARCHAR(191) NULL,
        \`fullName\` VARCHAR(191) NOT NULL,
        \`designation\` VARCHAR(191) NULL,
        \`department\` VARCHAR(191) NULL,
        \`employeeCode\` VARCHAR(191) NULL,
        \`phone\` VARCHAR(191) NULL,
        \`whatsapp\` VARCHAR(191) NULL,
        \`email\` VARCHAR(191) NULL,
        \`extension\` VARCHAR(191) NULL,
        \`qrCodeType\` VARCHAR(191) NOT NULL DEFAULT 'VCARD',
        \`qrCodeValue\` TEXT NULL,
        \`customQrUrl\` VARCHAR(191) NULL,
        \`profilePhoto\` VARCHAR(191) NULL,
        \`companyName\` VARCHAR(191) NULL,
        \`companyLogo\` VARCHAR(191) NULL,
        \`website\` VARCHAR(191) NULL,
        \`address\` VARCHAR(191) NULL,
        \`frontBgType\` VARCHAR(191) NOT NULL DEFAULT 'POLYGON',
        \`backBgType\` VARCHAR(191) NOT NULL DEFAULT 'LIGHT_POLYGON',
        \`status\` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
        \`createdBy\` VARCHAR(191) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `)
    tablesEnsured = true
    console.log('✅ MySQL database tables ensured.')
  } catch (err) {
    console.warn('⚠️ DB table auto-create warning:', err)
  }
}

// ─── Self-Healing Auto-Reconnect & Auto-Schema Proxy ──────────────────────────
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
              
              // Handle missing database tables in MySQL
              if (errStr.includes('does not exist in the current database')) {
                console.warn(`⚠️ Table missing in MySQL. Auto-creating tables and retrying query...`)
                await ensureDbTables()
                const freshModel = (prismaInstance as any)[propKey]
                if (freshModel && typeof freshModel[actionKey] === 'function') {
                  return await freshModel[actionKey].apply(freshModel, args)
                }
              }

              // Handle Prisma engine Rust panics
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
