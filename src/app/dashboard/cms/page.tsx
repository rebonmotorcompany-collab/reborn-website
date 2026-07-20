import Link from 'next/link'
import { FileText, MessageSquareQuote, HelpCircle, Newspaper, ArrowRight } from 'lucide-react'

export default function CMSDashboard() {
  const modules = [
    {
      title: 'News & Blog Posts',
      description: 'Manage company news, announcements, and blog articles.',
      icon: Newspaper,
      href: '/dashboard/cms/posts',
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Testimonials',
      description: 'Manage customer reviews and dealer testimonials.',
      icon: MessageSquareQuote,
      href: '/dashboard/cms/testimonials',
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      title: 'FAQs',
      description: 'Manage Frequently Asked Questions and Categories.',
      icon: HelpCircle,
      href: '/dashboard/cms/faqs',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30'
    },
    {
      title: 'Custom Pages',
      description: 'Manage standalone content pages and their SEO data.',
      icon: FileText,
      href: '/dashboard/cms/pages',
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Content Management System</h1>
        <p className="text-sm text-neutral-500 mt-1">Select a module to manage website content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <div key={module.title} className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col hover:border-red-500 dark:hover:border-red-500 transition-colors group">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-xl ${module.bg}`}>
                <module.icon className={`w-6 h-6 ${module.color}`} />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">{module.title}</h2>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 flex-1">
              {module.description}
            </p>
            <Link 
              href={module.href}
              className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 group-hover:underline"
            >
              Manage {module.title}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
