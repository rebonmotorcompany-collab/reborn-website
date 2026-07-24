import Link from 'next/link'
import { Building2, Users, Briefcase, ArrowRight, Info } from 'lucide-react'

export default function CompanyDashboard() {
  const modules = [
    {
      title: 'About Us',
      description: 'Edit all About Us page sections — hero, mission, vision, story, statistics, gallery, and SEO.',
      icon: Info,
      href: '/dashboard/company/about',
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Team',
      description: 'Manage team member profiles — photos, bios, social links, featured status, and display order.',
      icon: Users,
      href: '/dashboard/company/team',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Careers',
      description: 'Post and manage job listings — descriptions, requirements, application details, and status.',
      icon: Briefcase,
      href: '/dashboard/company/careers',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-7 h-7 text-neutral-400" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Company</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage all company-related content and information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div
            key={mod.title}
            className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col hover:border-red-500 dark:hover:border-red-500 transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${mod.bg}`}>
                <mod.icon className={`w-6 h-6 ${mod.color}`} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{mod.title}</h2>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-1">{mod.description}</p>
            <Link
              href={mod.href}
              className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 group-hover:underline"
            >
              Manage {mod.title}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
