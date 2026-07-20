import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus, HelpCircle, Edit, Trash2 } from 'lucide-react'

export default async function FaqsDashboard() {
  const faqs = await prisma.faqItem.findMany({
    orderBy: { order: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage FAQs and their display order.</p>
        </div>
        <Link 
          href="/dashboard/cms/faqs/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add FAQ</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Question</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-neutral-500">
                    No FAQs found. Click "Add FAQ" to create one.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <HelpCircle className="w-5 h-5 text-neutral-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{faq.question}</div>
                          <div className="text-xs text-neutral-500 line-clamp-1">{faq.answer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faq.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {faq.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {faq.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link href={`/dashboard/cms/faqs/${faq.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400">
                          <Edit size={16} />
                        </Link>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
