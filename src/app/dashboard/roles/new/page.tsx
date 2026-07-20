import RoleForm from '@/components/admin/RoleForm'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function NewRolePage() {
  await requirePermission(PERMISSIONS.CREATE_ROLES)
  return <RoleForm />
}
