'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Edit, Mail, Phone, Calendar, Shield, Activity, ShieldAlert,
  User, CheckCircle, Clock, Globe, Key, AlertTriangle, Play, HelpCircle
} from 'lucide-react';

interface UserProfileViewProps {
  user: any;
}

export default function UserProfileView({ user }: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'permissions' | 'activity'>('info');
  const [history, setHistory]     = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load activity logs of this user
  useEffect(() => {
    if (activeTab === 'activity') {
      setLoadingHistory(true);
      fetch(`/api/activity-logs?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setHistory(data.data);
        })
        .catch(err => console.error('Failed to load user activity history:', err))
        .finally(() => setLoadingHistory(false));
    }
  }, [activeTab, user.id]);

  const assignedRole = user.userRoles?.[0]?.role;
  const permissionOverrides = user.userPermissions || [];

  const STATUS_STYLES: Record<string, string> = {
    ACTIVE:    'bg-green-150 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800',
    INACTIVE:  'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800',
    SUSPENDED: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800',
  };

  const CARD_CLS = 'bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden p-6 space-y-4';

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/users"
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">User Profile</h1>
            <p className="text-sm text-neutral-500 mt-0.5">Corporate identity & system access details</p>
          </div>
        </div>
        <Link
          href={`/dashboard/users/${user.id}`}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Edit size={14} />
          Edit User
        </Link>
      </div>

      {/* Identity Banner card */}
      <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.image ? (
            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10 text-neutral-400" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[user.status] || ''}`}>
              {user.status}
            </span>
            {user.lockedAt && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertTriangle size={11} /> Locked
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            Username: <span className="font-mono text-neutral-600 dark:text-neutral-300">@{user.username || '—'}</span> ·
            Email: <span className="font-mono text-neutral-600 dark:text-neutral-300">{user.email}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-neutral-650 dark:text-neutral-400">
            {assignedRole ? (
              <span
                style={{ backgroundColor: `${assignedRole.color}20`, color: assignedRole.color, borderColor: `${assignedRole.color}40` }}
                className="px-2.5 py-0.5 rounded-full border text-[11px]"
              >
                {assignedRole.name}
              </span>
            ) : (
              <span className="bg-neutral-100 text-neutral-500 px-2.5 py-0.5 rounded-full text-[11px]">No Role</span>
            )}
            {user.department && <span>· {user.department}</span>}
            {user.designation && <span>· {user.designation}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        {[
          { id: 'info', label: 'User Information', icon: User },
          { id: 'permissions', label: 'Permissions Details', icon: Shield },
          { id: 'activity', label: 'Login & Activity History', icon: Activity },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-red-600 text-red-650 dark:text-red-400'
                : 'border-transparent text-neutral-550 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <t.icon size={15} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details */}
            <div className={CARD_CLS}>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <Globe size={15} className="text-red-500" />
                Access Configuration
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Assigned Role</span>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">{assignedRole?.name || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Status</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200 uppercase">{user.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Timezone</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">{user.timezone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Preferred Language</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200 uppercase">{user.language}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-450 font-medium">Account Expiry</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">
                    {user.accountExpiresAt
                      ? new Date(user.accountExpiresAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Corporate Profile Card */}
            <div className={CARD_CLS}>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <CheckCircle size={15} className="text-red-500" />
                Corporate Metadata
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Department</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">{user.department || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Designation</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">{user.designation || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Employee ID</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200 font-mono">{user.employeeId || '—'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-900/40">
                  <span className="text-neutral-450 font-medium">Phone</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">{user.phone || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-450 font-medium">Created Date</span>
                  <span className="font-bold text-neutral-850 dark:text-neutral-200">
                    {new Date(user.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Config Card */}
            <div className={`${CARD_CLS} md:col-span-2`}>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <Key size={15} className="text-red-500" />
                Security Flags
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200/50 dark:border-neutral-800/80">
                  <p className="text-neutral-400 font-medium mb-1">System Account Type</p>
                  <p className="text-neutral-800 dark:text-neutral-200">
                    {user.isSystemAdmin ? 'System Administrator' : 'Standard Account'}
                  </p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200/50 dark:border-neutral-800/80">
                  <p className="text-neutral-400 font-medium mb-1">Force Password Reset</p>
                  <p className={user.forcePasswordChange ? 'text-red-500' : 'text-neutral-800 dark:text-neutral-200'}>
                    {user.forcePasswordChange ? 'Pending' : 'Inactive'}
                  </p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200/50 dark:border-neutral-800/80">
                  <p className="text-neutral-400 font-medium mb-1">Two-Factor Authentication</p>
                  <p className={user.twoFactorEnabled ? 'text-emerald-500' : 'text-neutral-500'}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Permissions Override view */}
        {activeTab === 'permissions' && (
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Active Permissions Overrides</h3>
              <p className="text-xs text-neutral-550 mt-1">Direct user-level permissions mapped on this account</p>
            </div>

            {permissionOverrides.length === 0 ? (
              <div className="text-center py-10">
                <HelpCircle className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-xs text-neutral-550">No direct permission overrides set for this user.</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Permissions are fully inherited from role: <span className="font-bold">{assignedRole?.name || 'None'}</span></p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissionOverrides.map((po: any) => (
                  <div
                    key={po.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                      po.value
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-900/30'
                        : 'bg-red-50/50 dark:bg-red-950/15 border-red-200 dark:border-red-900/30'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">{po.permission?.label}</p>
                      <code className="text-[9px] text-neutral-450 mt-0.5 block">{po.permission?.name}</code>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      po.value ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {po.value ? 'Explicit Allow' : 'Explicit Deny'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity & History view */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Recent Activity logs</h3>
              <p className="text-xs text-neutral-550 mt-1">Audit logs of actions performed by this user</p>
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center py-20 text-neutral-400">
                <Clock className="w-5 h-5 animate-spin mr-2" />
                <span className="text-xs">Loading activity logs...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <Activity className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-xs font-semibold">No activity logs recorded</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Logs are automatically written on user requests.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-850">
                {history.map((log: any) => (
                  <div key={log.id} className="p-4 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {log.description}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.25 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-mono rounded">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        IP: <span className="font-mono">{log.ipAddress || '—'}</span> · Agent: <span className="truncate max-w-[300px] inline-block align-bottom">{log.userAgent || '—'}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-neutral-400 flex-shrink-0 font-medium">
                      {new Date(log.createdAt).toLocaleString('en-PK')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
