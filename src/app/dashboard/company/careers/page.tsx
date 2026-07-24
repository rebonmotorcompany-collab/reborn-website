'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Briefcase, Edit, Trash2, Search, Filter } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  DRAFT:     'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  CLOSED:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function CareersListPage() {
  const [careers, setCareers]   = useState<any[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchCareers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20', search, ...(status && { status }) })
    const res  = await fetch(`/api/company/careers?${params}`)
    const json = await res.json()
    if (json.success) { setCareers(json.data); setTotal(json.pagination.total) }
    setLoading(false)
  }, [page, search, status])

  useEffect(() => { fetchCareers() }, [fetchCareers])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    const res = await fetch(`/api/company/careers/${id}`, { method: 'DELETE' })
    if (res.ok) fetchCareers()
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Careers</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage job postings. {total} total.</p>
        </div>
        <Link href="/dashboard/company/careers/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Post Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search jobs…"
            className="pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-neutral-400" />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none">
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-500">Loading…</td></tr>
              ) : careers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-neutral-500">
                    No careers found. <Link href="/dashboard/company/careers/new" className="text-red-600 font-medium">Post a job</Link>.
                  </td>
                </tr>
              ) : careers.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                        <Briefcase size={16} className="text-neutral-400" />
                      </div>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{c.department || '—'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{c.location || '—'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{c.employmentType?.replace('_', ' ') || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || STATUS_COLORS.DRAFT}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {c.deadline ? new Date(c.deadline).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/company/careers/${c.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-500">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(c.id, c.title)} disabled={deleting === c.id}
                        className="text-red-600 hover:text-red-800 dark:text-red-500 disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
