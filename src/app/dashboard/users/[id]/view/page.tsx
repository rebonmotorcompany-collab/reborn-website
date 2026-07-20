import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import UserProfileView from '@/components/admin/UserProfileView'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function ViewUserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.VIEW_USERS)
  
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: {
          role: true
        }
      },
      userPermissions: {
        include: {
          permission: true
        }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return <UserProfileView user={user} />
}
