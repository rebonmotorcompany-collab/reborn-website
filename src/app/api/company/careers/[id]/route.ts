import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/company/careers/[id] ───────────────────────────────────────────
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.VIEW_CAREERS)
    const { id } = await params

    const career = await prisma.career.findUnique({ where: { id } })
    if (!career) {
      return NextResponse.json({ success: false, error: 'Career not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: career })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── PUT /api/company/careers/[id] ───────────────────────────────────────────
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CAREERS)
    const { id } = await params

    const body = await req.json()

    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Job title is required' }, { status: 400 })
    }

    const career = await prisma.career.update({
      where: { id },
      data: {
        title:           body.title.trim(),
        department:      body.department      ?? null,
        location:        body.location        ?? null,
        employmentType:  body.employmentType  ?? null,
        experience:      body.experience      ?? null,
        salaryRange:     body.salaryRange     ?? null,
        description:     body.description     ?? null,
        responsibilities: body.responsibilities ?? null,
        requirements:    body.requirements    ?? null,
        skills:          body.skills          ?? null,
        benefits:        body.benefits        ?? null,
        deadline:        body.deadline        ? new Date(body.deadline) : null,
        applyEmail:      body.applyEmail      ?? null,
        applyUrl:        body.applyUrl        ?? null,
        status:          body.status          || 'DRAFT',
        metaTitle:       body.metaTitle       ?? null,
        metaDesc:        body.metaDesc        ?? null,
      },
    })

    return NextResponse.json({ success: true, data: career })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Career not found' }, { status: 404 })
    }
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── DELETE /api/company/careers/[id] ────────────────────────────────────────
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission(PERMISSIONS.DELETE_CAREERS)
    const { id } = await params

    await prisma.career.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Career deleted' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Career not found' }, { status: 404 })
    }
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
