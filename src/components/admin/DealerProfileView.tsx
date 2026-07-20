'use client'

import Link from 'next/link'
import {
  ArrowLeft, Edit, MapPin, Phone, Mail, Globe, Clock, Building2,
  Facebook, Instagram, Linkedin, Youtube, FileText, Image as ImageIcon,
  CheckCircle2, XCircle, Store, Wrench, Zap, Package
} from 'lucide-react'

// ─── Label maps ───────────────────────────────────────────────────────────────

const PRODUCT_LABELS: Record<string, string> = {
  ELECTRIC_BIKES: 'Electric Bikes',
  PETROL_BIKES:   'Petrol Bikes',
  SPARE_PARTS:    'Spare Parts',
  ACCESSORIES:    'Accessories',
  BATTERIES:      'Batteries',
  CHARGERS:       'Chargers',
}

const SERVICE_LABELS: Record<string, string> = {
  SALES:       'Sales',
  SERVICE:     'Service',
  WARRANTY:    'Warranty',
  MAINTENANCE: 'Maintenance',
  SPARE_PARTS: 'Spare Parts',
  TEST_RIDE:   'Test Ride',
}

const DAY_LABELS: Record<string, string> = {
  MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday',
  THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE:  'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400',
  SUSPENDED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const TYPE_STYLES: Record<string, string> = {
  AUTHORIZED:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  FRANCHISE:   'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  DISTRIBUTOR: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  RETAIL:      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide sm:w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-neutral-900 dark:text-white">{value}</span>
    </div>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-red-500" />}
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DealerProfileView({ dealer }: { dealer: any }) {
  const products    = (dealer.products    as string[]) || []
  const services    = (dealer.services    as string[]) || []
  const workingDays = (dealer.workingDays as string[]) || []
  const gallery     = (dealer.galleryImages as string[]) || []
  const documents   = (dealer.documents   as string[]) || []

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Header Bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/dealers"
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dealer Profile</h1>
            <p className="text-sm text-neutral-500 mt-0.5">Read-only view of dealer record</p>
          </div>
        </div>
        <Link
          href={`/dashboard/dealers/${dealer.id}`}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <Edit size={16} />
          Edit Dealer
        </Link>
      </div>

      {/* ── Hero / Cover ──────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Cover banner */}
        <div className={`h-40 sm:h-56 w-full ${dealer.coverImage ? '' : 'bg-gradient-to-br from-neutral-800 to-neutral-900'}`}>
          {dealer.coverImage && (
            <img src={dealer.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Dealer identity overlay */}
        <div className="bg-white dark:bg-neutral-950 px-6 py-5 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Logo */}
          <div className="-mt-12 flex-shrink-0">
            <div className="w-20 h-20 rounded-xl border-4 border-white dark:border-neutral-950 bg-neutral-100 dark:bg-neutral-900 overflow-hidden shadow-lg flex items-center justify-center">
              {dealer.logo
                ? <img src={dealer.logo} alt="Logo" className="w-full h-full object-contain" />
                : <Store className="w-8 h-8 text-neutral-400" />
              }
            </div>
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{dealer.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[dealer.status] || STATUS_STYLES.INACTIVE}`}>
                {dealer.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TYPE_STYLES[dealer.dealerType] || TYPE_STYLES.RETAIL}`}>
                {dealer.dealerType}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">{dealer.dealerCode}</span>
              {dealer.businessName && <span>{dealer.businessName}</span>}
              {dealer.city && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {[dealer.city, dealer.province].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Active indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {dealer.isActive
              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
              : <XCircle className="w-5 h-5 text-red-500" />
            }
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {dealer.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2-Column Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Main info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Contact */}
          <Card title="Contact Information" icon={Phone}>
            <div className="space-y-3">
              <InfoRow label="Contact Person" value={dealer.contactPerson} />
              <InfoRow label="Designation"   value={dealer.designation} />
              <InfoRow label="Mobile"        value={dealer.phone} />
              <InfoRow label="WhatsApp"      value={dealer.whatsapp} />
              <InfoRow label="Landline"      value={dealer.landline} />
              <InfoRow label="Email"         value={dealer.email} />
            </div>
          </Card>

          {/* Address */}
          <Card title="Address" icon={MapPin}>
            <div className="space-y-3">
              <InfoRow label="Street"      value={dealer.address} />
              <InfoRow label="City"        value={dealer.city} />
              <InfoRow label="District"    value={dealer.district} />
              <InfoRow label="Province"    value={dealer.province} />
              <InfoRow label="Country"     value={dealer.country} />
              <InfoRow label="Postal Code" value={dealer.postalCode} />
              {dealer.googleMapsUrl && (
                <div className="pt-2">
                  <a
                    href={dealer.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
                  >
                    <MapPin size={14} />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Business Details */}
          <Card title="Business Details" icon={Building2}>
            <div className="space-y-3">
              <InfoRow label="Registration No." value={dealer.registrationNo} />
              <InfoRow label="Tax / NTN No."    value={dealer.taxNo} />
              <InfoRow label="Years in Business" value={dealer.yearsInBusiness?.toString()} />
            </div>
          </Card>

          {/* Products */}
          {products.length > 0 && (
            <Card title="Products Offered" icon={Package}>
              <div className="flex flex-wrap gap-2">
                {products.map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    {PRODUCT_LABELS[p] || p}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Services */}
          {services.length > 0 && (
            <Card title="Services Offered" icon={Wrench}>
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                    {SERVICE_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <Card title="Gallery" icon={ImageIcon}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-28 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800 hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <Card title="Documents" icon={FileText}>
              <div className="space-y-2">
                {documents.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-500 transition-colors group"
                  >
                    <FileText className="w-4 h-4 text-neutral-400 flex-shrink-0 group-hover:text-red-500" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 truncate">{url.split('/').pop()}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Notes */}
          {(dealer.publicNotes || dealer.internalNotes) && (
            <Card title="Notes">
              <div className="space-y-4">
                {dealer.publicNotes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">Public Notes</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line">{dealer.publicNotes}</p>
                  </div>
                )}
                {dealer.internalNotes && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-2">Internal Notes</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3">
                      {dealer.internalNotes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">

          {/* Business Hours */}
          {(dealer.openingTime || workingDays.length > 0) && (
            <Card title="Business Hours" icon={Clock}>
              <div className="space-y-3">
                {dealer.openingTime && dealer.closingTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={14} className="text-neutral-400 flex-shrink-0" />
                    <span className="text-neutral-900 dark:text-white font-medium">
                      {dealer.openingTime} — {dealer.closingTime}
                    </span>
                  </div>
                )}
                {workingDays.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-neutral-500 mb-2">Working Days</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['MON','TUE','WED','THU','FRI','SAT','SUN'].map(day => (
                        <span
                          key={day}
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            workingDays.includes(day)
                              ? 'bg-red-600 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Social Links */}
          {(dealer.facebook || dealer.instagram || dealer.linkedin || dealer.youtube || dealer.website) && (
            <Card title="Social Links" icon={Globe}>
              <div className="space-y-2">
                {dealer.website && (
                  <a href={dealer.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-red-600 transition-colors">
                    <Globe size={16} className="text-neutral-400" />
                    <span className="truncate">Website</span>
                  </a>
                )}
                {dealer.facebook && (
                  <a href={dealer.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 transition-colors">
                    <Facebook size={16} className="text-neutral-400" />
                    <span className="truncate">Facebook</span>
                  </a>
                )}
                {dealer.instagram && (
                  <a href={dealer.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-pink-600 transition-colors">
                    <Instagram size={16} className="text-neutral-400" />
                    <span className="truncate">Instagram</span>
                  </a>
                )}
                {dealer.linkedin && (
                  <a href={dealer.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-700 transition-colors">
                    <Linkedin size={16} className="text-neutral-400" />
                    <span className="truncate">LinkedIn</span>
                  </a>
                )}
                {dealer.youtube && (
                  <a href={dealer.youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 hover:text-red-600 transition-colors">
                    <Youtube size={16} className="text-neutral-400" />
                    <span className="truncate">YouTube</span>
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Quick Facts */}
          <Card title="Record Details">
            <div className="space-y-3 text-sm">
              <InfoRow label="Dealer Code" value={dealer.dealerCode} />
              <InfoRow label="Dealer Type" value={dealer.dealerType} />
              <InfoRow label="Status"      value={dealer.status} />
              <InfoRow label="Created"     value={new Date(dealer.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <InfoRow label="Updated"     value={new Date(dealer.updatedAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })} />
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
