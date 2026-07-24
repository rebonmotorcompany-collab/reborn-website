import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── POST /api/visiting-cards/bulk ────────────────────────────────────────────
// Fetch multiple cards by IDs or bulk process
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ids = [], action = 'fetch' } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No card IDs provided.' }, { status: 400 })
    }

    if (action === 'delete') {
      await prisma.visitingCard.deleteMany({
        where: { id: { in: ids } },
      })
      return NextResponse.json({ success: true, message: `${ids.length} cards deleted.` })
    }

    const cards = await prisma.visitingCard.findMany({
      where: { id: { in: ids } },
      include: {
        template: true,
        employee: true,
      },
    })

    return NextResponse.json({ success: true, data: cards })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
