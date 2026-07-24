import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/company/team ────────────────────────────────────────────────────
// Query: page, limit, search, department, isActive, sortBy, sortOrder
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_TEAM)

    const { searchParams } = new URL(req.url)
    const page       = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit      = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search     = searchParams.get('search')     || ''
    const department = searchParams.get('department') || ''
    const isActive   = searchParams.get('isActive')
    const sortBy     = searchParams.get('sortBy')     || 'order'
    const sortOrder  = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { name:       { contains: search } },
        { position:   { contains: search } },
        { department: { contains: search } },
        { email:      { contains: search } },
      ]
    }
    if (department)           where.department = { contains: department }
    if (isActive !== null && isActive !== '') where.isActive = isActive === 'true'

    const allowedSort = ['name', 'order', 'department', 'createdAt', 'position']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { order: 'asc' }

    const [total, members] = await Promise.all([
      prisma.teamMember.count({ where }),
      prisma.teamMember.findMany({
        where,
        orderBy,
        skip:  (page - 1) * limit,
        take:  limit,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: members,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── POST /api/company/team ───────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.CREATE_TEAM)

    const body = await req.json()

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    const member = await prisma.teamMember.create({
      data: {
        name:          body.name.trim(),
        position:      body.position      || null,
        department:    body.department    || null,
        biography:     body.biography     || null,
        experience:    body.experience    || null,
        qualification: body.qualification || null,
        email:         body.email         || null,
        phone:         body.phone         || null,
        linkedin:      body.linkedin      || null,
        facebook:      body.facebook      || null,
        instagram:     body.instagram     || null,
        twitter:       body.twitter       || null,
        photo:         body.photo         || null,
        coverImage:    body.coverImage    || null,
        order:         body.order         !== undefined ? parseInt(body.order) : 0,
        isFeatured:    Boolean(body.isFeatured),
        isActive:      body.isActive      !== undefined ? Boolean(body.isActive) : true,
        joiningDate:   body.joiningDate   ? new Date(body.joiningDate) : null,
      },
    })

    await syncMediaUsages('TeamMember', member.id, [member.photo, member.coverImage])

    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
