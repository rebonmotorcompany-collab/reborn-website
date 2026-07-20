'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Clock, ChevronLeft, ChevronRight, Search, X, Loader2
} from 'lucide-react';

interface ActivityLog {
  id:          string;
  userId:      string | null;
  action:      string;
  entity:      string | null;
  entityId:    string | null;
  description: string;
  ipAddress:   string | null;
  userAgent:   string | null;
  createdAt:   string;
  user: {
    name:  string;
    email: string;
    image: string | null;
  } | null;
}

export default function ActivityLogsDashboard() {
  const [logs, setLogs]       = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [actionFilter, setActionFilter] = useState('');
  const [search, setSearch]             = useState('');

  const LIMIT = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: String(LIMIT),
        action: actionFilter,
      });

      const res = await fetch(`/api/activity-logs?${params}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Client side search filtering for quick view
  const filteredLogs = logs.filter(log =>
    log.description.toLowerCase().includes(search.toLowerCase()) ||
    (log.user?.name && log.user.name.toLowerCase().includes(search.toLowerCase())) ||
    log.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Activity className="text-red-500" />
            Audit & Activity Logs
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Loading…' : `Tracked ${total} activity occurrences`}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activities in current page list…"
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-[#D72626]"
        >
          <option value="">All Action Types</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="PASSWORD_RESET">Password Reset</option>
          <option value="PERMISSION_DENIED">Permission Denied</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-red-550 mr-2" />
            <span className="text-sm">Retrieving system activity...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <Activity className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-sm font-semibold">No activity logs found</p>
            <p className="text-xs text-neutral-450 mt-1">Audit log is clean.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  {/* User Profile Avatar */}
                  <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
                    {log.user?.image ? (
                      <img src={log.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-neutral-500 uppercase">{log.user?.name?.charAt(0) || 'S'}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-neutral-850 dark:text-neutral-200">
                        {log.user?.name || 'System / Guest'}
                      </span>
                      <span className="text-neutral-400 font-medium">({log.user?.email || 'unauthenticated'})</span>
                      <span className="px-1.5 py-0.25 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500 font-mono rounded">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium">{log.description}</p>
                    <p className="text-[10px] text-neutral-400">
                      IP: <span className="font-mono">{log.ipAddress || '—'}</span> · Agent: <span className="font-mono">{log.userAgent || '—'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-[10px] text-neutral-400 flex-shrink-0 font-medium sm:text-right">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{new Date(log.createdAt).toLocaleString('en-PK')}</span>
                  </div>
                  {log.entity && (
                    <span className="text-[9px] bg-red-500/10 text-[#D72626] font-bold px-1.5 py-0.5 rounded border border-red-500/20 mt-1 uppercase">
                      {log.entity}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-neutral-500 font-semibold">
              Showing {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total} events
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
