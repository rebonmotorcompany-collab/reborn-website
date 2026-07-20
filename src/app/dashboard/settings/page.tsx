'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Globe,
  Phone,
  Share2,
  Clock,
  Search,
  Mail,
  Sliders,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import MediaPicker from '@/components/admin/MediaPicker';

interface SettingItem {
  id: string;
  key: string;
  value: string | null;
  type: string;
  group: string;
  label: string | null;
}

export default function SettingsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'hours' | 'seo' | 'analytics' | 'email' | 'others'>('general');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/settings?format=list');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const settingsMap: Record<string, string> = {};
        data.data.forEach((item: SettingItem) => {
          settingsMap[item.key] = item.value || '';
        });
        setSettings(settingsMap);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleToggleChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: prev[key] === 'true' ? 'false' : 'true'
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        router.refresh();
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update settings.' });
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General & Branding', icon: Sliders },
    { id: 'contact', label: 'Contact Information', icon: Phone },
    { id: 'social', label: 'Social Networks', icon: Share2 },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'seo', label: 'SEO & Footer', icon: Globe },
    { id: 'analytics', label: 'Analytics & Pixels', icon: Search },
    { id: 'email', label: 'SMTP & Email', icon: Mail },
    { id: 'others', label: 'Localization', icon: Settings }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">System Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure global application variables, SEO details, contact forms, and integrations.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-650 hover:bg-red-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-red-500/10 cursor-pointer"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
          ) : (
            <Save size={16} />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/50 text-green-800 dark:text-green-400'
              : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50 text-red-800 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <AlertCircle className="shrink-0 mt-0.5" size={18} />}
          <div className="text-sm font-medium">{message.text}</div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-red-500/10 dark:bg-red-500/10 text-red-650 dark:text-red-500 border-red-500/30'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-650 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-red-650 dark:text-red-500' : 'text-neutral-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Panel Container */}
        <form onSubmit={handleSave} className="lg:col-span-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 space-y-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">General Info & Branding</h3>
                  <p className="text-xs text-neutral-400">Manage your site title, slogan description, and logo brand elements.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Site Name</label>
                    <input
                      type="text"
                      value={settings.site_name || ''}
                      onChange={e => handleInputChange('site_name', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Company Tagline</label>
                    <input
                      type="text"
                      value={settings.company_tagline || ''}
                      onChange={e => handleInputChange('company_tagline', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Company Description</label>
                  <textarea
                    rows={3}
                    value={settings.company_description || ''}
                    onChange={e => handleInputChange('company_description', e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> Primary Logo (Dark Mode Layout)
                    </label>
                    <MediaPicker value={settings.logo_primary || ''} onChange={val => handleInputChange('logo_primary', val)} allowedTypes={['image/*']} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> Secondary Logo (Light Mode Layout)
                    </label>
                    <MediaPicker value={settings.logo_secondary || ''} onChange={val => handleInputChange('logo_secondary', val)} allowedTypes={['image/*']} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> White Logo
                    </label>
                    <MediaPicker value={settings.logo_white || ''} onChange={val => handleInputChange('logo_white', val)} allowedTypes={['image/*']} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> Dark Logo
                    </label>
                    <MediaPicker value={settings.logo_dark || ''} onChange={val => handleInputChange('logo_dark', val)} allowedTypes={['image/*']} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> Favicon (.ico/.png)
                    </label>
                    <MediaPicker value={settings.favicon || ''} onChange={val => handleInputChange('favicon', val)} allowedTypes={['image/*']} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> App Apple Touch Icon
                    </label>
                    <MediaPicker value={settings.app_icon || ''} onChange={val => handleInputChange('app_icon', val)} allowedTypes={['image/*']} />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Contact Channels & Addresses</h3>
                  <p className="text-xs text-neutral-400">Update hotlines, support/sales email points, WhatsApp lines, and HQ address parameters.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">General Hotline</label>
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={e => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">WhatsApp Sales Line</label>
                    <input
                      type="text"
                      value={settings.whatsapp_number || ''}
                      onChange={e => handleInputChange('whatsapp_number', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">General Info Email</label>
                    <input
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={e => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sales Department Email</label>
                    <input
                      type="email"
                      value={settings.sales_email || ''}
                      onChange={e => handleInputChange('sales_email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Customer Support Email</label>
                    <input
                      type="email"
                      value={settings.support_email || ''}
                      onChange={e => handleInputChange('support_email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Website Home URL</label>
                    <input
                      type="text"
                      value={settings.website_url || ''}
                      onChange={e => handleInputChange('website_url', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Physical HQ Address</label>
                    <input
                      type="text"
                      value={settings.office_address || ''}
                      onChange={e => handleInputChange('office_address', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">City</label>
                      <input
                        type="text"
                        value={settings.office_city || ''}
                        onChange={e => handleInputChange('office_city', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Province</label>
                      <input
                        type="text"
                        value={settings.office_province || ''}
                        onChange={e => handleInputChange('office_province', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-550 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Country</label>
                      <input
                        type="text"
                        value={settings.office_country || ''}
                        onChange={e => handleInputChange('office_country', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-550 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Postal Code</label>
                      <input
                        type="text"
                        value={settings.office_postal_code || ''}
                        onChange={e => handleInputChange('office_postal_code', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-550 outline-none transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Google Maps Embed URL</label>
                      <input
                        type="text"
                        value={settings.google_maps_url || ''}
                        onChange={e => handleInputChange('google_maps_url', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Latitude</label>
                        <input
                          type="text"
                          value={settings.office_latitude || ''}
                          onChange={e => handleInputChange('office_latitude', e.target.value)}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Longitude</label>
                        <input
                          type="text"
                          value={settings.office_longitude || ''}
                          onChange={e => handleInputChange('office_longitude', e.target.value)}
                          className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Social Networks</h3>
                  <p className="text-xs text-neutral-400">Configure profile URLs and visibility toggle states for social channels.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'facebook', label: 'Facebook' },
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'linkedin', label: 'LinkedIn' },
                    { id: 'youtube', label: 'YouTube' },
                    { id: 'tiktok', label: 'TikTok' },
                    { id: 'twitter', label: 'Twitter / X' },
                    { id: 'threads', label: 'Threads' },
                    { id: 'pinterest', label: 'Pinterest' }
                  ].map(platform => {
                    const keyUrl = `social_${platform.id}`;
                    const keyEnabled = `social_${platform.id}_enabled`;
                    const isEnabled = settings[keyEnabled] === 'true';

                    return (
                      <div key={platform.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/20">
                        <div className="flex items-center gap-3 w-40 shrink-0">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={() => handleToggleChange(keyEnabled)}
                            className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-700 text-red-650 focus:ring-red-500 cursor-pointer"
                          />
                          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{platform.label}</span>
                        </div>
                        <input
                          type="text"
                          disabled={!isEnabled}
                          value={settings[keyUrl] || ''}
                          onChange={e => handleInputChange(keyUrl, e.target.value)}
                          placeholder={`${platform.label} profile URL`}
                          className="flex-1 w-full px-4 py-2 border border-neutral-300 dark:border-neutral-750 disabled:bg-neutral-100 dark:disabled:bg-neutral-950/40 rounded-lg text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hours Tab */}
            {activeTab === 'hours' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Business Hours</h3>
                  <p className="text-xs text-neutral-400">Configure weekly operation days, opening times, and closing times.</p>
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-xs font-black uppercase text-neutral-400 tracking-wider">
                        <th className="px-6 py-4">Day</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Opening Time</th>
                        <th className="px-6 py-4">Closing Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                        const statusKey = `hours_${day}_status`;
                        const openKey = `hours_${day}_open`;
                        const closeKey = `hours_${day}_close`;
                        const isOpen = settings[statusKey] === 'open';

                        return (
                          <tr key={day} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-950/10 transition-colors">
                            <td className="px-6 py-4 font-bold capitalize text-neutral-800 dark:text-neutral-200">{day}</td>
                            <td className="px-6 py-3">
                              <select
                                value={settings[statusKey] || 'open'}
                                onChange={e => handleInputChange(statusKey, e.target.value)}
                                className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white outline-none cursor-pointer"
                              >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                            <td className="px-6 py-3">
                              <input
                                type="time"
                                disabled={!isOpen}
                                value={settings[openKey] || '09:00'}
                                onChange={e => handleInputChange(openKey, e.target.value)}
                                className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs bg-white dark:bg-neutral-950 disabled:bg-neutral-50 dark:disabled:bg-neutral-950 text-neutral-900 dark:text-white outline-none"
                              />
                            </td>
                            <td className="px-6 py-3">
                              <input
                                type="time"
                                disabled={!isOpen}
                                value={settings[closeKey] || '18:00'}
                                onChange={e => handleInputChange(closeKey, e.target.value)}
                                className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs bg-white dark:bg-neutral-950 disabled:bg-neutral-50 dark:disabled:bg-neutral-950 text-neutral-900 dark:text-white outline-none"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SEO & Footer Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">SEO Metadata & Footer</h3>
                  <p className="text-xs text-neutral-400">Configure global metadata tags, canonical settings, and copyright lines.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Default Meta Title</label>
                    <input
                      type="text"
                      value={settings.seo_meta_title || ''}
                      onChange={e => handleInputChange('seo_meta_title', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Canonical Site URL</label>
                    <input
                      type="text"
                      value={settings.seo_canonical_url || ''}
                      onChange={e => handleInputChange('seo_canonical_url', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">SEO Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={settings.seo_keywords || ''}
                    onChange={e => handleInputChange('seo_keywords', e.target.value)}
                    placeholder="e.g. motorcycles, electric scooters, clean energy"
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={settings.seo_meta_description || ''}
                    onChange={e => handleInputChange('seo_meta_description', e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Robots Rules</label>
                    <input
                      type="text"
                      value={settings.seo_robots || 'index, follow'}
                      onChange={e => handleInputChange('seo_robots', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon size={12} /> Open Graph Share Image
                    </label>
                    <MediaPicker value={settings.seo_og_image || ''} onChange={val => handleInputChange('seo_og_image', val)} allowedTypes={['image/*']} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Structured Schema Markup (JSON-LD)</label>
                  <textarea
                    rows={4}
                    value={settings.seo_schema || ''}
                    onChange={e => handleInputChange('seo_schema', e.target.value)}
                    placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                    className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none font-mono text-xs transition-colors"
                  />
                </div>

                <div className="space-y-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Footer Brand Bio Description</label>
                    <textarea
                      rows={2}
                      value={settings.footer_description || ''}
                      onChange={e => handleInputChange('footer_description', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Copyright Line Text</label>
                    <input
                      type="text"
                      value={settings.copyright_text || ''}
                      onChange={e => handleInputChange('copyright_text', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Tracking Scripts & Analytics</h3>
                  <p className="text-xs text-neutral-400">Insert tag container IDs for automated page views and visitor tracking scripts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Google Analytics 4 Measurement ID</label>
                    <input
                      type="text"
                      value={settings.analytics_google || ''}
                      onChange={e => handleInputChange('analytics_google', e.target.value)}
                      placeholder="e.g. G-XXXXXXXXXX"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Google Tag Manager Container ID</label>
                    <input
                      type="text"
                      value={settings.analytics_gtm || ''}
                      onChange={e => handleInputChange('analytics_gtm', e.target.value)}
                      placeholder="e.g. GTM-XXXXXXX"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Facebook Meta Pixel ID</label>
                    <input
                      type="text"
                      value={settings.analytics_pixel || ''}
                      onChange={e => handleInputChange('analytics_pixel', e.target.value)}
                      placeholder="e.g. 123456789012345"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Microsoft Clarity Project ID</label>
                    <input
                      type="text"
                      value={settings.analytics_clarity || ''}
                      onChange={e => handleInputChange('analytics_clarity', e.target.value)}
                      placeholder="e.g. abcdefghij"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SMTP Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">SMTP Outbox Configurations</h3>
                  <p className="text-xs text-neutral-400">Configure corporate SMTP gateway credentials for system automated email dispatches.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">SMTP Host Server</label>
                    <input
                      type="text"
                      value={settings.smtp_host || ''}
                      onChange={e => handleInputChange('smtp_host', e.target.value)}
                      placeholder="e.g. smtp.mailgun.org"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">SMTP Gateway Port</label>
                    <input
                      type="text"
                      value={settings.smtp_port || ''}
                      onChange={e => handleInputChange('smtp_port', e.target.value)}
                      placeholder="587 / 465"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.smtp_username || ''}
                      onChange={e => handleInputChange('smtp_username', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.smtp_password || ''}
                      onChange={e => handleInputChange('smtp_password', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sender Display Name</label>
                    <input
                      type="text"
                      value={settings.smtp_sender_name || ''}
                      onChange={e => handleInputChange('smtp_sender_name', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sender Outbound Email</label>
                    <input
                      type="email"
                      value={settings.smtp_sender_email || ''}
                      onChange={e => handleInputChange('smtp_sender_email', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Localization Tab */}
            {activeTab === 'others' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-1">Localization & Formats</h3>
                  <p className="text-xs text-neutral-400">Configure currency codes, default languages, timelines, and layout formats.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Default Currency</label>
                    <input
                      type="text"
                      value={settings.setting_currency || 'PKR'}
                      onChange={e => handleInputChange('setting_currency', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Site Timezone</label>
                    <input
                      type="text"
                      value={settings.setting_timezone || 'Asia/Karachi'}
                      onChange={e => handleInputChange('setting_timezone', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date Format Template</label>
                    <input
                      type="text"
                      value={settings.setting_date_format || 'DD-MM-YYYY'}
                      onChange={e => handleInputChange('setting_date_format', e.target.value)}
                      placeholder="e.g. YYYY-MM-DD"
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Time Format Option</label>
                    <select
                      value={settings.setting_time_format || '12-hour'}
                      onChange={e => handleInputChange('setting_time_format', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors text-sm cursor-pointer"
                    >
                      <option value="12-hour">12-Hour format (e.g. 06:00 PM)</option>
                      <option value="24-hour">24-Hour format (e.g. 18:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Action Footer */}
          <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950/20 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={fetchSettings}
              disabled={saving}
              className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-350 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-850 disabled:opacity-50 cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-650 hover:bg-red-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-red-500/10 cursor-pointer"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              ) : (
                <Save size={14} />
              )}
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
