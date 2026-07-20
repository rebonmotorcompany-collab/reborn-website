'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PermissionMatrix from './PermissionMatrix';

interface RoleFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const colors = [
  { name: 'Red',    hex: '#DC2626' },
  { name: 'Rose',   hex: '#E11D48' },
  { name: 'Blue',   hex: '#2563EB' },
  { name: 'Amber',  hex: '#F59E0B' },
  { name: 'Emerald',hex: '#10B981' },
  { name: 'Pink',   hex: '#EC4899' },
  { name: 'Cyan',   hex: '#06B6D4' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Indigo', hex: '#4F46E5' },
  { name: 'Gray',   hex: '#6B7280' },
  { name: 'Dark',   hex: '#111827' },
];

export default function RoleForm({ initialData, isEditing = false }: RoleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Map initial permission IDs if editing
  const initialPerms = initialData?.rolePermissions?.map((rp: any) => rp.permissionId) || [];

  const [formData, setFormData] = useState({
    name:        initialData?.name        || '',
    displayName: initialData?.displayName || '',
    description: initialData?.description || '',
    color:       initialData?.color       || '#6B7280',
    priority:    initialData?.priority?.toString() || '0',
    permissions: initialPerms as string[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionsChange = (newPermIds: string[]) => {
    setFormData(prev => ({ ...prev, permissions: newPermIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing ? `/api/roles/${initialData.id}` : '/api/roles';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save role');

      router.push('/dashboard/roles');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/roles"
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isEditing ? 'Edit Role Details' : 'Add New Role'}
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isEditing ? `Editing System Role: ${initialData?.name}` : 'Configure role parameters and permissions'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{isSubmitting ? 'Saving…' : 'Save Role'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Role Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
              Role configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-550 dark:text-neutral-400 mb-1">
                  System Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  disabled={isEditing && initialData?.isSystem}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors"
                  placeholder="e.g. sales-rep"
                />
                {isEditing && initialData?.isSystem && (
                  <p className="text-[10px] text-red-500 font-semibold mt-1">System protected name cannot be edited.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-550 dark:text-neutral-400 mb-1">
                  Display Name
                </label>
                <input
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors"
                  placeholder="e.g. Sales Representative"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-550 dark:text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors"
                  placeholder="Description of duties/permissions..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-550 dark:text-neutral-400 mb-1">
                  Role Badge Color
                </label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {colors.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: c.hex }))}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        formData.color === c.hex
                          ? 'border-white scale-125 shadow-lg shadow-black/30'
                          : 'border-transparent'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-550 dark:text-neutral-400 mb-1">
                  Hierarchy Priority (0–100)
                </label>
                <input
                  name="priority"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Higher priority roles override lower ones in access rules.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Permissions Assignment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <PermissionMatrix
              selectedIds={formData.permissions}
              onChange={handlePermissionsChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
