'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Shield, Edit, Trash2, ShieldCheck, Search, X, Loader2, Users
} from 'lucide-react';

interface Role {
  id:          string;
  name:        string;
  slug:        string;
  displayName: string | null;
  description: string | null;
  isSystem:    boolean;
  color:       string | null;
  priority:    number;
  _count: {
    userRoles: number;
  };
}

export default function RolesDashboard() {
  const [roles, setRoles]     = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/roles');
      const data = await res.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (err) {
      console.error('Failed to load roles list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete role "${name}"? All assigned users will lose this role.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        await fetchRoles();
      } else {
        alert(data.error || 'Failed to delete role');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null);
    }
  };

  const filteredRoles = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Role Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Loading…' : `${roles.length} role${roles.length !== 1 ? 's' : ''} configured`}
          </p>
        </div>
        <Link
          href="/dashboard/roles/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Plus size={16} />
          <span>Add Role</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search roles by name, slug or description…"
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Roles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm animate-pulse h-40" />
          ))}
        </div>
      ) : filteredRoles.length === 0 ? (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center shadow-sm">
          <Shield className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-500">No roles configured</p>
          <p className="text-xs text-neutral-450 mt-1">Configure role matrices to manage access controls.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map(role => (
            <div
              key={role.id}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Badge Strip */}
              <div className="h-2 w-full" style={{ backgroundColor: role.color || '#6B7280' }} />

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        {role.displayName || role.name}
                        {role.isSystem && (
                          <span className="bg-red-550/10 text-red-550 border border-red-500/20 px-2 py-0.25 text-[9px] font-bold rounded uppercase">
                            System
                          </span>
                        )}
                      </h3>
                      <code className="text-[10px] font-mono text-neutral-450">@{role.slug}</code>
                    </div>
                    <span className="text-[10px] font-bold bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full">
                      Priority: {role.priority}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed line-clamp-2">
                    {role.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
                    <Users size={14} className="text-neutral-450" />
                    <span>{role._count?.userRoles || 0} assigned user{role._count?.userRoles !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/roles/${role.id}`}
                      title="Edit role & permissions matrix"
                      className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-900 text-neutral-550 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors border border-neutral-200/50 dark:border-neutral-800/80"
                    >
                      <Edit size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(role.id, role.name)}
                      disabled={role.isSystem || deleting === role.id}
                      title="Delete role"
                      className="p-1.5 rounded bg-neutral-50 dark:bg-neutral-900 text-neutral-550 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border border-neutral-200/50 dark:border-neutral-800/80 disabled:opacity-35"
                    >
                      {deleting === role.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
