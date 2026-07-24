import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/public/team ─────────────────────────────────────────────────────
// Public: returns active team members, optionally filtered by featured/department
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const department  = searchParams.get('department') || ''
    const featuredOnly = searchParams.get('featured') === 'true'

    const where: any = { isActive: true }
    if (department)   where.department = { contains: department }
    if (featuredOnly) where.isFeatured = true

    const members = await prisma.teamMember.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
      select: {
        id: true, name: true, position: true, department: true,
        biography: true, photo: true, coverImage: true,
        linkedin: true, facebook: true, instagram: true, twitter: true,
        isFeatured: true, order: true,
      },
    })

    return NextResponse.json({ success: true, data: members })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
