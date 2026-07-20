import UserForm from '@/components/admin/UserForm'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function NewUserPage() {
  await requirePermission(PERMISSIONS.CREATE_USERS)
  return <UserForm />
}
