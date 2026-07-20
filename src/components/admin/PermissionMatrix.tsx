'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Loader2 } from 'lucide-react';

interface Permission {
  id:          string;
  name:        string;
  label:       string;
  group:       string;
  description: string | null;
}

interface PermissionMatrixProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export default function PermissionMatrix({ selectedIds, onChange, disabled = false }: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const res = await fetch('/api/permissions');
        const data = await res.json();
        if (data.success) {
          setPermissions(data.data);
        } else {
          setError(data.error || 'Failed to load permissions');
        }
      } catch (err) {
        setError('Error fetching permissions list');
      } finally {
        setLoading(false);
      }
    }
    loadPermissions();
  }, []);

  // Group permissions by 'group' field
  const groups = permissions.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleToggle = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleToggleGroup = (groupName: string, groupPerms: Permission[]) => {
    if (disabled) return;
    const groupPermIds = groupPerms.map(p => p.id);
    const allSelected = groupPermIds.every(id => selectedIds.includes(id));

    if (allSelected) {
      // Unselect all in this group
      onChange(selectedIds.filter(id => !groupPermIds.includes(id)));
    } else {
      // Select all in this group (avoiding duplicates)
      const filtered = selectedIds.filter(id => !groupPermIds.includes(id));
      onChange([...filtered, ...groupPermIds]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-neutral-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>Loading permission system...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Granular Permission Matrix</h3>
        </div>
        <p className="text-xs text-neutral-400 font-medium">Grouped by module layers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groups).map(([groupName, items]) => {
          const groupPermIds = items.map(p => p.id);
          const allSelected = groupPermIds.every(id => selectedIds.includes(id));
          const someSelected = groupPermIds.some(id => selectedIds.includes(id)) && !allSelected;

          return (
            <div
              key={groupName}
              className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800/40 pb-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                    {groupName}
                  </span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleToggleGroup(groupName, items)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                      allSelected
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {allSelected ? 'Unselect All' : 'Select All'}
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map(p => {
                    const isChecked = selectedIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-red-500/5 dark:bg-red-500/10 border border-red-500/20'
                            : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={disabled}
                          onChange={() => handleToggle(p.id)}
                          className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                            {p.label}
                          </p>
                          {p.description && (
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                              {p.description}
                            </p>
                          )}
                          <code className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-850 px-1 py-0.5 rounded mt-1 block w-max">
                            {p.name}
                          </code>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
