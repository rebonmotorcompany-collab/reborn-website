'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MediaPicker from './MediaPicker'

interface TeamMemberFormProps {
  initialData?: any
  isEditing?: boolean
}

const inputCls = "w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
const textareaCls = `${inputCls} resize-none`

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
    </div>
  )
}

export default function TeamMemberForm({ initialData, isEditing }: TeamMemberFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name:          initialData?.name          || '',
    position:      initialData?.position      || '',
    department:    initialData?.department    || '',
    biography:     initialData?.biography     || '',
    experience:    initialData?.experience    || '',
    qualification: initialData?.qualification || '',
    email:         initialData?.email         || '',
    phone:         initialData?.phone         || '',
    linkedin:      initialData?.linkedin      || '',
    facebook:      initialData?.facebook      || '',
    instagram:     initialData?.instagram     || '',
    twitter:       initialData?.twitter       || '',
    photo:         initialData?.photo         || '',
    coverImage:    initialData?.coverImage    || '',
    order:         initialData?.order         ?? 0,
    isFeatured:    initialData?.isFeatured    || false,
    isActive:      initialData?.isActive      !== undefined ? initialData.isActive : true,
    joiningDate:   initialData?.joiningDate   ? initialData.joiningDate.toString().slice(0, 10) : '',
  })

  const set = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    set(name, val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const url    = isEditing ? `/api/company/team/${initialData.id}` : '/api/company/team'
      const method = isEditing ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save')
      router.push('/dashboard/company/team')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/company/team" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isEditing ? 'Edit Team Member' : 'Add Team Member'}
          </h1>
        </div>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
          <Save size={18} />
          {isSubmitting ? 'Saving…' : 'Save Member'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Main Fields ── */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Basic Information</h2>
            <Field label="Full Name *">
              <input name="name" required value={form.name} onChange={handleChange} className={inputCls} placeholder="Ali Hassan" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Position / Title">
                <input name="position" value={form.position} onChange={handleChange} className={inputCls} placeholder="Senior Engineer" />
              </Field>
              <Field label="Department">
                <input name="department" value={form.department} onChange={handleChange} className={inputCls} placeholder="Engineering" />
              </Field>
            </div>
            <Field label="Biography">
              <textarea name="biography" value={form.biography} onChange={handleChange} rows={5} className={textareaCls} placeholder="Brief professional biography…" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Experience">
                <input name="experience" value={form.experience} onChange={handleChange} className={inputCls} placeholder="8+ years" />
              </Field>
              <Field label="Qualification">
                <input name="qualification" value={form.qualification} onChange={handleChange} className={inputCls} placeholder="B.Sc. Mechanical Engineering" />
              </Field>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Contact & Social</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input name="phone" value={form.phone} onChange={handleChange} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="LinkedIn URL">
                <input name="linkedin" value={form.linkedin} onChange={handleChange} className={inputCls} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="Facebook URL">
                <input name="facebook" value={form.facebook} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Instagram URL">
                <input name="instagram" value={form.instagram} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="X (Twitter) URL">
                <input name="twitter" value={form.twitter} onChange={handleChange} className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Media</h2>
            <Field label="Profile Photo">
              <MediaPicker value={form.photo} onChange={url => set('photo', url)} allowedTypes={['IMAGE']} />
            </Field>
            <Field label="Cover Image">
              <MediaPicker value={form.coverImage} onChange={url => set('coverImage', url)} allowedTypes={['IMAGE']} />
            </Field>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Settings</h2>

            <Field label="Status">
              <select name="isActive" value={form.isActive ? 'true' : 'false'} onChange={e => set('isActive', e.target.value === 'true')} className={inputCls}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-5 h-5 text-red-600 rounded border-neutral-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-neutral-900 dark:text-white">Featured Member</span>
            </label>

            <Field label="Display Order" hint="Lower numbers appear first">
              <input type="number" name="order" value={form.order} onChange={handleChange} className={inputCls} min={0} />
            </Field>

            <Field label="Joining Date">
              <input type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} className={inputCls} />
            </Field>
          </div>
        </div>
      </div>
    </form>
  )
}
