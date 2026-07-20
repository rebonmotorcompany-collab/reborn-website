'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Plus, Store, Edit, Trash2, Eye, Search, ChevronLeft,
  ChevronRight, ChevronUp, ChevronDown, SlidersHorizontal, X
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Dealer {
  id:            string
  name:          string
  slug:          string
  dealerCode:    string
  businessName:  string | null
  dealerType:    string
  status:        string
  contactPerson: string | null
  phone:         string | null
  city:          string | null
  province:      string | null
  logo:          string | null
  isActive:      boolean
  createdAt:     string
}

interface Pagination {
  page:       number
  limit:      number
  total:      number
  totalPages: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE:  'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const TYPE_STYLES: Record<string, string> = {
  AUTHORIZED:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  FRANCHISE:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  DISTRIBUTOR: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  RETAIL:      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sortBy, sortOrder }: { col: string; sortBy: string; sortOrder: string }) {
  if (sortBy !== col) return <ChevronUp className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
  return sortOrder === 'asc'
    ? <ChevronUp className="w-3 h-3 text-red-500" />
    : <ChevronDown className="w-3 h-3 text-red-500" />
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DealersDashboard() {
  const [dealers, setDealers]       = useState<Dealer[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 })
  const [loading, setLoading]       = useState(true)
  const [deleting, setDeleting]     = useState<string | null>(null)

  // Filters & sort state
  const [search,     setSearch]     = useState('')
  const [status,     setStatus]     = useState('')
  const [dealerType, setDealerType] = useState('')
  const [sortBy,     setSortBy]     = useState('createdAt')
  const [sortOrder,  setSortOrder]  = useState<'asc' | 'desc'>('desc')
  const [page,       setPage]       = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchDealers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:      String(page),
        limit:     '15',
        search,
        status,
        dealerType,
        sortBy,
        sortOrder,
      })
      const res  = await fetch(`/api/dealers?${params}`)
      const data = await res.json()
      if (data.success) {
        setDealers(data.data)
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch dealers:', err)
    } finally {
      setLoading(false)
    }
  }, [page, search, status, dealerType, sortBy, sortOrder])

  useEffect(() => { fetchDealers() }, [fetchDealers])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(col)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/dealers/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchDealers()
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setDealerType('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
  }

  const hasActiveFilters = search || status || dealerType

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dealer Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Loading…' : `${pagination.total} dealer${pagination.total !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <Link
          href="/dashboard/dealers/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Dealer</span>
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search by name, code, city, contact…"
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
            />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters
                ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/10'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Status</label>
              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Dealer Type</label>
              <select
                value={dealerType}
                onChange={e => { setDealerType(e.target.value); setPage(1) }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Types</option>
                <option value="AUTHORIZED">Authorized</option>
                <option value="FRANCHISE">Franchise</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="RETAIL">Retail</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Sort By</label>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={e => {
                  const [col, ord] = e.target.value.split(':')
                  setSortBy(col)
                  setSortOrder(ord as 'asc' | 'desc')
                  setPage(1)
                }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="name:asc">Name A–Z</option>
                <option value="name:desc">Name Z–A</option>
                <option value="dealerCode:asc">Code A–Z</option>
                <option value="city:asc">City A–Z</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                {/* Dealer */}
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Dealer
                    <SortIcon col="name" sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
                {/* Type */}
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('dealerType')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Type
                    <SortIcon col="dealerType" sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
                {/* Contact */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                {/* Location */}
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('city')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Location
                    <SortIcon col="city" sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
                {/* Status */}
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Status
                    <SortIcon col="status" sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
                {/* Date */}
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Created
                    <SortIcon col="createdAt" sortBy={sortBy} sortOrder={sortOrder} />
                  </button>
                </th>
                {/* Actions */}
                <th className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                /* Skeleton */
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" style={{ width: j === 0 ? '140px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : dealers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Store className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-500">No dealers found</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {hasActiveFilters ? 'Try adjusting your search or filters.' : 'Click "Add Dealer" to register your first dealer.'}
                    </p>
                  </td>
                </tr>
              ) : (
                dealers.map(dealer => (
                  <tr key={dealer.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">

                    {/* Dealer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden">
                          {dealer.logo
                            ? <img src={dealer.logo} alt="" className="w-full h-full object-contain" />
                            : <Store className="w-5 h-5 text-neutral-400" />
                          }
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">{dealer.name}</div>
                          <div className="text-xs text-neutral-500 font-mono">{dealer.dealerCode}</div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[dealer.dealerType] || ''}`}>
                        {dealer.dealerType.charAt(0) + dealer.dealerType.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-white">{dealer.contactPerson || '—'}</div>
                      <div className="text-xs text-neutral-500">{dealer.phone || ''}</div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-white">{dealer.city || '—'}</div>
                      <div className="text-xs text-neutral-500">{dealer.province || ''}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[dealer.status] || ''}`}>
                        {dealer.status.charAt(0) + dealer.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500">
                      {new Date(dealer.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/dashboard/dealers/${dealer.id}/view`}
                          title="View"
                          className="p-1.5 rounded-md text-neutral-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/dashboard/dealers/${dealer.id}`}
                          title="Edit"
                          className="p-1.5 rounded-md text-neutral-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(dealer.id, dealer.name)}
                          disabled={deleting === dealer.id}
                          title="Delete"
                          className="p-1.5 rounded-md text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const p = pagination.totalPages <= 5
                  ? i + 1
                  : pagination.page <= 3
                    ? i + 1
                    : pagination.page >= pagination.totalPages - 2
                      ? pagination.totalPages - 4 + i
                      : pagination.page - 2 + i
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? 'bg-red-600 text-white'
                        : 'border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
