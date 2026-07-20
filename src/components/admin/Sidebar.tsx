'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Building2, 
  Store, 
  Package, 
  FileText, 
  Image as ImageIcon, 
  Settings,
  Activity
} from 'lucide-react'

interface SidebarProps {
  userRoles: string[]
  userPermissions?: string[]
}

export default function Sidebar({ userRoles, userPermissions = [] }: SidebarProps) {
  const pathname = usePathname()
  const isSuperAdmin = userRoles.includes('super-admin')

  const hasPerm = (p: string) => isSuperAdmin || userPermissions.includes(p)
  
  // Navigation items based on granular userPermissions
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, show: true },
    { name: 'Users', href: '/dashboard/users', icon: Users, show: hasPerm('users.view') },
    { name: 'Roles', href: '/dashboard/roles', icon: ShieldCheck, show: hasPerm('roles.view') },
    { name: 'Companies', href: '/dashboard/companies', icon: Building2, show: hasPerm('companies.view') },
    { name: 'Dealers', href: '/dashboard/dealers', icon: Store, show: hasPerm('dealers.view') },
    { name: 'Products', href: '/dashboard/products', icon: Package, show: hasPerm('products.view') },
    { name: 'CMS', href: '/dashboard/cms', icon: FileText, show: hasPerm('cms.view') },
    { name: 'Media Library', href: '/dashboard/media', icon: ImageIcon, show: hasPerm('media.view') },
    { name: 'Activity Logs', href: '/dashboard/activity-logs', icon: Activity, show: hasPerm('activity_logs.view') },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, show: hasPerm('settings.view') },
  ]

  return (
    <div className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="text-xl font-display font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
          Rebon<span className="text-red-600">.</span> Admin
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.filter(item => item.show).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 text-center">
        Rebon Motor Company &copy; 2026
      </div>
    </div>
  )
}
