import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/company/careers ─────────────────────────────────────────────────
// Query: page, limit, search, department, location, employmentType, status, sortBy, sortOrder
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_CAREERS)

    const { searchParams } = new URL(req.url)
    const page           = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit          = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search         = searchParams.get('search')         || ''
    const department     = searchParams.get('department')     || ''
    const location       = searchParams.get('location')       || ''
    const employmentType = searchParams.get('employmentType') || ''
    const status         = searchParams.get('status')         || ''
    const sortBy         = searchParams.get('sortBy')         || 'createdAt'
    const sortOrder      = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { title:      { contains: search } },
        { department: { contains: search } },
        { location:   { contains: search } },
      ]
    }
    if (department)     where.department     = { contains: department }
    if (location)       where.location       = { contains: location }
    if (employmentType) where.employmentType = employmentType
    if (status)         where.status         = status

    const allowedSort = ['title', 'department', 'location', 'status', 'deadline', 'createdAt']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' }

    const [total, careers] = await Promise.all([
      prisma.career.count({ where }),
      prisma.career.findMany({
        where,
        orderBy,
        skip:  (page - 1) * limit,
        take:  limit,
        select: {
          id: true, title: true, department: true, location: true,
          employmentType: true, experience: true, status: true,
          deadline: true, createdAt: true, applyEmail: true, applyUrl: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: careers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── POST /api/company/careers ────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.CREATE_CAREERS)

    const body = await req.json()

    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Job title is required' }, { status: 400 })
    }

    const career = await prisma.career.create({
      data: {
        title:           body.title.trim(),
        department:      body.department      || null,
        location:        body.location        || null,
        employmentType:  body.employmentType  || null,
        experience:      body.experience      || null,
        salaryRange:     body.salaryRange     || null,
        description:     body.description     || null,
        responsibilities: body.responsibilities || null,
        requirements:    body.requirements    || null,
        skills:          body.skills          || null,
        benefits:        body.benefits        || null,
        deadline:        body.deadline        ? new Date(body.deadline) : null,
        applyEmail:      body.applyEmail      || null,
        applyUrl:        body.applyUrl        || null,
        status:          body.status          || 'DRAFT',
        metaTitle:       body.metaTitle       || null,
        metaDesc:        body.metaDesc        || null,
      },
    })

    return NextResponse.json({ success: true, data: career }, { status: 201 })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
