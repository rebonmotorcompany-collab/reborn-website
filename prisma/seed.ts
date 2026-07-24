import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── Sample Dealer Data ────────────────────────────────────────────────────────
const sampleDealers = [
  {
    name:           'RMC Karachi South — Clifton',
    dealerCode:     'RMC-KHI-001',
    businessName:   'Ali Motors & Sons',
    dealerType:     'AUTHORIZED' as const,
    status:         'ACTIVE'     as const,
    contactPerson:  'Muhammad Ali Shah',
    designation:    'Showroom Manager',
    phone:          '+92 21 35893041',
    whatsapp:       '+92 321 2000001',
    landline:       '021-35893041',
    email:          'khi.south@rebonmotor.com',
    address:        'Plot 14-C, Main Khayaban-e-Ittehad, Phase 2, DHA',
    city:           'Karachi',
    district:       'Karachi South',
    province:       'Sindh',
    country:        'Pakistan',
    postalCode:     '75500',
    googleMapsUrl:  'https://maps.google.com/?q=DHA+Phase+2+Karachi',
    registrationNo: 'SECP-KHI-2021-0451',
    taxNo:          'NTN-1234567-8',
    yearsInBusiness: 5,
    products:       ['ELECTRIC_BIKES', 'PETROL_BIKES', 'SPARE_PARTS', 'ACCESSORIES'],
    services:       ['SALES', 'SERVICE', 'WARRANTY', 'MAINTENANCE', 'TEST_RIDE'],
    openingTime:    '09:00',
    closingTime:    '20:00',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    facebook:       'https://facebook.com/rmc.karachi',
    instagram:      'https://instagram.com/rmc.karachi',
    website:        'https://rebonmotor.com',
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    'Flagship showroom in Karachi. Test rides available on weekends.',
  },
  {
    name:           'RMC Lahore Flagship — Gulberg III',
    dealerCode:     'RMC-LHR-001',
    businessName:   'Gulberg Rebon Center',
    dealerType:     'AUTHORIZED' as const,
    status:         'ACTIVE'     as const,
    contactPerson:  'Kamran Hussain',
    designation:    'Branch Director',
    phone:          '+92 42 35781290',
    whatsapp:       '+92 300 4000001',
    landline:       '042-35781290',
    email:          'lhr.gulberg@rebonmotor.com',
    address:        '88-D/1, Main Boulevard Gulberg III',
    city:           'Lahore',
    district:       'Lahore',
    province:       'Punjab',
    country:        'Pakistan',
    postalCode:     '54660',
    googleMapsUrl:  'https://maps.google.com/?q=Gulberg+III+Lahore',
    registrationNo: 'SECP-LHR-2020-0312',
    taxNo:          'NTN-2345678-9',
    yearsInBusiness: 6,
    products:       ['ELECTRIC_BIKES', 'PETROL_BIKES', 'ACCESSORIES', 'BATTERIES', 'CHARGERS'],
    services:       ['SALES', 'SERVICE', 'WARRANTY', 'MAINTENANCE', 'SPARE_PARTS', 'TEST_RIDE'],
    openingTime:    '09:00',
    closingTime:    '21:00',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    facebook:       'https://facebook.com/rmc.lahore',
    instagram:      'https://instagram.com/rmc.lahore',
    website:        'https://rebonmotor.com',
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    'Largest showroom in Lahore. Full EV charging station on-site.',
  },
  {
    name:           'RMC Islamabad Elite Center',
    dealerCode:     'RMC-ISB-001',
    businessName:   'Capital Motors Pvt. Ltd.',
    dealerType:     'FRANCHISE'  as const,
    status:         'ACTIVE'     as const,
    contactPerson:  'Sana Butt',
    designation:    'Operations Head',
    phone:          '+92 51 2289450',
    whatsapp:       '+92 333 5000001',
    landline:       '051-2289450',
    email:          'isb.markaz@rebonmotor.com',
    address:        'Showroom #4, G-11 Markaz',
    city:           'Islamabad',
    district:       'Islamabad',
    province:       'Islamabad Capital Territory',
    country:        'Pakistan',
    postalCode:     '44000',
    googleMapsUrl:  'https://maps.google.com/?q=G11+Markaz+Islamabad',
    registrationNo: 'SECP-ISB-2022-0198',
    taxNo:          'NTN-3456789-0',
    yearsInBusiness: 4,
    products:       ['ELECTRIC_BIKES', 'PETROL_BIKES', 'SPARE_PARTS'],
    services:       ['SALES', 'WARRANTY', 'TEST_RIDE'],
    openingTime:    '10:00',
    closingTime:    '19:00',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    facebook:       null as string | null,
    instagram:      'https://instagram.com/rmc.islamabad',
    website:        'https://rebonmotor.com',
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    'Special corporate fleet discounts available.',
  },
  {
    name:           'RMC Peshawar Ring Road Hub',
    dealerCode:     'RMC-PES-001',
    businessName:   'KPK Rebon Motors',
    dealerType:     'DISTRIBUTOR' as const,
    status:         'ACTIVE'      as const,
    contactPerson:  'Tariq Khan',
    designation:    'Dealer Principal',
    phone:          '+92 91 5823120',
    whatsapp:       '+92 345 9100001',
    landline:       '091-5823120',
    email:          'pesh@rebonmotor.com',
    address:        'Main Ring Road near Hayatabad Flyover',
    city:           'Peshawar',
    district:       'Peshawar',
    province:       'Khyber Pakhtunkhwa',
    country:        'Pakistan',
    postalCode:     '25000',
    googleMapsUrl:  'https://maps.google.com/?q=Hayatabad+Peshawar',
    registrationNo: 'SECP-KPK-2021-0079',
    taxNo:          'NTN-4567890-1',
    yearsInBusiness: 3,
    products:       ['PETROL_BIKES', 'SPARE_PARTS', 'ACCESSORIES'],
    services:       ['SALES', 'SERVICE', 'MAINTENANCE'],
    openingTime:    '09:30',
    closingTime:    '18:30',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    facebook:       null as string | null,
    instagram:      null as string | null,
    website:        null as string | null,
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    null as string | null,
  },
  {
    name:           'RMC Multan Smart Center',
    dealerCode:     'RMC-MUL-001',
    businessName:   'Multan Motoway Pvt. Ltd.',
    dealerType:     'AUTHORIZED'  as const,
    status:         'ACTIVE'      as const,
    contactPerson:  'Ahsan Raza',
    designation:    'Sales Director',
    phone:          '+92 61 4589021',
    whatsapp:       '+92 301 6100001',
    landline:       '061-4589021',
    email:          'multan@rebonmotor.com',
    address:        'Bosan Road near Gulgasht Colony',
    city:           'Multan',
    district:       'Multan',
    province:       'Punjab',
    country:        'Pakistan',
    postalCode:     '60000',
    googleMapsUrl:  'https://maps.google.com/?q=Bosan+Road+Multan',
    registrationNo: 'SECP-MUL-2022-0341',
    taxNo:          'NTN-5678901-2',
    yearsInBusiness: 4,
    products:       ['ELECTRIC_BIKES', 'PETROL_BIKES', 'BATTERIES', 'CHARGERS'],
    services:       ['SALES', 'WARRANTY', 'MAINTENANCE', 'TEST_RIDE'],
    openingTime:    '09:00',
    closingTime:    '20:00',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    facebook:       'https://facebook.com/rmc.multan',
    instagram:      null as string | null,
    website:        null as string | null,
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    'Home delivery available within Multan city.',
  },
  {
    name:           'RMC Quetta City Dealership',
    dealerCode:     'RMC-QTA-001',
    businessName:   'Balochistan Rebon Motors',
    dealerType:     'RETAIL'     as const,
    status:         'ACTIVE'     as const,
    contactPerson:  'Javaid Mengal',
    designation:    'Owner',
    phone:          '+92 81 2831201',
    whatsapp:       '+92 322 8100001',
    landline:       '081-2831201',
    email:          'quetta@rebonmotor.com',
    address:        'Opposite Serena Hotel, Jinnah Road',
    city:           'Quetta',
    district:       'Quetta',
    province:       'Balochistan',
    country:        'Pakistan',
    postalCode:     '87300',
    googleMapsUrl:  'https://maps.google.com/?q=Jinnah+Road+Quetta',
    registrationNo: 'SECP-BLO-2023-0012',
    taxNo:          'NTN-6789012-3',
    yearsInBusiness: 2,
    products:       ['PETROL_BIKES', 'SPARE_PARTS'],
    services:       ['SALES', 'SERVICE'],
    openingTime:    '10:00',
    closingTime:    '18:00',
    workingDays:    ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    facebook:       null as string | null,
    instagram:      null as string | null,
    website:        null as string | null,
    logo:           null as string | null,
    coverImage:     null as string | null,
    isActive:       true,
    publicNotes:    null as string | null,
  },
]

// ─── Grouped Permissions to Seed ───────────────────────────────────────────────
const PERMISSIONS_TO_SEED = [
  { name: 'dashboard.view', label: 'View Dashboard', group: 'dashboard' },
  { name: 'users.view', label: 'View Users', group: 'users' },
  { name: 'users.create', label: 'Create Users', group: 'users' },
  { name: 'users.edit', label: 'Edit Users', group: 'users' },
  { name: 'users.delete', label: 'Delete Users', group: 'users' },
  { name: 'users.assign_roles', label: 'Assign Roles', group: 'users' },
  { name: 'users.reset_password', label: 'Reset Passwords', group: 'users' },
  { name: 'users.lock', label: 'Lock/Unlock Accounts', group: 'users' },
  { name: 'users.bulk_action', label: 'Bulk Action Users', group: 'users' },

  { name: 'roles.view', label: 'View Roles', group: 'roles' },
  { name: 'roles.create', label: 'Create Roles', group: 'roles' },
  { name: 'roles.edit', label: 'Edit Roles', group: 'roles' },
  { name: 'roles.delete', label: 'Delete Roles', group: 'roles' },
  { name: 'roles.assign_permissions', label: 'Assign Role Permissions', group: 'roles' },

  { name: 'companies.view', label: 'View Companies', group: 'companies' },
  { name: 'companies.create', label: 'Create Companies', group: 'companies' },
  { name: 'companies.edit', label: 'Edit Companies', group: 'companies' },
  { name: 'companies.delete', label: 'Delete Companies', group: 'companies' },

  { name: 'dealers.view', label: 'View Dealers', group: 'dealers' },
  { name: 'dealers.create', label: 'Create Dealers', group: 'dealers' },
  { name: 'dealers.edit', label: 'Edit Dealers', group: 'dealers' },
  { name: 'dealers.delete', label: 'Delete Dealers', group: 'dealers' },

  { name: 'cms.view', label: 'View CMS', group: 'cms' },
  { name: 'cms.edit', label: 'Edit CMS', group: 'cms' },

  { name: 'products.view', label: 'View Products', group: 'products' },
  { name: 'products.create', label: 'Create Products', group: 'products' },
  { name: 'products.edit', label: 'Edit Products', group: 'products' },
  { name: 'products.delete', label: 'Delete Products', group: 'products' },

  { name: 'media.view', label: 'View Media', group: 'media' },
  { name: 'media.upload', label: 'Upload Media', group: 'media' },
  { name: 'media.edit', label: 'Edit Media', group: 'media' },
  { name: 'media.delete', label: 'Delete Media', group: 'media' },
  { name: 'media.download', label: 'Download Media', group: 'media' },
  { name: 'media.folders', label: 'Manage Media Folders', group: 'media' },

  { name: 'settings.view', label: 'View Settings', group: 'settings' },
  { name: 'settings.edit', label: 'Edit Settings', group: 'settings' },

  { name: 'activity_logs.view', label: 'View Activity Logs', group: 'activity_logs' },
  { name: 'reports.view', label: 'View Reports', group: 'reports' },
  { name: 'reports.export', label: 'Export Reports', group: 'reports' },

  { name: 'orders.view', label: 'View Orders', group: 'orders' },
  { name: 'orders.create', label: 'Create Orders', group: 'orders' },
  { name: 'orders.edit', label: 'Edit Orders', group: 'orders' },
  { name: 'orders.delete', label: 'Delete Orders', group: 'orders' },

  { name: 'customers.view', label: 'View Customers', group: 'customers' },
  { name: 'customers.create', label: 'Create Customers', group: 'customers' },
  { name: 'customers.edit', label: 'Edit Customers', group: 'customers' },
  { name: 'customers.delete', label: 'Delete Customers', group: 'customers' },

  { name: 'about.view', label: 'View About Us', group: 'about' },
  { name: 'about.edit', label: 'Edit About Us', group: 'about' },

  { name: 'team.view', label: 'View Team Members', group: 'team' },
  { name: 'team.create', label: 'Create Team Members', group: 'team' },
  { name: 'team.edit', label: 'Edit Team Members', group: 'team' },
  { name: 'team.delete', label: 'Delete Team Members', group: 'team' },

  { name: 'careers.view', label: 'View Careers', group: 'careers' },
  { name: 'careers.create', label: 'Create Careers', group: 'careers' },
  { name: 'careers.edit', label: 'Edit Careers', group: 'careers' },
  { name: 'careers.delete', label: 'Delete Careers', group: 'careers' },
]

// ─── Default Roles ─────────────────────────────────────────────────────────────
const ROLES_TO_SEED = [
  { name: 'Super Admin',      slug: 'super-admin',      color: '#DC2626', priority: 100, description: 'Has total control over the entire system.' },
  { name: 'Admin',            slug: 'admin',            color: '#E11D48', priority: 90,  description: 'Can manage most modules except system settings.' },
  { name: 'Manager',          slug: 'manager',          color: '#2563EB', priority: 80,  description: 'Can review content, products and standard settings.' },
  { name: 'Sales Manager',     slug: 'sales-manager',     color: '#F59E0B', priority: 70,  description: 'Can view/edit products, orders and customer records.' },
  { name: 'Dealer Manager',    slug: 'dealer-manager',    color: '#10B981', priority: 70,  description: 'Can manage dealer records and location profiles.' },
  { name: 'Marketing',        slug: 'marketing',        color: '#EC4899', priority: 60,  description: 'Can manage CMS pages, posts and blogs.' },
  { name: 'Customer Support', slug: 'customer-support', color: '#06B6D4', priority: 60,  description: 'Can view products, dealers and submit customer tickets.' },
  { name: 'Content Editor',   slug: 'content-editor',   color: '#8B5CF6', priority: 50,  description: 'Can draft products and edit CMS sections.' },
  { name: 'Finance',          slug: 'finance',          color: '#111827', priority: 50,  description: 'Can review finance reports and orders.' },
  { name: 'Viewer',           slug: 'viewer',           color: '#6B7280', priority: 10,  description: 'Read-only view of products, dealers, and content.' },
]

// ─── Role Permission Map ────────────────────────────────────────────────────────
const rolePermissionsMap: Record<string, string[]> = {
  'super-admin': [], // super admin bypasses
  'admin': [
    'dashboard.view',
    'users.view', 'users.create', 'users.edit', 'users.assign_roles', 'users.reset_password', 'users.lock', 'users.bulk_action',
    'roles.view', 'roles.assign_permissions',
    'companies.view', 'companies.create', 'companies.edit',
    'dealers.view', 'dealers.create', 'dealers.edit', 'dealers.delete',
    'cms.view', 'cms.edit',
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'media.view', 'media.upload', 'media.edit', 'media.delete', 'media.download', 'media.folders',
    'settings.view',
    'activity_logs.view',
    'about.view', 'about.edit',
    'team.view', 'team.create', 'team.edit', 'team.delete',
    'careers.view', 'careers.create', 'careers.edit', 'careers.delete',
  ],
  'manager': [
    'dashboard.view',
    'users.view',
    'dealers.view',
    'products.view', 'products.create', 'products.edit',
    'cms.view',
    'media.view', 'media.upload', 'media.edit', 'media.download', 'media.folders',
  ],
  'sales-manager': [
    'dashboard.view',
    'products.view',
    'orders.view', 'orders.create', 'orders.edit',
    'customers.view', 'customers.create', 'customers.edit',
  ],
  'dealer-manager': [
    'dashboard.view',
    'dealers.view', 'dealers.create', 'dealers.edit',
    'products.view',
    'media.view', 'media.upload', 'media.edit', 'media.download', 'media.folders',
  ],
  'marketing': [
    'dashboard.view',
    'cms.view', 'cms.edit',
    'products.view', 'products.edit',
    'media.view', 'media.upload', 'media.edit', 'media.download',
  ],
  'customer-support': [
    'dashboard.view',
    'dealers.view',
    'products.view',
    'cms.view',
    'media.view',
    'customers.view', 'customers.create', 'customers.edit',
  ],
  'content-editor': [
    'dashboard.view',
    'products.view', 'products.create', 'products.edit',
    'cms.view', 'cms.edit',
    'media.view', 'media.upload', 'media.edit', 'media.download',
  ],
  'finance': [
    'dashboard.view',
    'products.view',
    'orders.view',
    'reports.view', 'reports.export',
  ],
  'viewer': [
    'dashboard.view',
    'dealers.view',
    'products.view',
    'cms.view',
    'media.view',
  ]
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding the database...')

  // 1. Seed Permissions
  console.log('🔑 Seeding permissions...')
  const dbPermissions: Record<string, any> = {}
  for (const perm of PERMISSIONS_TO_SEED) {
    const dbPerm = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { label: perm.label, group: perm.group },
      create: { name: perm.name, label: perm.label, group: perm.group },
    })
    dbPermissions[perm.name] = dbPerm
  }

  // 2. Seed Roles
  console.log('🛡️ Seeding roles...')
  const dbRoles: Record<string, any> = {}
  for (const r of ROLES_TO_SEED) {
    const dbRole = await prisma.role.upsert({
      where: { slug: r.slug },
      update: { name: r.name, color: r.color, priority: r.priority, description: r.description },
      create: { name: r.name, slug: r.slug, color: r.color, priority: r.priority, description: r.description, isSystem: r.slug === 'super-admin' },
    })
    dbRoles[r.slug] = dbRole
  }

  // 3. Setup Role-Permission Linkage
  console.log('🔗 Linking permissions to roles...')
  for (const [roleSlug, permissions] of Object.entries(rolePermissionsMap)) {
    const role = dbRoles[roleSlug]
    if (!role) continue

    // For non-super-admins, link specific permissions
    if (roleSlug !== 'super-admin') {
      for (const permName of permissions) {
        const perm = dbPermissions[permName]
        if (!perm) continue

        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        })
      }
    } else {
      // Super admin gets all linked in DB as well
      for (const perm of Object.values(dbPermissions)) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        })
      }
    }
  }

  // 4. Create default users for each role (except super admin which uses existing or default)
  console.log('👥 Seeding default users...')
  const adminEmail    = process.env.DEFAULT_ADMIN_EMAIL    || 'admin@rebonmotorcompany.com.pk'
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@RMC2026!'
  
  let superAdminUser = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!superAdminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    superAdminUser = await prisma.user.create({
      data: {
        name: 'Super Admin',
        username: 'superadmin',
        email: adminEmail,
        password: hashedPassword,
        status: 'ACTIVE',
        isSystemAdmin: true,
        forcePasswordChange: false,
      },
    })
  }

  // Ensure Super Admin has super-admin role
  const superAdminRole = dbRoles['super-admin']
  if (superAdminUser && superAdminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: superAdminUser.id, roleId: superAdminRole.id } },
      update: {},
      create: { userId: superAdminUser.id, roleId: superAdminRole.id },
    })
  }

  // Create a sample Admin and Sales Manager to populate listing
  const sampleUsers = [
    { name: 'Admin Manager', username: 'adminmanager', email: 'admin.mgr@rebonmotor.com', role: 'admin', dept: 'IT & Security', desg: 'IT Administrator' },
    { name: 'Sales Head', username: 'saleshead', email: 'sales@rebonmotor.com', role: 'sales-manager', dept: 'Commercial Sales', desg: 'Commercial Sales Lead' },
    { name: 'Zahid Khan', username: 'zahidk', email: 'zahid.support@rebonmotor.com', role: 'customer-support', dept: 'Support Operations', desg: 'Customer Care Executive' },
  ]

  for (const s of sampleUsers) {
    let u = await prisma.user.findUnique({ where: { email: s.email } })
    if (!u) {
      const hashedPassword = await bcrypt.hash('RebonUser2026!', 10)
      u = await prisma.user.create({
        data: {
          name: s.name,
          username: s.username,
          email: s.email,
          password: hashedPassword,
          status: 'ACTIVE',
          department: s.dept,
          designation: s.desg,
          timezone: 'Asia/Karachi',
          language: 'en',
        }
      })
    }

    const role = dbRoles[s.role]
    if (u && role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: u.id, roleId: role.id } },
        update: {},
        create: { userId: u.id, roleId: role.id },
      })
    }
  }

  // 5. Sample Dealers
  console.log('🏪 Seeding sample dealers...')
  for (const dealer of sampleDealers) {
    const existing = await prisma.dealer.findUnique({ where: { dealerCode: dealer.dealerCode } })
    if (existing) {
      console.log(`  ↩  Dealer "${dealer.name}" already exists, skipping.`)
      continue
    }

    const slug         = dealer.dealerCode.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const existingSlug = await prisma.dealer.findUnique({ where: { slug } })
    const finalSlug    = existingSlug ? `${slug}-${Date.now()}` : slug

    await prisma.dealer.create({
      data: {
        ...dealer,
        slug: finalSlug,
        galleryImages:  [],
        documents:      [],
        internalNotes:  null,
      },
    })
    console.log(`  ✅ Created: ${dealer.name}`)
  }

  // 6. Settings
  console.log('⚙️ Seeding settings...')
  const defaultSettings = [
    // General
    { key: 'site_name', value: 'Rebon Motor Company', group: 'general', label: 'Site Name' },
    { key: 'site_description', value: "Rebon Motor Company (RMC) is Pakistan's pioneering automotive company, crafting next-generation, high-performance electric and fuel-efficient petrol motorcycles.", group: 'general', label: 'SEO Description' },
    { key: 'company_tagline', value: 'Engineering the Future of Mobility', group: 'general', label: 'Company Tagline' },
    { key: 'company_description', value: "Rebon Motor Company (RMC) is Pakistan's premier manufacturer of advanced electric and petrol vehicles. Discover our flagship E-Volt X and smart mobility solutions.", group: 'general', label: 'Company Description' },
    { key: 'contact_email', value: 'info@rebonmotor.com', group: 'general', label: 'Contact Email' },
    { key: 'support_email', value: 'support@rebonmotor.com', group: 'general', label: 'Support Email' },
    { key: 'sales_email', value: 'sales@rebonmotor.com', group: 'general', label: 'Sales Email' },
    { key: 'contact_phone', value: '+92 (42) 111-732-661', group: 'general', label: 'Contact Phone' },
    { key: 'whatsapp_number', value: '+92 300 1234567', group: 'general', label: 'WhatsApp Number' },
    { key: 'website_url', value: 'https://rebonmotor.com', group: 'general', label: 'Website URL' },

    // Contact
    { key: 'office_address', value: '88-D/1, Main Boulevard Gulberg III, Lahore, Punjab, Pakistan', group: 'contact', label: 'Office Address' },
    { key: 'office_city', value: 'Lahore', group: 'contact', label: 'City' },
    { key: 'office_province', value: 'Punjab', group: 'contact', label: 'Province' },
    { key: 'office_country', value: 'Pakistan', group: 'contact', label: 'Country' },
    { key: 'office_postal_code', value: '54000', group: 'contact', label: 'Postal Code' },
    { key: 'google_maps_url', value: 'https://maps.google.com/?q=88-D/1+Gulberg+III+Lahore', group: 'contact', label: 'Google Maps URL' },
    { key: 'office_latitude', value: '31.5085', group: 'contact', label: 'Latitude' },
    { key: 'office_longitude', value: '74.3496', group: 'contact', label: 'Longitude' },

    // Socials
    { key: 'social_facebook', value: 'https://facebook.com/rebonmotor', group: 'social', label: 'Facebook' },
    { key: 'social_facebook_enabled', value: 'true', group: 'social', label: 'Facebook Enabled' },
    { key: 'social_instagram', value: 'https://instagram.com/rebonmotor', group: 'social', label: 'Instagram' },
    { key: 'social_instagram_enabled', value: 'true', group: 'social', label: 'Instagram Enabled' },
    { key: 'social_linkedin', value: 'https://linkedin.com/company/rebonmotor', group: 'social', label: 'LinkedIn' },
    { key: 'social_linkedin_enabled', value: 'true', group: 'social', label: 'LinkedIn Enabled' },
    { key: 'social_youtube', value: 'https://youtube.com/c/rebonmotor', group: 'social', label: 'YouTube' },
    { key: 'social_youtube_enabled', value: 'true', group: 'social', label: 'YouTube Enabled' },
    { key: 'social_tiktok', value: 'https://tiktok.com/@rebonmotor', group: 'social', label: 'TikTok' },
    { key: 'social_tiktok_enabled', value: 'true', group: 'social', label: 'TikTok Enabled' },
    { key: 'social_twitter', value: 'https://twitter.com/rebonmotor', group: 'social', label: 'Twitter' },
    { key: 'social_twitter_enabled', value: 'true', group: 'social', label: 'Twitter Enabled' },
    { key: 'social_threads', value: 'https://threads.net/@rebonmotor', group: 'social', label: 'Threads' },
    { key: 'social_threads_enabled', value: 'false', group: 'social', label: 'Threads Enabled' },
    { key: 'social_pinterest', value: 'https://pinterest.com/rebonmotor', group: 'social', label: 'Pinterest' },
    { key: 'social_pinterest_enabled', value: 'false', group: 'social', label: 'Pinterest Enabled' },

    // Hours
    { key: 'hours_monday_open', value: '09:00', group: 'hours', label: 'Monday Open' },
    { key: 'hours_monday_close', value: '18:00', group: 'hours', label: 'Monday Close' },
    { key: 'hours_monday_status', value: 'open', group: 'hours', label: 'Monday Status' },
    { key: 'hours_tuesday_open', value: '09:00', group: 'hours', label: 'Tuesday Open' },
    { key: 'hours_tuesday_close', value: '18:00', group: 'hours', label: 'Tuesday Close' },
    { key: 'hours_tuesday_status', value: 'open', group: 'hours', label: 'Tuesday Status' },
    { key: 'hours_wednesday_open', value: '09:00', group: 'hours', label: 'Wednesday Open' },
    { key: 'hours_wednesday_close', value: '18:00', group: 'hours', label: 'Wednesday Close' },
    { key: 'hours_wednesday_status', value: 'open', group: 'hours', label: 'Wednesday Status' },
    { key: 'hours_thursday_open', value: '09:00', group: 'hours', label: 'Thursday Open' },
    { key: 'hours_thursday_close', value: '18:00', group: 'hours', label: 'Thursday Close' },
    { key: 'hours_thursday_status', value: 'open', group: 'hours', label: 'Thursday Status' },
    { key: 'hours_friday_open', value: '09:00', group: 'hours', label: 'Friday Open' },
    { key: 'hours_friday_close', value: '18:00', group: 'hours', label: 'Friday Close' },
    { key: 'hours_friday_status', value: 'open', group: 'hours', label: 'Friday Status' },
    { key: 'hours_saturday_open', value: '09:00', group: 'hours', label: 'Saturday Open' },
    { key: 'hours_saturday_close', value: '18:00', group: 'hours', label: 'Saturday Close' },
    { key: 'hours_saturday_status', value: 'open', group: 'hours', label: 'Saturday Status' },
    { key: 'hours_sunday_open', value: '00:00', group: 'hours', label: 'Sunday Open' },
    { key: 'hours_sunday_close', value: '00:00', group: 'hours', label: 'Sunday Close' },
    { key: 'hours_sunday_status', value: 'closed', group: 'hours', label: 'Sunday Status' },

    // Footer
    { key: 'footer_description', value: "Rebon Motor Company (RMC) is Pakistan's pioneering automotive company, crafting next-generation, high-performance electric and fuel-efficient petrol motorcycles designed indigenously with global engineering standards.", group: 'footer', label: 'Footer Description' },
    { key: 'copyright_text', value: 'Rebon Motor Company (RMC) Pakistan. All Rights Reserved.', group: 'footer', label: 'Copyright Text' },
    { key: 'footer_logo', value: '', group: 'footer', label: 'Footer Logo' },

    // Branding
    { key: 'logo_primary', value: '', group: 'branding', label: 'Primary Logo' },
    { key: 'logo_secondary', value: '', group: 'branding', label: 'Secondary Logo' },
    { key: 'logo_white', value: '', group: 'branding', label: 'White Logo' },
    { key: 'logo_dark', value: '', group: 'branding', label: 'Dark Logo' },
    { key: 'logo_mobile', value: '', group: 'branding', label: 'Mobile Logo' },
    { key: 'logo_loading', value: '', group: 'branding', label: 'Loading Logo' },
    { key: 'favicon', value: '', group: 'branding', label: 'Favicon' },
    { key: 'app_icon', value: '', group: 'branding', label: 'App Icon' },

    // SEO
    { key: 'seo_meta_title', value: 'Rebon Motor Company (RMC) | Powering the Future of Mobility', group: 'seo', label: 'Default Meta Title' },
    { key: 'seo_meta_description', value: "Rebon Motor Company (RMC) is Pakistan's premier manufacturer of advanced electric and petrol vehicles. Discover our flagship E-Volt X and smart mobility solutions.", group: 'seo', label: 'Default Meta Description' },
    { key: 'seo_keywords', value: 'rebon motor company, rmc pakistan, electric motorcycle pakistan, e-volt x, petrol bike pakistan', group: 'seo', label: 'SEO Keywords' },
    { key: 'seo_og_image', value: '', group: 'seo', label: 'Open Graph Image' },
    { key: 'seo_twitter_image', value: '', group: 'seo', label: 'Twitter Card Image' },
    { key: 'seo_robots', value: 'index, follow', group: 'seo', label: 'Robots Rules' },
    { key: 'seo_canonical_url', value: 'https://rebonmotor.com', group: 'seo', label: 'Canonical URL' },
    { key: 'seo_schema', value: '', group: 'seo', label: 'Schema markup' },

    // SMTP Email
    { key: 'smtp_host', value: 'smtp.mailtrap.io', group: 'email', label: 'SMTP Host' },
    { key: 'smtp_port', value: '2525', group: 'email', label: 'SMTP Port' },
    { key: 'smtp_username', value: '', group: 'email', label: 'SMTP Username' },
    { key: 'smtp_password', value: '', group: 'email', label: 'SMTP Password' },
    { key: 'smtp_sender_email', value: 'noreply@rebonmotor.com', group: 'email', label: 'Sender Email' },
    { key: 'smtp_sender_name', value: 'Rebon Motor Company', group: 'email', label: 'Sender Name' },

    // Analytics
    { key: 'analytics_google', value: '', group: 'analytics', label: 'Google Analytics' },
    { key: 'analytics_gtm', value: '', group: 'analytics', label: 'Google Tag Manager' },
    { key: 'analytics_pixel', value: '', group: 'analytics', label: 'Meta Pixel' },
    { key: 'analytics_clarity', value: '', group: 'analytics', label: 'Microsoft Clarity' },

    // Others
    { key: 'setting_currency', value: 'PKR', group: 'others', label: 'Default Currency' },
    { key: 'setting_timezone', value: 'Asia/Karachi', group: 'others', label: 'Timezone' },
    { key: 'setting_language', value: 'en', group: 'others', label: 'Default Language' },
    { key: 'setting_date_format', value: 'DD-MM-YYYY', group: 'others', label: 'Date Format' },
    { key: 'setting_time_format', value: '12-hour', group: 'others', label: 'Time Format' },
  ]

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: {
        key: s.key,
        value: s.value,
        group: s.group,
        label: s.label,
        type: s.key.endsWith('_enabled') ? 'boolean' : 'text'
      }
    })
  }

  console.log('\n✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
