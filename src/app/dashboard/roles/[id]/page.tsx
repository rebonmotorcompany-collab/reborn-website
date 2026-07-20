import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import RoleForm from '@/components/admin/RoleForm'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission(PERMISSIONS.EDIT_ROLES)
  
  const { id } = await params

  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: true
    }
  })

  if (!role) {
    notFound()
  }

  return <RoleForm initialData={role} isEditing={true} />
}
