'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Users, Edit, Trash2, Star, CheckCircle, XCircle, Search } from 'lucide-react'

export default function TeamListPage() {
  const [members, setMembers]   = useState<any[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20', search })
    const res  = await fetch(`/api/company/team?${params}`)
    const json = await res.json()
    if (json.success) {
      setMembers(json.data)
      setTotal(json.pagination.total)
    }
    setLoading(false)
  }, [page, search])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    const res = await fetch(`/api/company/team/${id}`, { method: 'DELETE' })
    if (res.ok) fetchMembers()
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your company's team profiles. {total} total.</p>
        </div>
        <Link href="/dashboard/company/team/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Add Member
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search name, position…"
          className="pl-9 pr-4 py-2 w-full border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
        />
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">Loading…</td></tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">
                    No team members found. <Link href="/dashboard/company/team/new" className="text-red-600 font-medium">Add one</Link>.
                  </td>
                </tr>
              ) : members.map(m => (
                <tr key={m.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" /> : <Users size={18} className="text-neutral-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">{m.name}</div>
                        <div className="text-xs text-neutral-500">{m.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{m.department || '—'}</td>
                  <td className="px-6 py-4">
                    {m.isActive
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle size={12} /> Active</span>
                      : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"><XCircle size={12} /> Inactive</span>}
                  </td>
                  <td className="px-6 py-4">
                    {m.isFeatured && <Star size={16} className="text-amber-500 fill-amber-500" />}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{m.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/dashboard/company/team/${m.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-500">
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        disabled={deleting === m.id}
                        className="text-red-600 hover:text-red-800 dark:text-red-500 disabled:opacity-40"
                      >
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
