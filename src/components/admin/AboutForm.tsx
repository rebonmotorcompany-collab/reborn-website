'use client'

import { useState } from 'react'
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import MediaPicker from './MediaPicker'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhyUsItem {
  icon: string
  title: string
  description: string
  order: number
}

interface StatItem {
  title: string
  number: string
  icon: string
}

interface TimelineItem {
  year: string
  title: string
  description: string
}

// ─── Component ────────────────────────────────────────────────────────────────

interface AboutFormProps {
  initialData?: Record<string, any>
}

const SECTIONS = [
  { key: 'hero',    label: 'Hero Section' },
  { key: 'intro',   label: 'Company Introduction' },
  { key: 'mission', label: 'Mission' },
  { key: 'vision',  label: 'Vision' },
  { key: 'story',   label: 'Our Story' },
  { key: 'why_us',  label: 'Why Choose Us' },
  { key: 'stats',   label: 'Company Statistics' },
  { key: 'gallery', label: 'Company Gallery' },
  { key: 'seo',     label: 'SEO' },
]

function SectionCard({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
      >
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">{label}</h2>
        {open ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronRight size={16} className="text-neutral-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4">{children}</div>}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none text-sm"
const textareaCls = `${inputCls} resize-none`

export default function AboutForm({ initialData = {} }: AboutFormProps) {
  const [saving, setSaving] = useState<string | null>(null)
  const [saved,  setSaved]  = useState<string | null>(null)
  const [error,  setError]  = useState<string | null>(null)

  // ── Per-section state ──────────────────────────────────────────────────────

  const [hero, setHero] = useState({
    title: initialData.hero?.title || '',
    subtitle: initialData.hero?.subtitle || '',
    description: initialData.hero?.description || '',
    bannerImage: initialData.hero?.bannerImage || '',
    bgImage: initialData.hero?.bgImage || '',
    ctaText: initialData.hero?.ctaText || '',
    ctaLink: initialData.hero?.ctaLink || '',
  })

  const [intro, setIntro] = useState({
    heading: initialData.intro?.heading || '',
    description: initialData.intro?.description || '',
    image: initialData.intro?.image || '',
  })

  const [mission, setMission] = useState({
    title: initialData.mission?.title || '',
    description: initialData.mission?.description || '',
    icon: initialData.mission?.icon || '',
  })

  const [vision, setVision] = useState({
    title: initialData.vision?.title || '',
    description: initialData.vision?.description || '',
    icon: initialData.vision?.icon || '',
  })

  const [story, setStory] = useState({
    title: initialData.story?.title || '',
    description: initialData.story?.description || '',
    timeline: (initialData.story?.timeline || []) as TimelineItem[],
  })

  const [whyUs, setWhyUs] = useState<WhyUsItem[]>(
    initialData.why_us?.items || []
  )

  const [stats, setStats] = useState<StatItem[]>(
    initialData.stats?.items || []
  )

  const [gallery, setGallery] = useState<string[]>(
    initialData.gallery?.images || []
  )

  const [seo, setSeo] = useState({
    metaTitle: initialData.seo?.metaTitle || '',
    metaDesc: initialData.seo?.metaDesc || '',
    keywords: initialData.seo?.keywords || '',
    ogImage: initialData.seo?.ogImage || '',
  })

  // ── Save handler ──────────────────────────────────────────────────────────

  const saveSection = async (key: string, data: any) => {
    setSaving(key)
    setError(null)
    setSaved(null)
    try {
      const res = await fetch('/api/company/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSaved(key)
      setTimeout(() => setSaved(null), 2500)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(null)
    }
  }

  const SaveBtn = ({ sectionKey, data }: { sectionKey: string; data: any }) => (
    <button
      type="button"
      onClick={() => saveSection(sectionKey, data)}
      disabled={saving === sectionKey}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 mt-4"
    >
      <Save size={15} />
      {saving === sectionKey ? 'Saving…' : saved === sectionKey ? '✓ Saved' : 'Save Section'}
    </button>
  )

  // ── Why Us helpers ────────────────────────────────────────────────────────

  const addWhyItem = () => setWhyUs(p => [...p, { icon: '', title: '', description: '', order: p.length }])
  const removeWhyItem = (i: number) => setWhyUs(p => p.filter((_, idx) => idx !== i))
  const updateWhyItem = (i: number, field: keyof WhyUsItem, val: string | number) =>
    setWhyUs(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  // ── Stats helpers ─────────────────────────────────────────────────────────

  const addStat = () => setStats(p => [...p, { title: '', number: '', icon: '' }])
  const removeStat = (i: number) => setStats(p => p.filter((_, idx) => idx !== i))
  const updateStat = (i: number, field: keyof StatItem, val: string) =>
    setStats(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  // ── Timeline helpers ──────────────────────────────────────────────────────

  const addTimeline = () => setStory(p => ({ ...p, timeline: [...p.timeline, { year: '', title: '', description: '' }] }))
  const removeTimeline = (i: number) => setStory(p => ({ ...p, timeline: p.timeline.filter((_, idx) => idx !== i) }))
  const updateTimeline = (i: number, field: keyof TimelineItem, val: string) =>
    setStory(p => ({ ...p, timeline: p.timeline.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }))

  // ── Gallery helpers ───────────────────────────────────────────────────────

  const addGalleryImage = (url: string) => { if (url) setGallery(p => [...p, url]) }
  const removeGalleryImage = (i: number) => setGallery(p => p.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">About Us</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage all sections of the About Us page. Save each section independently.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ── Hero ── */}
      <SectionCard label="Hero Section" defaultOpen>
        <Field label="Title"><input value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="About Rebon Motor Company" /></Field>
        <Field label="Subtitle"><input value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} className={inputCls} /></Field>
        <Field label="Description"><textarea rows={3} value={hero.description} onChange={e => setHero(p => ({ ...p, description: e.target.value }))} className={textareaCls} /></Field>
        <Field label="Banner Image"><MediaPicker value={hero.bannerImage} onChange={url => setHero(p => ({ ...p, bannerImage: url }))} allowedTypes={['IMAGE']} /></Field>
        <Field label="Background Image"><MediaPicker value={hero.bgImage} onChange={url => setHero(p => ({ ...p, bgImage: url }))} allowedTypes={['IMAGE']} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Button Text"><input value={hero.ctaText} onChange={e => setHero(p => ({ ...p, ctaText: e.target.value }))} className={inputCls} placeholder="Learn More" /></Field>
          <Field label="CTA Link"><input value={hero.ctaLink} onChange={e => setHero(p => ({ ...p, ctaLink: e.target.value }))} className={inputCls} placeholder="/contact" /></Field>
        </div>
        <SaveBtn sectionKey="hero" data={hero} />
      </SectionCard>

      {/* ── Company Intro ── */}
      <SectionCard label="Company Introduction">
        <Field label="Heading"><input value={intro.heading} onChange={e => setIntro(p => ({ ...p, heading: e.target.value }))} className={inputCls} /></Field>
        <Field label="Description"><textarea rows={4} value={intro.description} onChange={e => setIntro(p => ({ ...p, description: e.target.value }))} className={textareaCls} /></Field>
        <Field label="Image"><MediaPicker value={intro.image} onChange={url => setIntro(p => ({ ...p, image: url }))} allowedTypes={['IMAGE']} /></Field>
        <SaveBtn sectionKey="intro" data={intro} />
      </SectionCard>

      {/* ── Mission ── */}
      <SectionCard label="Mission">
        <Field label="Title"><input value={mission.title} onChange={e => setMission(p => ({ ...p, title: e.target.value }))} className={inputCls} /></Field>
        <Field label="Description"><textarea rows={4} value={mission.description} onChange={e => setMission(p => ({ ...p, description: e.target.value }))} className={textareaCls} /></Field>
        <Field label="Icon / Image URL"><MediaPicker value={mission.icon} onChange={url => setMission(p => ({ ...p, icon: url }))} allowedTypes={['IMAGE']} /></Field>
        <SaveBtn sectionKey="mission" data={mission} />
      </SectionCard>

      {/* ── Vision ── */}
      <SectionCard label="Vision">
        <Field label="Title"><input value={vision.title} onChange={e => setVision(p => ({ ...p, title: e.target.value }))} className={inputCls} /></Field>
        <Field label="Description"><textarea rows={4} value={vision.description} onChange={e => setVision(p => ({ ...p, description: e.target.value }))} className={textareaCls} /></Field>
        <Field label="Icon / Image URL"><MediaPicker value={vision.icon} onChange={url => setVision(p => ({ ...p, icon: url }))} allowedTypes={['IMAGE']} /></Field>
        <SaveBtn sectionKey="vision" data={vision} />
      </SectionCard>

      {/* ── Our Story ── */}
      <SectionCard label="Our Story">
        <Field label="Section Title"><input value={story.title} onChange={e => setStory(p => ({ ...p, title: e.target.value }))} className={inputCls} /></Field>
        <Field label="Description"><textarea rows={4} value={story.description} onChange={e => setStory(p => ({ ...p, description: e.target.value }))} className={textareaCls} /></Field>
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Timeline Items</label>
            <button type="button" onClick={addTimeline} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"><Plus size={14} /> Add Item</button>
          </div>
          <div className="space-y-3">
            {story.timeline.map((item, i) => (
              <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-500 uppercase">Timeline #{i + 1}</span>
                  <button type="button" onClick={() => removeTimeline(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Year</label>
                    <input value={item.year} onChange={e => updateTimeline(i, 'year', e.target.value)} className={inputCls} placeholder="2024" />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-500 mb-1 block">Title</label>
                    <input value={item.title} onChange={e => updateTimeline(i, 'title', e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1 block">Description</label>
                  <textarea rows={2} value={item.description} onChange={e => updateTimeline(i, 'description', e.target.value)} className={textareaCls} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <SaveBtn sectionKey="story" data={story} />
      </SectionCard>

      {/* ── Why Choose Us ── */}
      <SectionCard label="Why Choose Us">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={addWhyItem} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"><Plus size={14} /> Add Item</button>
        </div>
        <div className="space-y-3">
          {whyUs.map((item, i) => (
            <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-neutral-500 uppercase">Item #{i + 1}</span>
                <button type="button" onClick={() => removeWhyItem(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-500 mb-1 block">Icon (Lucide name or URL)</label>
                  <input value={item.icon} onChange={e => updateWhyItem(i, 'icon', e.target.value)} className={inputCls} placeholder="Rocket" />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 mb-1 block">Display Order</label>
                  <input type="number" value={item.order} onChange={e => updateWhyItem(i, 'order', parseInt(e.target.value))} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Title</label>
                <input value={item.title} onChange={e => updateWhyItem(i, 'title', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Description</label>
                <textarea rows={2} value={item.description} onChange={e => updateWhyItem(i, 'description', e.target.value)} className={textareaCls} />
              </div>
            </div>
          ))}
          {whyUs.length === 0 && <p className="text-sm text-neutral-400 text-center py-4">No items yet. Click "Add Item" to create one.</p>}
        </div>
        <SaveBtn sectionKey="why_us" data={{ items: whyUs }} />
      </SectionCard>

      {/* ── Statistics ── */}
      <SectionCard label="Company Statistics">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={addStat} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"><Plus size={14} /> Add Stat</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.map((item, i) => (
            <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold text-neutral-500">Stat #{i + 1}</span>
                <button type="button" onClick={() => removeStat(i)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Label</label>
                <input value={item.title} onChange={e => updateStat(i, 'title', e.target.value)} className={inputCls} placeholder="Happy Customers" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Number / Value</label>
                <input value={item.number} onChange={e => updateStat(i, 'number', e.target.value)} className={inputCls} placeholder="10,000+" />
              </div>
              <div>
                <label className="text-xs text-neutral-500 mb-1 block">Icon (Lucide name)</label>
                <input value={item.icon} onChange={e => updateStat(i, 'icon', e.target.value)} className={inputCls} placeholder="Users" />
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-neutral-400 col-span-2 text-center py-4">No stats yet.</p>}
        </div>
        <SaveBtn sectionKey="stats" data={{ items: stats }} />
      </SectionCard>

      {/* ── Gallery ── */}
      <SectionCard label="Company Gallery">
        <p className="text-xs text-neutral-500 mb-3">Select images from the Media Library. Drag to reorder.</p>
        <div className="mb-4">
          <MediaPicker value="" onChange={addGalleryImage} allowedTypes={['IMAGE']} placeholder="Pick an image to add to gallery…" />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {gallery.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          {gallery.length === 0 && <p className="col-span-full text-sm text-neutral-400 text-center py-4">No gallery images yet.</p>}
        </div>
        <SaveBtn sectionKey="gallery" data={{ images: gallery }} />
      </SectionCard>

      {/* ── SEO ── */}
      <SectionCard label="SEO">
        <Field label="Meta Title"><input value={seo.metaTitle} onChange={e => setSeo(p => ({ ...p, metaTitle: e.target.value }))} className={inputCls} /></Field>
        <Field label="Meta Description"><textarea rows={3} value={seo.metaDesc} onChange={e => setSeo(p => ({ ...p, metaDesc: e.target.value }))} className={textareaCls} /></Field>
        <Field label="Keywords"><input value={seo.keywords} onChange={e => setSeo(p => ({ ...p, keywords: e.target.value }))} className={inputCls} placeholder="electric bikes, rebon, about" /></Field>
        <Field label="OG Image"><MediaPicker value={seo.ogImage} onChange={url => setSeo(p => ({ ...p, ogImage: url }))} allowedTypes={['IMAGE']} /></Field>
        <SaveBtn sectionKey="seo" data={seo} />
      </SectionCard>
    </div>
  )
}
