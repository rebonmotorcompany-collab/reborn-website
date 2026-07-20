import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import UserForm from '@/components/admin/UserForm'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.EDIT_USERS)
  
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: true,
      userPermissions: true
    }
  })

  if (!user) {
    notFound()
  }

  return <UserForm initialData={user} isEditing={true} />
}
