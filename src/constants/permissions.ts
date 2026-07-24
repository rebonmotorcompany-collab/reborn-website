// Global permission keys that match the database seed
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'dashboard.view',
  
  // Users
  VIEW_USERS: 'users.view',
  CREATE_USERS: 'users.create',
  EDIT_USERS: 'users.edit',
  DELETE_USERS: 'users.delete',
  ASSIGN_USER_ROLES: 'users.assign_roles',
  RESET_USER_PASSWORD: 'users.reset_password',
  LOCK_USER: 'users.lock',
  BULK_ACTION_USERS: 'users.bulk_action',
  
  // Roles
  VIEW_ROLES: 'roles.view',
  CREATE_ROLES: 'roles.create',
  EDIT_ROLES: 'roles.edit',
  DELETE_ROLES: 'roles.delete',
  ASSIGN_ROLE_PERMISSIONS: 'roles.assign_permissions',
  
  // Companies
  VIEW_COMPANIES: 'companies.view',
  CREATE_COMPANIES: 'companies.create',
  EDIT_COMPANIES: 'companies.edit',
  DELETE_COMPANIES: 'companies.delete',
  
  // Dealers
  VIEW_DEALERS: 'dealers.view',
  CREATE_DEALERS: 'dealers.create',
  EDIT_DEALERS: 'dealers.edit',
  DELETE_DEALERS: 'dealers.delete',
  
  // CMS
  VIEW_CMS: 'cms.view',
  EDIT_CMS: 'cms.edit',
  
  // Products
  VIEW_PRODUCTS: 'products.view',
  CREATE_PRODUCTS: 'products.create',
  EDIT_PRODUCTS: 'products.edit',
  DELETE_PRODUCTS: 'products.delete',
  
  // Media
  VIEW_MEDIA: 'media.view',
  UPLOAD_MEDIA: 'media.upload',
  EDIT_MEDIA: 'media.edit',
  DELETE_MEDIA: 'media.delete',
  DOWNLOAD_MEDIA: 'media.download',
  MANAGE_FOLDERS: 'media.folders',
  
  // Settings
  VIEW_SETTINGS: 'settings.view',
  EDIT_SETTINGS: 'settings.edit',

  // Activity Logs
  VIEW_ACTIVITY_LOGS: 'activity_logs.view',

  // Reports
  VIEW_REPORTS: 'reports.view',
  EXPORT_REPORTS: 'reports.export',

  // Orders
  VIEW_ORDERS: 'orders.view',
  CREATE_ORDERS: 'orders.create',
  EDIT_ORDERS: 'orders.edit',
  DELETE_ORDERS: 'orders.delete',

  // Customers
  VIEW_CUSTOMERS: 'customers.view',
  CREATE_CUSTOMERS: 'customers.create',
  EDIT_CUSTOMERS: 'customers.edit',
  DELETE_CUSTOMERS: 'customers.delete',

  // Company — About Us
  VIEW_ABOUT: 'about.view',
  EDIT_ABOUT: 'about.edit',

  // Company — Team
  VIEW_TEAM: 'team.view',
  CREATE_TEAM: 'team.create',
  EDIT_TEAM: 'team.edit',
  DELETE_TEAM: 'team.delete',

  // Company — Careers
  VIEW_CAREERS: 'careers.view',
  CREATE_CAREERS: 'careers.create',
  EDIT_CAREERS: 'careers.edit',
  DELETE_CAREERS: 'careers.delete',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

