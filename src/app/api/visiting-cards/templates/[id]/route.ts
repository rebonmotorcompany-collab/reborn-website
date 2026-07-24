import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Props {
  params: Promise<{ id: string }>
}

// ─── GET /api/visiting-cards/templates/[id] ───────────────────────────────────
export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const template = await prisma.visitingCardTemplate.findUnique({ where: { id } })

    if (!template) {
      return NextResponse.json({ success: false, error: 'Template not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: template })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── PUT /api/visiting-cards/templates/[id] ───────────────────────────────────
export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()

    if (body.isDefault) {
      await prisma.visitingCardTemplate.updateMany({
        where: { id: { not: id }, isDefault: true },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.visitingCardTemplate.update({
      where: { id },
      data: body,
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── DELETE /api/visiting-cards/templates/[id] ────────────────────────────────
export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params
    await prisma.visitingCardTemplate.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Template deleted successfully.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
