// Global permission keys that match the database seed
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'dashboard.view',
  
  // Users
  VIEW_USERS: 'users.view',
  CREATE_USERS: 'users.create',
  EDIT_USERS: 'users.edit',
  DELETE_USERS: 'users.delete',
  
  // Roles
  VIEW_ROLES: 'roles.view',
  CREATE_ROLES: 'roles.create',
  EDIT_ROLES: 'roles.edit',
  DELETE_ROLES: 'roles.delete',
  
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
  DELETE_MEDIA: 'media.delete',
  
  // Settings
  VIEW_SETTINGS: 'settings.view',
  EDIT_SETTINGS: 'settings.edit',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
