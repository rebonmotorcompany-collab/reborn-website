import { auth } from './auth';
import { prisma } from './db';
import { PermissionKey } from '@/constants/permissions';

export async function hasPermission(permissionKey: PermissionKey): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  // Super Admin bypasses all checks
  if (session.user.roles.includes('super-admin')) return true;

  // Query database to see if any of the user's roles have this permission
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

  // Flatten permissions
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
