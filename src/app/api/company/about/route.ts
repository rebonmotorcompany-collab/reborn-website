import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/company/about ───────────────────────────────────────────────────
// Returns all about sections as a keyed object: { hero: {...}, mission: {...}, ... }
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.VIEW_ABOUT)

    const sections = await prisma.aboutSection.findMany()

    const data: Record<string, any> = {}
    sections.forEach(s => {
      data[s.key] = s.data
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── PUT /api/company/about ───────────────────────────────────────────────────
// Body: { key: string, data: object }
// Upserts a single section by key
export async function PUT(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_ABOUT)

    const body = await req.json()
    const { key, data } = body

    if (!key) {
      return NextResponse.json({ success: false, error: 'Section key is required' }, { status: 400 })
    }

    const section = await prisma.aboutSection.upsert({
      where: { key },
      update: { data },
      create: { key, data },
    })

    // Sync media usages for any image URLs in this section
    const urls: string[] = []
    if (data && typeof data === 'object') {
      const extractUrls = (obj: any) => {
        for (const val of Object.values(obj)) {
          if (typeof val === 'string' && val.includes('/uploads/')) urls.push(val)
          else if (Array.isArray(val)) val.forEach(v => { if (typeof v === 'string') urls.push(v); else if (typeof v === 'object' && v !== null) extractUrls(v) })
          else if (typeof val === 'object' && val !== null) extractUrls(val)
        }
      }
      extractUrls(data)
    }
    await syncMediaUsages('AboutUs', section.id, urls)

    return NextResponse.json({ success: true, data: section })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
