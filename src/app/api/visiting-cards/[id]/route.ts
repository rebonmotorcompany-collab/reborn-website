import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface Props {
  params: Promise<{ id: string }>
}

// ─── GET /api/visiting-cards/[id] ─────────────────────────────────────────────
export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const card = await prisma.visitingCard.findUnique({
      where: { id },
      include: {
        template: true,
        employee: true,
      },
    })

    if (!card) {
      return NextResponse.json({ success: false, error: 'Visiting Card not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: card })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── PUT /api/visiting-cards/[id] ─────────────────────────────────────────────
export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const body = await req.json()

    const updated = await prisma.visitingCard.update({
      where: { id },
      data: body,
      include: {
        template: true,
        employee: true,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── DELETE /api/visiting-cards/[id] ──────────────────────────────────────────
export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params
    await prisma.visitingCard.delete({ where: { id } })
    return NextResponse.json({ success: true, message: 'Visiting Card deleted successfully.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── POST /api/visiting-cards/[id] (Duplicate Action) ─────────────────────────
export async function POST(req: Request, { params }: Props) {
  try {
    const { id } = await params
    const existing = await prisma.visitingCard.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Card not found for duplication.' }, { status: 404 })
    }

    // Omit primary key and timestamps
    const { id: _, createdAt: __, updatedAt: ___, ...cardData } = existing

    const duplicated = await prisma.visitingCard.create({
      data: {
        ...cardData,
        cardName: `${existing.cardName} (Copy)`,
      },
      include: {
        template: true,
        employee: true,
      },
    })

    return NextResponse.json({ success: true, data: duplicated }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
