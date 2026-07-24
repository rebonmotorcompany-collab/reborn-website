'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  Activity,
  Info,
  Briefcase,
  ChevronDown,
  ChevronRight,
  CreditCard,
} from 'lucide-react'

interface SidebarProps {
  userRoles: string[]
  userPermissions?: string[]
}

export default function Sidebar({ userRoles, userPermissions = [] }: SidebarProps) {
  const pathname = usePathname()
  const isSuperAdmin = userRoles.includes('super-admin')
  const hasPerm = (p: string) => isSuperAdmin || userPermissions.includes(p)

  // Track collapsible group open state
  const isCompanyActive = pathname.startsWith('/dashboard/company') || pathname.startsWith('/dashboard/settings/visiting-cards')
  const [companyOpen, setCompanyOpen] = useState(isCompanyActive)

  const linkCls = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
    return `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
    }`
  }

  const iconCls = (href: string, exact = false) => {
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
    return `w-5 h-5 mr-3 ${isActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`
  }

  // Determine if company sub-items should be shown
  const showCompany =
    hasPerm('about.view') || hasPerm('team.view') || hasPerm('careers.view') || hasPerm('settings.view')

  const companyChildren = [
    { name: 'About Us',  href: '/dashboard/company/about',   icon: Info,       show: hasPerm('about.view') },
    { name: 'Team',      href: '/dashboard/company/team',    icon: Users,      show: hasPerm('team.view') },
    { name: 'Careers',   href: '/dashboard/company/careers', icon: Briefcase,  show: hasPerm('careers.view') },
    { name: 'Visiting Cards', href: '/dashboard/settings/visiting-cards', icon: CreditCard, show: hasPerm('settings.view') },
  ].filter(i => i.show)

  const topItems = [
    { name: 'Dashboard',      href: '/dashboard',              icon: LayoutDashboard, show: true, exact: true },
    { name: 'Users',          href: '/dashboard/users',        icon: Users,           show: hasPerm('users.view') },
    { name: 'Roles',          href: '/dashboard/roles',        icon: ShieldCheck,     show: hasPerm('roles.view') },
    { name: 'Dealers',        href: '/dashboard/dealers',      icon: Store,           show: hasPerm('dealers.view') },
    { name: 'Products',       href: '/dashboard/products',     icon: Package,         show: hasPerm('products.view') },
    { name: 'CMS',            href: '/dashboard/cms',          icon: FileText,        show: hasPerm('cms.view') },
    { name: 'Media Library',  href: '/dashboard/media',        icon: ImageIcon,       show: hasPerm('media.view') },
    { name: 'Activity Logs',  href: '/dashboard/activity-logs',icon: Activity,        show: hasPerm('activity_logs.view') },
    { name: 'Settings',       href: '/dashboard/settings',     icon: Settings,        show: hasPerm('settings.view'), exact: true },
  ]

  return (
    <div className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="text-xl font-display font-bold text-neutral-900 dark:text-white uppercase tracking-tight">
          Rebon<span className="text-red-600">.</span> Admin
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* Dashboard always first */}
        <Link href="/dashboard" className={linkCls('/dashboard', true)}>
          <LayoutDashboard className={iconCls('/dashboard', true)} />
          Dashboard
        </Link>

        {topItems.filter(i => i.show && i.name !== 'Dashboard').map((item) => {
          // Insert Company group before CMS
          if (item.name === 'CMS' && showCompany) {
            return (
              <span key="company-group">
                {/* ── Company Group ── */}
                <button
                  type="button"
                  onClick={() => setCompanyOpen(o => !o)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isCompanyActive
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center">
                    <Building2 className={`w-5 h-5 mr-3 ${isCompanyActive ? 'text-red-600 dark:text-red-400' : 'text-neutral-400 dark:text-neutral-500'}`} />
                    Company
                  </div>
                  {companyOpen
                    ? <ChevronDown size={14} className="text-neutral-400" />
                    : <ChevronRight size={14} className="text-neutral-400" />}
                </button>

                {companyOpen && (
                  <div className="ml-4 pl-3 border-l border-neutral-200 dark:border-neutral-800 mt-0.5 mb-1 space-y-0.5">
                    {companyChildren.map(child => (
                      <Link key={child.href} href={child.href} className={linkCls(child.href)}>
                        <child.icon className={iconCls(child.href)} />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Then render CMS */}
                <Link href={item.href} className={linkCls(item.href)}>
                  <item.icon className={iconCls(item.href)} />
                  {item.name}
                </Link>
              </span>
            )
          }

          return (
            <Link key={item.name} href={item.href} className={linkCls(item.href, item.exact)}>
              <item.icon className={iconCls(item.href, item.exact)} />
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
