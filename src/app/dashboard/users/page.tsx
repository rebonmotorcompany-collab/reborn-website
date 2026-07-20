'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus, Users, Edit, Trash2, Eye, Search, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, SlidersHorizontal, X, UserCheck, ShieldAlert,
  Lock, Unlock, Shield, HelpCircle
} from 'lucide-react';

interface User {
  id:                  string;
  name:                string;
  username:            string | null;
  email:               string;
  phone:               string | null;
  status:              string;
  department:          string | null;
  designation:         string | null;
  employeeId:          string | null;
  image:               string | null;
  timezone:            string;
  language:            string;
  lockedAt:            string | null;
  failedLoginAttempts: number;
  lastLoginAt:         string | null;
  isSystemAdmin:       boolean;
  createdAt:           string;
  userRoles: {
    role: {
      id:          string;
      name:        string;
      slug:        string;
      color:       string | null;
    };
  }[];
}

interface Role {
  id:          string;
  name:        string;
  slug:        string;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800',
  INACTIVE:  'bg-neutral-100 text-neutral-600 dark:bg-neutral-850 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800',
  SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800',
};

export default function UsersDashboard() {
  const [users, setUsers]           = useState<User[]>([]);
  const [roles, setRoles]           = useState<Role[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters / Sorting state
  const [search, setSearch]         = useState('');
  const [status, setStatus]         = useState('');
  const [roleId, setRoleId]         = useState('');
  const [dept, setDept]             = useState('');
  const [sortBy, setSortBy]         = useState('createdAt');
  const [sortOrder, setSortOrder]   = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction]   = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const LIMIT = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:      String(page),
        limit:     String(LIMIT),
        search,
        status,
        roleId,
        department: dept,
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        if (data.meta?.departments) {
          setDepartments(data.meta.departments);
        }
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, roleId, dept, sortBy, sortOrder]);

  // Load roles list for filter
  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setRoles(data.data);
      })
      .catch(err => console.error('Error fetching roles filter list:', err));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(users.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction) return;
    if (selectedIds.length === 0) {
      alert('Please select at least one user');
      return;
    }
    if (bulkAction === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;

    setBulkLoading(true);
    try {
      const res = await fetch('/api/users/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, action: bulkAction }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedIds([]);
        setBulkAction('');
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to run bulk action');
      }
    } catch (err) {
      console.error('Bulk action failed:', err);
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggleLock = async (id: string, lock: boolean) => {
    try {
      const res = await fetch(`/api/users/${id}/toggle-lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lock }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
      } else {
        alert(data.error || 'Lock/Unlock operation failed');
      }
    } catch (err) {
      console.error('Toggle lock failed:', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setRoleId('');
    setDept('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const hasActiveFilters = search || status || roleId || dept;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortBy !== col) return <ChevronUp className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-red-500" /> : <ChevronDown className="w-3 h-3 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Accounts Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Loading…' : `${total} user account${total !== 1 ? 's' : ''} registered`}
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Add User</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, username, email, phone…"
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showFilters
                ? 'border-red-500 text-red-650 bg-red-50 dark:bg-red-900/10'
                : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />}
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Status</label>
              <select
                value={status}
                onChange={e => { setStatus(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 mb-1">Assigned Role</label>
              <select
                value={roleId}
                onChange={e => { setRoleId(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Roles</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-550 mb-1">Department</label>
              <select
                value={dept}
                onChange={e => { setDept(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-550 mb-1">Sort By</label>
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={e => {
                  const [col, ord] = e.target.value.split(':');
                  setSortBy(col);
                  setSortOrder(ord as any);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="createdAt:desc">Created (Newest)</option>
                <option value="createdAt:asc">Created (Oldest)</option>
                <option value="name:asc">Name A-Z</option>
                <option value="name:desc">Name Z-A</option>
                <option value="lastLoginAt:desc">Last Login Date</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="bg-red-50 dark:bg-neutral-900 p-3 rounded-xl border border-red-200 dark:border-neutral-800 flex items-center justify-between gap-3 transition-all">
          <span className="text-xs font-bold text-red-650 dark:text-neutral-300">
            {selectedIds.length} user{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkAction}
              onChange={e => setBulkAction(e.target.value)}
              className="px-3 py-1.5 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500 dark:text-white"
            >
              <option value="">— Select Bulk Action —</option>
              <option value="activate">Activate Accounts</option>
              <option value="deactivate">Deactivate Accounts</option>
              <option value="lock">Lock Accounts</option>
              <option value="unlock">Unlock Accounts</option>
              <option value="delete">Delete Accounts</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={bulkLoading || !bulkAction}
              className="bg-red-650 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th className="px-6 py-4 text-left w-4">
                  <input
                    type="checkbox"
                    checked={users.length > 0 && selectedIds.length === users.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-4 text-left">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-550 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300">
                    User Details <SortIcon col="name" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-550 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-550 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-550 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300">
                    Status <SortIcon col="status" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button onClick={() => handleSort('lastLoginAt')} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-550 uppercase tracking-wider hover:text-neutral-700 dark:hover:text-neutral-300">
                    Last Logged In <SortIcon col="lastLoginAt" />
                  </button>
                </th>
                <th className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse w-3/4" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-500">No users found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or add a new user account.</p>
                  </td>
                </tr>
              ) : (
                users.map(u => {
                  const isChecked = selectedIds.includes(u.id);
                  const role = u.userRoles?.[0]?.role;
                  return (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => handleSelectOne(u.id, e.target.checked)}
                          className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                        />
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {u.image ? (
                              <img src={u.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-5 h-5 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                              {u.name}
                              {u.isSystemAdmin && (
                                <span className="bg-red-550/10 text-red-550 px-1 py-0.25 text-[9px] font-bold rounded uppercase">
                                  System
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-450 font-medium">@{u.username || '—'} · {u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-white font-medium">{u.designation || '—'}</div>
                        <div className="text-xs text-neutral-450">{u.department || '—'}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {role ? (
                          <span
                            style={{ backgroundColor: `${role.color || '#6B7280'}15`, color: role.color || '#6B7280', borderColor: `${role.color || '#6B7280'}30` }}
                            className="px-2 py-0.5 rounded-full border text-xs font-semibold"
                          >
                            {role.name}
                          </span>
                        ) : (
                          <span className="text-xs text-neutral-400">No Role</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[u.status] || ''}`}>
                            {u.status}
                          </span>
                          {u.lockedAt && (
                            <span className="text-amber-500" title="Account Locked">
                              <Lock size={12} />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500 font-mono">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })
                          : 'Never'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          {u.lockedAt ? (
                            <button
                              onClick={() => handleToggleLock(u.id, false)}
                              title="Unlock account"
                              className="p-1.5 rounded-md text-neutral-550 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                            >
                              <Unlock size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleLock(u.id, true)}
                              disabled={u.isSystemAdmin}
                              title="Lock account"
                              className="p-1.5 rounded-md text-neutral-550 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors disabled:opacity-30"
                            >
                              <Lock size={14} />
                            </button>
                          )}
                          <Link
                            href={`/dashboard/users/${u.id}/view`}
                            title="View Profile"
                            className="p-1.5 rounded-md text-neutral-550 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            href={`/dashboard/users/${u.id}`}
                            title="Edit User"
                            className="p-1.5 rounded-md text-neutral-550 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            disabled={u.isSystemAdmin}
                            title="Delete"
                            className="p-1.5 rounded-md text-neutral-550 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-30"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-500 font-semibold">
              Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    i + 1 === page
                      ? 'bg-red-600 text-white'
                      : 'border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
