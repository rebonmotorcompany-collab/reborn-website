import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/company/team/[id] ───────────────────────────────────────────────
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.VIEW_TEAM)
    const { id } = await params

    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: member })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── PUT /api/company/team/[id] ───────────────────────────────────────────────
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.EDIT_TEAM)
    const { id } = await params

    const body = await req.json()

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name:          body.name.trim(),
        position:      body.position      ?? null,
        department:    body.department    ?? null,
        biography:     body.biography     ?? null,
        experience:    body.experience    ?? null,
        qualification: body.qualification ?? null,
        email:         body.email         ?? null,
        phone:         body.phone         ?? null,
        linkedin:      body.linkedin      ?? null,
        facebook:      body.facebook      ?? null,
        instagram:     body.instagram     ?? null,
        twitter:       body.twitter       ?? null,
        photo:         body.photo         ?? null,
        coverImage:    body.coverImage    ?? null,
        order:         body.order         !== undefined ? parseInt(body.order) : 0,
        isFeatured:    Boolean(body.isFeatured),
        isActive:      body.isActive      !== undefined ? Boolean(body.isActive) : true,
        joiningDate:   body.joiningDate   ? new Date(body.joiningDate) : null,
      },
    })

    await syncMediaUsages('TeamMember', member.id, [member.photo, member.coverImage])

    return NextResponse.json({ success: true, data: member })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 })
    }
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── DELETE /api/company/team/[id] ────────────────────────────────────────────
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.DELETE_TEAM)
    const { id } = await params

    await prisma.teamMember.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Team member deleted' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 })
    }
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
