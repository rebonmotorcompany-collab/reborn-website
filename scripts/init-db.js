import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

let dbUrl = process.env.DATABASE_URL || ''
if (dbUrl.includes('@31.97.208.32')) {
  dbUrl = dbUrl.replace('@31.97.208.32', '@127.0.0.1')
}

const adapter = dbUrl ? new PrismaMariaDb(dbUrl) : undefined
const prisma = new PrismaClient(adapter ? { adapter } : {})

async function initDatabase() {
  console.log('🔄 [Hostinger DB Init] Ensuring MySQL tables & initial seed data...')

  try {
    // 1. Ensure AboutSection table exists
    await prisma.$executeRawUnsafe(`
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

    // 2. Ensure VisitingCardTemplate table exists
    await prisma.$executeRawUnsafe(`
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

    // 3. Ensure VisitingCard table exists
    await prisma.$executeRawUnsafe(`
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

    console.log('✅ [Hostinger DB Init] Database structure verified successfully.')
  } catch (err) {
    console.warn('⚠️ [Hostinger DB Init] Table structure check warning (continuing build):', err.message || err)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase().catch(err => {
  console.error('⚠️ DB Init Script error:', err)
})
