import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── GET /api/visiting-cards ──────────────────────────────────────────────────
// Fetch saved visiting cards with optional search & pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search     = searchParams.get('search')     || ''
    const status     = searchParams.get('status')     || ''
    const employeeId = searchParams.get('employeeId') || ''

    const where: any = {}
    if (status) where.status = status
    if (employeeId) where.employeeId = employeeId

    if (search) {
      where.OR = [
        { cardName:    { contains: search } },
        { fullName:    { contains: search } },
        { designation: { contains: search } },
        { department:  { contains: search } },
        { email:       { contains: search } },
        { phone:       { contains: search } },
      ]
    }

    const cards = await prisma.visitingCard.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        template: true,
        employee: {
          select: { id: true, name: true, email: true, department: true, designation: true, image: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: cards })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ─── POST /api/visiting-cards ─────────────────────────────────────────────────
// Save a new visiting card
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      cardName,
      fullName,
      designation,
      department,
      employeeCode,
      phone,
      whatsapp,
      email,
      extension,
      employeeId,
      templateId,
      qrCodeType = 'VCARD',
      qrCodeValue,
      customQrUrl,
      profilePhoto,
      companyName,
      companyLogo,
      website,
      address,
      frontBgType = 'POLYGON',
      backBgType = 'LIGHT_POLYGON',
      status = 'ACTIVE',
      createdBy,
    } = body

    if (!cardName || !fullName) {
      return NextResponse.json({ success: false, error: 'Card Name and Full Name are required.' }, { status: 400 })
    }

    const newCard = await prisma.visitingCard.create({
      data: {
        cardName,
        fullName,
        designation: designation || null,
        department: department || null,
        employeeCode: employeeCode || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        extension: extension || null,
        employeeId: employeeId || null,
        templateId: templateId || null,
        qrCodeType,
        qrCodeValue: qrCodeValue || null,
        customQrUrl: customQrUrl || null,
        profilePhoto: profilePhoto || null,
        companyName: companyName || 'Rebon Motor Company',
        companyLogo: companyLogo || null,
        website: website || 'www.rebonmotorcompany.com',
        address: address || null,
        frontBgType,
        backBgType,
        status,
        createdBy: createdBy || null,
      },
      include: {
        template: true,
        employee: true,
      },
    })

    return NextResponse.json({ success: true, data: newCard }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
