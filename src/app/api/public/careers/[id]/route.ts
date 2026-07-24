import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/public/careers/[id] ────────────────────────────────────────────
// Public: full detail of a single PUBLISHED career
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const career = await prisma.career.findUnique({
      where: { id },
    })

    if (!career || career.status !== 'PUBLISHED') {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: career })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
