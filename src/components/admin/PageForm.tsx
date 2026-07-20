'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function PageForm({ initialData, isEditing }: PageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    isPublished: initialData?.isPublished ?? true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    if (name === 'title' && !isEditing && (!formData.slug || formData.slug === generateSlug(formData.title))) {
      setFormData(prev => ({ ...prev, [name]: val, slug: generateSlug(value as string) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: val }))
    }
  }

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing 
        ? `/api/cms/pages?id=${initialData.id}` 
        : '/api/cms/pages'
      
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save page')
      }

      router.push('/dashboard/cms/pages')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/cms/pages" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isEditing ? 'Edit Page' : 'Add New Page'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{isSubmitting ? 'Saving...' : 'Save Page'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">Page Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Page Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. About Us"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Slug (URL Path)</label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Meta Description (SEO)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <label className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer w-max mt-4">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 text-red-600 rounded border-neutral-300 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">Published / Publicly Visible</span>
          </label>
        </div>
      </div>
    </form>
  )
}
