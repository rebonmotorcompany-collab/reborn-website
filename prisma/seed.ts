import { PrismaClient, LogAction } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding the database...')

  // ==========================================
  // 1. CLEAR EXISTING DATA (Optional/Development)
  // ==========================================
  // Only uncomment if you want to wipe on every seed
  // await prisma.userRole.deleteMany()
  // await prisma.rolePermission.deleteMany()
  // await prisma.permission.deleteMany()
  // await prisma.role.deleteMany()
  // await prisma.user.deleteMany()
  // await prisma.company.deleteMany()
  // await prisma.dealer.deleteMany()

  // ==========================================
  // 2. CREATE PERMISSIONS
  // ==========================================
  const permissionsList = [
    { name: 'dashboard.view', label: 'View Dashboard', group: 'Dashboard' },
    
    // Users
    { name: 'users.view', label: 'View Users', group: 'Users' },
    { name: 'users.create', label: 'Create Users', group: 'Users' },
    { name: 'users.edit', label: 'Edit Users', group: 'Users' },
    { name: 'users.delete', label: 'Delete Users', group: 'Users' },
    
    // Roles
    { name: 'roles.view', label: 'View Roles', group: 'Roles' },
    { name: 'roles.create', label: 'Create Roles', group: 'Roles' },
    { name: 'roles.edit', label: 'Edit Roles', group: 'Roles' },
    { name: 'roles.delete', label: 'Delete Roles', group: 'Roles' },

    // Companies
    { name: 'companies.view', label: 'View Companies', group: 'Companies' },
    { name: 'companies.create', label: 'Create Companies', group: 'Companies' },
    { name: 'companies.edit', label: 'Edit Companies', group: 'Companies' },
    { name: 'companies.delete', label: 'Delete Companies', group: 'Companies' },

    // Dealers
    { name: 'dealers.view', label: 'View Dealers', group: 'Dealers' },
    { name: 'dealers.create', label: 'Create Dealers', group: 'Dealers' },
    { name: 'dealers.edit', label: 'Edit Dealers', group: 'Dealers' },
    { name: 'dealers.delete', label: 'Delete Dealers', group: 'Dealers' },

    // CMS
    { name: 'cms.view', label: 'View Content', group: 'CMS' },
    { name: 'cms.edit', label: 'Edit Content', group: 'CMS' },

    // Products
    { name: 'products.view', label: 'View Products', group: 'Products' },
    { name: 'products.create', label: 'Create Products', group: 'Products' },
    { name: 'products.edit', label: 'Edit Products', group: 'Products' },
    { name: 'products.delete', label: 'Delete Products', group: 'Products' },

    // Media
    { name: 'media.view', label: 'View Media Library', group: 'Media' },
    { name: 'media.upload', label: 'Upload Media', group: 'Media' },
    { name: 'media.delete', label: 'Delete Media', group: 'Media' },

    // Settings
    { name: 'settings.view', label: 'View Settings', group: 'Settings' },
    { name: 'settings.edit', label: 'Edit Settings', group: 'Settings' },
  ]

  console.log('Creating permissions...')
  const createdPermissions = []
  for (const p of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: { label: p.label, group: p.group },
      create: p,
    })
    createdPermissions.push(perm)
  }

  // ==========================================
  // 3. CREATE ROLES
  // ==========================================
  console.log('Creating roles...')
  
  // Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'super-admin' },
    update: {},
    create: {
      name: 'Super Admin',
      slug: 'super-admin',
      description: 'Full system access',
      isSystem: true,
    },
  })

  // Assign ALL permissions to Super Admin
  for (const p of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    })
  }

  // Admin Role (Exclude some sensitive settings)
  const adminRole = await prisma.role.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      slug: 'admin',
      description: 'System Administrator',
      isSystem: true,
    },
  })

  // Company Admin Role
  const companyRole = await prisma.role.upsert({
    where: { slug: 'company-admin' },
    update: {},
    create: {
      name: 'Company Admin',
      slug: 'company-admin',
      description: 'Manage own company users and data',
      isSystem: true,
    },
  })

  // Dealer Admin Role
  const dealerRole = await prisma.role.upsert({
    where: { slug: 'dealer-admin' },
    update: {},
    create: {
      name: 'Dealer Admin',
      slug: 'dealer-admin',
      description: 'Manage own dealership users and data',
      isSystem: true,
    },
  })

  // Employee Role
  const employeeRole = await prisma.role.upsert({
    where: { slug: 'employee' },
    update: {},
    create: {
      name: 'Employee',
      slug: 'employee',
      description: 'Basic employee access',
      isSystem: true,
    },
  })

  // ==========================================
  // 4. CREATE SUPER ADMIN USER
  // ==========================================
  console.log('Creating Super Admin user...')
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@rebonmotorcompany.com.pk'
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@RMC2026!'
  
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  let superAdmin;

  if (existingSuperAdmin) {
    superAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        isSystemAdmin: true,
      }
    })
    console.log('Super Admin already exists. Updated system flag.')
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    superAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        status: 'ACTIVE',
        isSystemAdmin: true,
        forcePasswordChange: true,
      },
    })
    console.log('Super Admin created.')
  }


  // Assign Role to User
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdmin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id },
  })

  // ==========================================
  // 5. CREATE DEFAULT SITE SETTINGS
  // ==========================================
  console.log('Creating default site settings...')
  const settings = [
    { key: 'site_name', value: 'Rebon Motor Company', type: 'text', group: 'general', label: 'Site Name' },
    { key: 'site_description', value: 'Powering the Future of Mobility', type: 'text', group: 'seo', label: 'SEO Description' },
    { key: 'contact_email', value: 'info@rebonmotorcompany.com.pk', type: 'text', group: 'email', label: 'Contact Email' },
    { key: 'contact_phone', value: '+92 300 1234567', type: 'text', group: 'general', label: 'Contact Phone' },
    { key: 'contact_address', value: 'Lahore, Pakistan', type: 'text', group: 'general', label: 'Physical Address' },
    // Captcha Settings
    { key: 'captcha_enabled', value: 'true', type: 'boolean', group: 'security', label: 'Enable CAPTCHA Globally' },
    { key: 'captcha_login_only', value: 'false', type: 'boolean', group: 'security', label: 'Enable CAPTCHA for Login Only' },
    { key: 'captcha_length', value: '5', type: 'number', group: 'security', label: 'CAPTCHA Length' },
    { key: 'captcha_expiration_minutes', value: '5', type: 'number', group: 'security', label: 'CAPTCHA Expiration (Minutes)' },
    { key: 'captcha_max_retries', value: '5', type: 'number', group: 'security', label: 'Max Failed Attempts Before Lock' },
    { key: 'captcha_case_sensitive', value: 'true', type: 'boolean', group: 'security', label: 'Case Sensitive' },
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }

  // ==========================================
  // 6. CREATE SAMPLE CMS DATA (HOME PAGE)
  // ==========================================
  console.log('Creating default CMS pages...')
  const homePage = await prisma.contentPage.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: 'Home',
      slug: 'home',
      description: 'Homepage content',
      isPublished: true,
    },
  })

  await prisma.contentSection.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'hero' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'hero',
      title: 'POWERING THE FUTURE OF MOBILITY',
      subtitle: 'Experience the perfect blend of performance, efficiency, and innovation with Rebon Motor Company.',
      ctaText: 'Explore Products',
      ctaLink: '/products',
      status: 'PUBLISHED',
      order: 1,
    },
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
