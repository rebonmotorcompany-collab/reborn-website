import { auth } from './auth';
import { prisma } from './db';
import { PermissionKey } from '@/constants/permissions';

export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      },
      userPermissions: {
        include: {
          permission: true
        }
      }
    }
  });

  if (!user) return [];

  // Super admins have all permissions implicitly
  const isSuperAdmin = user.userRoles.some(ur => ur.role.slug === 'super-admin');
  if (isSuperAdmin) {
    const allPerms = await prisma.permission.findMany({ select: { name: true } });
    return allPerms.map(p => p.name);
  }

  // 1. Gather all inherited role permissions
  const rolePermissions = user.userRoles.flatMap(ur =>
    ur.role.rolePermissions.map(rp => rp.permission.name)
  );

  // 2. Map direct overrides
  const allowedDirect = user.userPermissions.filter(up => up.value).map(up => up.permission.name);
  const deniedDirect  = user.userPermissions.filter(up => !up.value).map(up => up.permission.name);

  // Final permission list: role permissions + explicitly allowed - explicitly denied
  const finalPermissions = new Set([...rolePermissions, ...allowedDirect]);
  deniedDirect.forEach(p => finalPermissions.delete(p));

  return Array.from(finalPermissions);
}

export async function hasPermission(permissionKey: PermissionKey): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  // Query database to see direct overrides first
  const directOverride = await prisma.userPermission.findFirst({
    where: {
      userId: session.user.id,
      permission: {
        name: permissionKey
      }
    },
    include: {
      permission: true
    }
  });

  if (directOverride) {
    return directOverride.value; // true = allowed, false = explicitly denied
  }

  // Fallback to checking role-based permissions or super-admin bypass
  const roles = session.user.roles || [];
  if (roles.includes('super-admin')) return true;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user) return false;

  const userPermissions = user.userRoles.flatMap(ur =>
    ur.role.rolePermissions.map(rp => rp.permission.name)
  );

  return userPermissions.includes(permissionKey);
}

export async function requirePermission(permissionKey: PermissionKey) {
  const authorized = await hasPermission(permissionKey);
  if (!authorized) {
    throw new Error('Unauthorized: You do not have permission to perform this action.');
  }
}

