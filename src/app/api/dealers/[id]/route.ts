import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/dealers/[id] ───────────────────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.VIEW_DEALERS)
    const { id } = await params

    const dealer = await prisma.dealer.findFirst({
      where: { id, deletedAt: null },
    })

    if (!dealer) return NextResponse.json({ success: false, error: 'Dealer not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: dealer })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── PUT /api/dealers/[id] ───────────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.EDIT_DEALERS)
    const { id } = await params
    const body = await req.json()

    // Validate required fields
    if (!body.name?.trim())       return NextResponse.json({ success: false, error: 'Dealer name is required' }, { status: 400 })
    if (!body.dealerCode?.trim()) return NextResponse.json({ success: false, error: 'Dealer code is required' }, { status: 400 })

    // Check dealer exists
    const existing = await prisma.dealer.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return NextResponse.json({ success: false, error: 'Dealer not found' }, { status: 404 })

    // Check code uniqueness (exclude self)
    const codeConflict = await prisma.dealer.findFirst({
      where: { dealerCode: body.dealerCode.trim().toUpperCase(), id: { not: id }, deletedAt: null },
    })
    if (codeConflict) return NextResponse.json({ success: false, error: 'Dealer code already taken' }, { status: 409 })

    const dealer = await prisma.dealer.update({
      where: { id },
      data: {
        name:           body.name.trim(),
        dealerCode:     body.dealerCode.trim().toUpperCase(),
        businessName:   body.businessName   ?? null,
        dealerType:     body.dealerType     || 'AUTHORIZED',
        status:         body.status         || 'ACTIVE',

        contactPerson:  body.contactPerson  ?? null,
        designation:    body.designation    ?? null,
        phone:          body.phone          ?? null,
        whatsapp:       body.whatsapp       ?? null,
        landline:       body.landline       ?? null,
        email:          body.email          ?? null,

        address:        body.address        ?? null,
        city:           body.city           ?? null,
        district:       body.district       ?? null,
        province:       body.province       ?? null,
        country:        body.country        || 'Pakistan',
        postalCode:     body.postalCode     ?? null,
        googleMapsUrl:  body.googleMapsUrl  ?? null,

        registrationNo: body.registrationNo ?? null,
        taxNo:          body.taxNo          ?? null,
        yearsInBusiness: body.yearsInBusiness ? parseInt(body.yearsInBusiness) : null,

        products:       body.products       ?? [],
        services:       body.services       ?? [],

        openingTime:    body.openingTime    ?? null,
        closingTime:    body.closingTime    ?? null,
        workingDays:    body.workingDays    ?? [],

        facebook:       body.facebook       ?? null,
        instagram:      body.instagram      ?? null,
        linkedin:       body.linkedin       ?? null,
        youtube:        body.youtube        ?? null,
        website:        body.website        ?? null,

        logo:           body.logo           ?? null,
        coverImage:     body.coverImage     ?? null,
        galleryImages:  body.galleryImages  ?? [],
        documents:      body.documents      ?? [],

        internalNotes:  body.internalNotes  ?? null,
        publicNotes:    body.publicNotes    ?? null,

        companyId:      body.companyId      ?? null,
        isActive:       body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
      },
    })

    // Sync media usage
    await syncMediaUsages('Dealer', id, [
      dealer.logo,
      dealer.coverImage,
      ...(dealer.galleryImages as string[] || []),
      ...(dealer.documents as string[] || [])
    ])

    return NextResponse.json({ success: true, data: dealer })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── DELETE /api/dealers/[id] ────────────────────────────────────────────────
// Soft delete: sets deletedAt timestamp
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.DELETE_DEALERS)
    const { id } = await params

    const existing = await prisma.dealer.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return NextResponse.json({ success: false, error: 'Dealer not found' }, { status: 404 })

    await prisma.dealer.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    })

    // Clear media usage references
    await syncMediaUsages('Dealer', id, [])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
