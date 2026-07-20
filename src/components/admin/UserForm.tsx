'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import MediaPicker from './MediaPicker';

interface Role {
  id:          string;
  name:        string;
  slug:        string;
  displayName: string | null;
}

interface UserFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const timezones = [
  'UTC', 'Asia/Karachi', 'Asia/Dubai', 'Asia/Riyadh', 'Asia/Singapore',
  'Europe/London', 'Europe/Paris', 'America/New_York', 'America/Los_Angeles'
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ur', name: 'Urdu (اردو)' },
];

export default function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles]               = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Load roles list for dropdown selection
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch('/api/roles');
        const data = await res.json();
        if (data.success) {
          setRoles(data.data);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    }
    fetchRoles();
  }, []);

  const [formData, setFormData] = useState({
    name:           initialData?.name           || '',
    username:       initialData?.username       || '',
    email:          initialData?.email          || '',
    password:       '',
    phone:          initialData?.phone          || '',
    status:         initialData?.status         || 'ACTIVE',
    department:     initialData?.department     || '',
    designation:    initialData?.designation    || '',
    employeeId:     initialData?.employeeId     || '',
    image:          initialData?.image          || '',
    timezone:       initialData?.timezone       || 'Asia/Karachi',
    language:       initialData?.language       || 'en',
    forcePasswordChange: initialData?.forcePasswordChange || false,
    twoFactorEnabled:    initialData?.twoFactorEnabled    || false,
    accountExpiresAt:    initialData?.accountExpiresAt
      ? new Date(initialData.accountExpiresAt).toISOString().split('T')[0]
      : '',
    roleId:         initialData?.userRoles?.[0]?.roleId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation for create mode
    if (!isEditing && !formData.password) {
      setError('Password is required for new users');
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditing ? `/api/users/${initialData.id}` : '/api/users';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save user');

      router.push('/dashboard/users');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm';
  const labelCls = 'block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1';
  const sectionCls = 'bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5';
  const titleCls = 'text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/users"
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isEditing ? 'Edit User Record' : 'Add New User'}
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isEditing ? `Editing Account: ${initialData?.name}` : 'Provision a new corporate account'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
        >
          <Save size={16} />
          <span>{isSubmitting ? 'Saving…' : 'Save User'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Information */}
          <div className={sectionCls}>
            <h2 className={titleCls}>Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Kamran Ali" />
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input name="username" type="text" value={formData.username} onChange={handleChange}
                  className={inputCls} placeholder="e.g. kamran.ali" />
              </div>
              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                  className={inputCls} placeholder="e.g. kamran@rebonmotor.com" />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                  className={inputCls} placeholder="e.g. +92 300 1234567" />
              </div>

              {/* Password Section */}
              <div className="sm:col-span-2 relative">
                <label className={labelCls}>
                  {isEditing ? 'Update Password (leave blank to keep current)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required={!isEditing}
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputCls} pr-10`}
                    placeholder={isEditing ? 'Enter new password…' : 'Enter login password…'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Organization details */}
          <div className={sectionCls}>
            <h2 className={titleCls}>Organization details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Department</label>
                <input name="department" type="text" value={formData.department} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Customer Support" />
              </div>
              <div>
                <label className={labelCls}>Designation</label>
                <input name="designation" type="text" value={formData.designation} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Senior Officer" />
              </div>
              <div>
                <label className={labelCls}>Employee ID</label>
                <input name="employeeId" type="text" value={formData.employeeId} onChange={handleChange}
                  className={inputCls} placeholder="e.g. RMC-2026-085" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Options */}
        <div className="space-y-6">
          {/* Account Status / Roles */}
          <div className={sectionCls}>
            <h2 className={titleCls}>Access Control & Status</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Role Assigned</label>
                {loadingRoles ? (
                  <div className="flex items-center text-xs text-neutral-450 mt-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Loading roles...
                  </div>
                ) : (
                  <select name="roleId" value={formData.roleId} onChange={handleChange} className={inputCls}>
                    <option value="">— Select Role —</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.slug})</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className={labelCls}>Account Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                  <option value="ACTIVE">Active / Enabled</option>
                  <option value="INACTIVE">Inactive / Disabled</option>
                  <option value="SUSPENDED">Suspended / Deactivated</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Preferred Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className={inputCls}>
                  {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Timezone</label>
                <select name="timezone" value={formData.timezone} onChange={handleChange} className={inputCls}>
                  {timezones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Account Expiry Date</label>
                <input name="accountExpiresAt" type="date" value={formData.accountExpiresAt} onChange={handleChange}
                  className={inputCls} />
              </div>
            </div>
          </div>

          {/* Security details */}
          <div className={sectionCls}>
            <h2 className={titleCls}>Security Parameters</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  name="forcePasswordChange"
                  checked={formData.forcePasswordChange}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-neutral-800 dark:text-neutral-250">Force Password Change</p>
                  <p className="text-neutral-400 font-medium mt-0.5">User must change password on next sign in</p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  name="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                />
                <div className="text-xs">
                  <p className="font-bold text-neutral-800 dark:text-neutral-250">Two-Factor Authentication</p>
                  <p className="text-neutral-400 font-medium mt-0.5">Enable 2FA login verification rules</p>
                </div>
              </label>
            </div>
          </div>

          {/* Profile Photo */}
          <div className={sectionCls}>
            <h2 className={titleCls}>Profile Avatar</h2>
            <div className="space-y-4">
              <MediaPicker
                value={formData.image}
                onChange={url => setFormData(prev => ({ ...prev, image: url }))}
                placeholder="Choose profile avatar from media library..."
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
