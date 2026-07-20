import MediaLibrary from '@/components/admin/MediaLibrary'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export default async function MediaDashboardPage() {
  // Server-side page protection guard
  await requirePermission(PERMISSIONS.VIEW_MEDIA)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Media Library</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage static assets, uploads, and media folders</p>
      </div>

      <MediaLibrary mode="manage" />
    </div>
  )
}
