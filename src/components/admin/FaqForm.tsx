'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FaqFormProps {
  initialData?: any
  isEditing?: boolean
}

export default function FaqForm({ initialData, isEditing }: FaqFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    isActive: initialData?.isActive ?? true,
    order: initialData?.order || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing 
        ? `/api/cms/faqs?id=${initialData.id}` 
        : '/api/cms/faqs'
      
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save FAQ')
      }

      router.push('/dashboard/cms/faqs')
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
          <Link href="/dashboard/cms/faqs" className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          <span>{isSubmitting ? 'Saving...' : 'Save FAQ'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">FAQ Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Question</label>
                <input
                  type="text"
                  name="question"
                  required
                  value={formData.question}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g. How far can the electric bike go on a single charge?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Answer</label>
                <textarea
                  name="answer"
                  required
                  value={formData.answer}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">Configuration</h2>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Active / Published</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Display Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="0"
                />
                <p className="text-xs text-neutral-500 mt-1">Lower numbers appear first.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
