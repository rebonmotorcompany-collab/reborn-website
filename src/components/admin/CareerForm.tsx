'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface CareerFormProps {
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

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']

export default function CareerForm({ initialData, isEditing }: CareerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title:           initialData?.title           || '',
    department:      initialData?.department      || '',
    location:        initialData?.location        || '',
    employmentType:  initialData?.employmentType  || '',
    experience:      initialData?.experience      || '',
    salaryRange:     initialData?.salaryRange     || '',
    description:     initialData?.description     || '',
    responsibilities: initialData?.responsibilities || '',
    requirements:    initialData?.requirements    || '',
    skills:          initialData?.skills          || '',
    benefits:        initialData?.benefits        || '',
    deadline:        initialData?.deadline ? initialData.deadline.toString().slice(0, 10) : '',
    applyEmail:      initialData?.applyEmail      || '',
    applyUrl:        initialData?.applyUrl        || '',
    status:          initialData?.status          || 'DRAFT',
    metaTitle:       initialData?.metaTitle       || '',
    metaDesc:        initialData?.metaDesc        || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const url    = isEditing ? `/api/company/careers/${initialData.id}` : '/api/company/careers'
      const method = isEditing ? 'PUT' : 'POST'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save')
      router.push('/dashboard/company/careers')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/company/careers" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isEditing ? 'Edit Job Posting' : 'Add Job Posting'}
          </h1>
        </div>
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
          <Save size={18} />
          {isSubmitting ? 'Saving…' : 'Save Job'}
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
            <Field label="Job Title *">
              <input name="title" required value={form.title} onChange={handleChange} className={inputCls} placeholder="Senior Software Engineer" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department">
                <input name="department" value={form.department} onChange={handleChange} className={inputCls} placeholder="Engineering" />
              </Field>
              <Field label="Location">
                <input name="location" value={form.location} onChange={handleChange} className={inputCls} placeholder="Lahore, Pakistan" />
              </Field>
              <Field label="Employment Type">
                <select name="employmentType" value={form.employmentType} onChange={handleChange} className={inputCls}>
                  <option value="">Select type…</option>
                  {EMPLOYMENT_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </Field>
              <Field label="Experience Required">
                <input name="experience" value={form.experience} onChange={handleChange} className={inputCls} placeholder="3-5 years" />
              </Field>
            </div>
            <Field label="Salary Range (Optional)">
              <input name="salaryRange" value={form.salaryRange} onChange={handleChange} className={inputCls} placeholder="PKR 150,000 – 200,000 / month" />
            </Field>
          </div>

          {/* Job Details */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Job Details</h2>
            <Field label="Job Description">
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={textareaCls} placeholder="Overview of the role…" />
            </Field>
            <Field label="Responsibilities">
              <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={5} className={textareaCls} placeholder="• Lead the backend team…" />
            </Field>
            <Field label="Requirements">
              <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={5} className={textareaCls} placeholder="• 3+ years of experience in…" />
            </Field>
            <Field label="Skills" hint="Comma-separated list">
              <textarea name="skills" value={form.skills} onChange={handleChange} rows={3} className={textareaCls} placeholder="Node.js, TypeScript, MySQL, REST APIs" />
            </Field>
            <Field label="Benefits">
              <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={4} className={textareaCls} placeholder="• Competitive salary…" />
            </Field>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">SEO</h2>
            <Field label="Meta Title">
              <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className={inputCls} />
            </Field>
            <Field label="Meta Description">
              <textarea name="metaDesc" value={form.metaDesc} onChange={handleChange} rows={3} className={textareaCls} />
            </Field>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 pb-3">Publishing</h2>

            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="CLOSED">Closed</option>
              </select>
            </Field>

            <Field label="Application Deadline">
              <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputCls} />
            </Field>

            <Field label="Apply via Email">
              <input name="applyEmail" type="email" value={form.applyEmail} onChange={handleChange} className={inputCls} placeholder="careers@rebon.pk" />
            </Field>

            <Field label="Apply URL (Optional)" hint="External application link">
              <input name="applyUrl" value={form.applyUrl} onChange={handleChange} className={inputCls} placeholder="https://forms.gle/…" />
            </Field>
          </div>
        </div>
      </div>
    </form>
  )
}
