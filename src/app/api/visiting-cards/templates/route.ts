import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/visiting-cards/templates ─────────────────────────────────────────
// Fetch all visiting card templates
export async function GET() {
  try {
    const templates = await prisma.visitingCardTemplate.findMany({
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json({ success: true, data: templates })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── POST /api/visiting-cards/templates ────────────────────────────────────────
// Create a new visiting card template
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      templateType = 'MODERN',
      primaryColor = '#D72626',
      secondaryColor = '#1E1E1E',
      backgroundColor = '#0F0F11',
      textColor = '#FFFFFF',
      fontFamily = 'Inter',
      fontSize = 'medium',
      borderRadius = '16px',
      logoPosition = 'center',
      qrPosition = 'bottom-right',
      iconStyle = 'circle',
      isDefault = false,
      status = 'ACTIVE',
    } = body

    if (!name) {
      return NextResponse.json({ success: false, error: 'Template name is required.' }, { status: 400 })
    }

    if (isDefault) {
      // Set all other templates isDefault to false
      await prisma.visitingCardTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const template = await prisma.visitingCardTemplate.create({
      data: {
        name,
        templateType,
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
        fontFamily,
        fontSize,
        borderRadius,
        logoPosition,
        qrPosition,
        iconStyle,
        isDefault,
        status,
      },
    })

    return NextResponse.json({ success: true, data: template }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
