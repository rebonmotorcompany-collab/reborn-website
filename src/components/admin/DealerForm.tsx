'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import MediaPicker from './MediaPicker'

// ─── Constants ───────────────────────────────────────────────────────────────

const DEALER_TYPES = ['AUTHORIZED', 'FRANCHISE', 'DISTRIBUTOR', 'RETAIL'] as const
const DEALER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const

const PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan',
  'Gilgit-Baltistan', 'Azad Jammu & Kashmir', 'Islamabad Capital Territory',
]

const PRODUCTS_OPTIONS = [
  { value: 'ELECTRIC_BIKES',  label: 'Electric Bikes' },
  { value: 'PETROL_BIKES',    label: 'Petrol Bikes' },
  { value: 'SPARE_PARTS',     label: 'Spare Parts' },
  { value: 'ACCESSORIES',     label: 'Accessories' },
  { value: 'BATTERIES',       label: 'Batteries' },
  { value: 'CHARGERS',        label: 'Chargers' },
]

const SERVICES_OPTIONS = [
  { value: 'SALES',        label: 'Sales' },
  { value: 'SERVICE',      label: 'Service' },
  { value: 'WARRANTY',     label: 'Warranty' },
  { value: 'MAINTENANCE',  label: 'Maintenance' },
  { value: 'SPARE_PARTS',  label: 'Spare Parts' },
  { value: 'TEST_RIDE',    label: 'Test Ride' },
]

const DAYS_OPTIONS = [
  { value: 'MON', label: 'Mon' },
  { value: 'TUE', label: 'Tue' },
  { value: 'WED', label: 'Wed' },
  { value: 'THU', label: 'Thu' },
  { value: 'FRI', label: 'Fri' },
  { value: 'SAT', label: 'Sat' },
  { value: 'SUN', label: 'Sun' },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface DealerFormProps {
  initialData?: any
  isEditing?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const inputCls = 'w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors'
const labelCls = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1'
const sectionCls = 'bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5'
const sectionTitleCls = 'text-base font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-1'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={sectionTitleCls}>{children}</h2>
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DealerForm({ initialData, isEditing }: DealerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    // Basic
    name:            initialData?.name           || '',
    dealerCode:      initialData?.dealerCode     || '',
    businessName:    initialData?.businessName   || '',
    dealerType:      initialData?.dealerType     || 'AUTHORIZED',
    status:          initialData?.status         || 'ACTIVE',

    // Contact
    contactPerson:   initialData?.contactPerson  || '',
    designation:     initialData?.designation    || '',
    phone:           initialData?.phone          || '',
    whatsapp:        initialData?.whatsapp       || '',
    landline:        initialData?.landline       || '',
    email:           initialData?.email          || '',

    // Address
    address:         initialData?.address        || '',
    city:            initialData?.city           || '',
    district:        initialData?.district       || '',
    province:        initialData?.province       || '',
    country:         initialData?.country        || 'Pakistan',
    postalCode:      initialData?.postalCode     || '',
    googleMapsUrl:   initialData?.googleMapsUrl  || '',

    // Business
    registrationNo:  initialData?.registrationNo || '',
    taxNo:           initialData?.taxNo          || '',
    yearsInBusiness: initialData?.yearsInBusiness?.toString() || '',

    // Multi-select
    products:   (initialData?.products as string[])    || [],
    services:   (initialData?.services as string[])    || [],
    workingDays:(initialData?.workingDays as string[])  || [],

    // Hours
    openingTime: initialData?.openingTime || '',
    closingTime: initialData?.closingTime || '',

    // Social
    facebook:  initialData?.facebook  || '',
    instagram: initialData?.instagram || '',
    linkedin:  initialData?.linkedin  || '',
    youtube:   initialData?.youtube   || '',
    website:   initialData?.website   || '',

    // Uploads
    logo:           initialData?.logo         || '',
    coverImage:     initialData?.coverImage   || '',
    galleryImages:  (initialData?.galleryImages as string[]) || [],
    documents:      (initialData?.documents   as string[])   || [],

    // Notes
    internalNotes:  initialData?.internalNotes || '',
    publicNotes:    initialData?.publicNotes   || '',

    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  })

  // New gallery/doc URL inputs
  const [newGalleryUrl, setNewGalleryUrl]   = useState('')
  const [newDocumentUrl, setNewDocumentUrl] = useState('')

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const toggleMulti = (field: 'products' | 'services' | 'workingDays', value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return
    setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, newGalleryUrl.trim()] }))
    setNewGalleryUrl('')
  }

  const removeGalleryImage = (idx: number) => {
    setFormData(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== idx) }))
  }

  const addDocument = () => {
    if (!newDocumentUrl.trim()) return
    setFormData(prev => ({ ...prev, documents: [...prev.documents, newDocumentUrl.trim()] }))
    setNewDocumentUrl('')
  }

  const removeDocument = (idx: number) => {
    setFormData(prev => ({ ...prev, documents: prev.documents.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url    = isEditing ? `/api/dealers/${initialData.id}` : '/api/dealers'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save dealer')

      router.push('/dashboard/dealers')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/dealers"
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isEditing ? 'Edit Dealer' : 'Add New Dealer'}
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {isEditing ? `Editing: ${initialData?.name}` : 'Complete the form to register a new dealer.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing && (
            <Link
              href={`/dashboard/dealers/${initialData?.id}/view`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              View Profile
            </Link>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            <span>{isSubmitting ? 'Saving…' : 'Save Dealer'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* 2-column grid for most sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── 1. Basic Information ─────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Dealer Name <span className="text-red-500">*</span></label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Ali Motors" />
              </div>
              <div>
                <label className={labelCls}>Dealer Code <span className="text-red-500">*</span></label>
                <input name="dealerCode" type="text" required value={formData.dealerCode} onChange={handleChange}
                  className={inputCls} placeholder="e.g. RMC-LHR-001" />
                <p className="text-xs text-neutral-500 mt-1">Unique identifier — auto-generates URL slug.</p>
              </div>
              <div>
                <label className={labelCls}>Business / Trade Name</label>
                <input name="businessName" type="text" value={formData.businessName} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Ali Motors & Sons" />
              </div>
              <div>
                <label className={labelCls}>Dealer Type</label>
                <select name="dealerType" value={formData.dealerType} onChange={handleChange} className={inputCls}>
                  {DEALER_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 2. Contact Information ──────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Contact Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Contact Person</label>
                <input name="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Muhammad Ali" />
              </div>
              <div>
                <label className={labelCls}>Designation</label>
                <input name="designation" type="text" value={formData.designation} onChange={handleChange}
                  className={inputCls} placeholder="e.g. Manager" />
              </div>
              <div>
                <label className={labelCls}>Mobile Number</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                  className={inputCls} placeholder="+92 300 0000000" />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <input name="whatsapp" type="tel" value={formData.whatsapp} onChange={handleChange}
                  className={inputCls} placeholder="+92 300 0000000" />
              </div>
              <div>
                <label className={labelCls}>Landline</label>
                <input name="landline" type="tel" value={formData.landline} onChange={handleChange}
                  className={inputCls} placeholder="042-00000000" />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className={inputCls} placeholder="dealer@example.com" />
              </div>
            </div>
          </div>

          {/* ── 3. Address ──────────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Address</SectionTitle>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Street Address</label>
                <input name="address" type="text" value={formData.address} onChange={handleChange}
                  className={inputCls} placeholder="Shop / Plot number, Street, Area" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>City</label>
                  <input name="city" type="text" value={formData.city} onChange={handleChange}
                    className={inputCls} placeholder="e.g. Lahore" />
                </div>
                <div>
                  <label className={labelCls}>District</label>
                  <input name="district" type="text" value={formData.district} onChange={handleChange}
                    className={inputCls} placeholder="e.g. Lahore District" />
                </div>
                <div>
                  <label className={labelCls}>Province</label>
                  <select name="province" value={formData.province} onChange={handleChange} className={inputCls}>
                    <option value="">— Select Province —</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Country</label>
                  <input name="country" type="text" value={formData.country} onChange={handleChange}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Postal Code</label>
                  <input name="postalCode" type="text" value={formData.postalCode} onChange={handleChange}
                    className={inputCls} placeholder="e.g. 54000" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Google Maps URL</label>
                <input name="googleMapsUrl" type="url" value={formData.googleMapsUrl} onChange={handleChange}
                  className={inputCls} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>

          {/* ── 4. Business Details ──────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Business Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Registration Number</label>
                <input name="registrationNo" type="text" value={formData.registrationNo} onChange={handleChange}
                  className={inputCls} placeholder="SECP / FBR Reg. No." />
              </div>
              <div>
                <label className={labelCls}>Tax / NTN Number</label>
                <input name="taxNo" type="text" value={formData.taxNo} onChange={handleChange}
                  className={inputCls} placeholder="NTN-0000000-0" />
              </div>
              <div>
                <label className={labelCls}>Years in Business</label>
                <input name="yearsInBusiness" type="number" min="0" value={formData.yearsInBusiness} onChange={handleChange}
                  className={inputCls} placeholder="e.g. 5" />
              </div>
            </div>
          </div>

          {/* ── 5. Products ─────────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Products Offered</SectionTitle>
            <div className="flex flex-wrap gap-3">
              {PRODUCTS_OPTIONS.map(opt => {
                const checked = formData.products.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMulti('products', opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      checked
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 6. Services ─────────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Services Offered</SectionTitle>
            <div className="flex flex-wrap gap-3">
              {SERVICES_OPTIONS.map(opt => {
                const checked = formData.services.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMulti('services', opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      checked
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── 7. Business Hours ───────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Business Hours</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Opening Time</label>
                <input name="openingTime" type="time" value={formData.openingTime} onChange={handleChange}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Closing Time</label>
                <input name="closingTime" type="time" value={formData.closingTime} onChange={handleChange}
                  className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Working Days</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAYS_OPTIONS.map(day => {
                  const checked = formData.workingDays.includes(day.value)
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleMulti('workingDays', day.value)}
                      className={`w-14 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        checked
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-red-500'
                      }`}
                    >
                      {day.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── 8. Social Links ─────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Social Links</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'facebook',  label: 'Facebook URL' },
                { name: 'instagram', label: 'Instagram URL' },
                { name: 'linkedin',  label: 'LinkedIn URL' },
                { name: 'youtube',   label: 'YouTube URL' },
                { name: 'website',   label: 'Website URL' },
              ].map(field => (
                <div key={field.name}>
                  <label className={labelCls}>{field.label}</label>
                  <input
                    name={field.name}
                    type="url"
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── 9. Notes ────────────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Notes</SectionTitle>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Internal Notes <span className="text-xs font-normal text-neutral-400">(not visible to public)</span></label>
                <textarea
                  name="internalNotes"
                  rows={3}
                  value={formData.internalNotes}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Notes for internal team only..."
                />
              </div>
              <div>
                <label className={labelCls}>Public Notes <span className="text-xs font-normal text-neutral-400">(may be visible on dealer profile)</span></label>
                <textarea
                  name="publicNotes"
                  rows={3}
                  value={formData.publicNotes}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Notes visible to customers..."
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">

          {/* ── Status & Meta ──────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Status</SectionTitle>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Dealer Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputCls}>
                  {DEALER_STATUSES.map(s => (
                    <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-red-600 rounded border-neutral-300 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">Active / Visible</span>
              </label>
            </div>
          </div>

          {/* ── Logo ──────────────────────────────────────────────── */}
          <div className={sectionCls}>
            <SectionTitle>Dealer Logo</SectionTitle>
            <MediaPicker
              value={formData.logo}
              onChange={url => setFormData(prev => ({ ...prev, logo: url }))}
              placeholder="Choose logo from media library..."
            />
          </div>

          {/* ── Cover Image ──────────────────────────────────────────*/}
          <div className={sectionCls}>
            <SectionTitle>Cover Image</SectionTitle>
            <MediaPicker
              value={formData.coverImage}
              onChange={url => setFormData(prev => ({ ...prev, coverImage: url }))}
              placeholder="Choose cover image from media library..."
            />
          </div>

          {/* ── Gallery Images ──────────────────────────────────────*/}
          <div className={sectionCls}>
            <SectionTitle>Gallery Images</SectionTitle>
            <div className="space-y-4">
              <MediaPicker
                value=""
                onChange={url => {
                  if (url) {
                    setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, url] }))
                  }
                }}
                placeholder="Choose image to add to gallery..."
              />
            </div>
            {formData.galleryImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {formData.galleryImages.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-full h-20 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Documents ──────────────────────────────────────────*/}
          <div className={sectionCls}>
            <SectionTitle>Documents</SectionTitle>
            <div className="space-y-4">
              <MediaPicker
                value=""
                onChange={url => {
                  if (url) {
                    setFormData(prev => ({ ...prev, documents: [...prev.documents, url] }))
                  }
                }}
                placeholder="Choose document from media library..."
              />
            </div>
            {formData.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.documents.map((url, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 truncate max-w-[160px] hover:underline">
                      {url.split('/').pop()}
                    </a>
                    <button type="button" onClick={() => removeDocument(i)}
                      className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </form>
  )
}
