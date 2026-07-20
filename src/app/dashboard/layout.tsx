import { Metadata } from 'next'
import Sidebar from '@/components/admin/Sidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserPermissions } from '@/lib/permissions'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Rebon Motor Company',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  // Fetch full permission key array for the user (including super-admin checks)
  const userPermissions = await getUserPermissions(session.user.id)

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 font-sans flex">
      {/* Sidebar */}
      <Sidebar userRoles={session.user.roles} userPermissions={userPermissions} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar user={session.user} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

