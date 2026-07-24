import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/public/about ────────────────────────────────────────────────────
// Public: returns all AboutSection records as a keyed object — no auth required
export async function GET() {
  try {
    const sections = await prisma.aboutSection.findMany()

    const data: Record<string, any> = {}
    sections.forEach(s => {
      data[s.key] = s.data
    })

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
