import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/public/careers ──────────────────────────────────────────────────
// Public: returns PUBLISHED careers only, with search/filter support
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search         = searchParams.get('search')         || ''
    const department     = searchParams.get('department')     || ''
    const location       = searchParams.get('location')       || ''
    const employmentType = searchParams.get('employmentType') || ''

    const where: any = { status: 'PUBLISHED' }

    if (search) {
      where.OR = [
        { title:      { contains: search } },
        { department: { contains: search } },
        { location:   { contains: search } },
        { skills:     { contains: search } },
      ]
    }
    if (department)     where.department     = { contains: department }
    if (location)       where.location       = { contains: location }
    if (employmentType) where.employmentType = employmentType

    const careers = await prisma.career.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, department: true, location: true,
        employmentType: true, experience: true, salaryRange: true,
        deadline: true, createdAt: true, skills: true,
      },
    })

    // Gather distinct filter options for the frontend
    const allPublished = await prisma.career.findMany({
      where: { status: 'PUBLISHED' },
      select: { department: true, location: true, employmentType: true },
    })

    const departments     = [...new Set(allPublished.map(c => c.department).filter(Boolean))]
    const locations       = [...new Set(allPublished.map(c => c.location).filter(Boolean))]
    const employmentTypes = [...new Set(allPublished.map(c => c.employmentType).filter(Boolean))]

    return NextResponse.json({
      success: true,
      data: careers,
      filters: { departments, locations, employmentTypes },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
