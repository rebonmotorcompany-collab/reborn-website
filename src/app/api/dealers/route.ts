import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/dealers ────────────────────────────────────────────────────────
// Query params: page, limit, search, status, dealerType, city, province, sortBy, sortOrder
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_DEALERS)

    const { searchParams } = new URL(req.url)
    const page        = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit       = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search      = searchParams.get('search')  || ''
    const status      = searchParams.get('status')  || ''
    const dealerType  = searchParams.get('dealerType') || ''
    const city        = searchParams.get('city')    || ''
    const province    = searchParams.get('province') || ''
    const sortBy      = searchParams.get('sortBy')  || 'createdAt'
    const sortOrder   = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

    // Build dynamic where clause
    const where: any = {
      deletedAt: null,
    }

    if (search) {
      where.OR = [
        { name:          { contains: search } },
        { dealerCode:    { contains: search } },
        { contactPerson: { contains: search } },
        { email:         { contains: search } },
        { city:          { contains: search } },
        { businessName:  { contains: search } },
      ]
    }

    if (status)     where.status     = status
    if (dealerType) where.dealerType = dealerType
    if (city)       where.city       = { contains: city }
    if (province)   where.province   = { contains: province }

    // Allowed sort columns
    const allowedSort = ['name', 'dealerCode', 'city', 'createdAt', 'status', 'dealerType']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' }

    const [total, dealers] = await Promise.all([
      prisma.dealer.count({ where }),
      prisma.dealer.findMany({
        where,
        orderBy,
        skip:  (page - 1) * limit,
        take:  limit,
        select: {
          id:            true,
          name:          true,
          slug:          true,
          dealerCode:    true,
          businessName:  true,
          dealerType:    true,
          status:        true,
          contactPerson: true,
          phone:         true,
          city:          true,
          province:      true,
          logo:          true,
          isActive:      true,
          createdAt:     true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: dealers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}

// ─── POST /api/dealers ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.CREATE_DEALERS)

    const body = await req.json()

    // Required field validation
    if (!body.name?.trim())       return NextResponse.json({ success: false, error: 'Dealer name is required' }, { status: 400 })
    if (!body.dealerCode?.trim()) return NextResponse.json({ success: false, error: 'Dealer code is required' }, { status: 400 })

    // Auto-generate slug from dealerCode
    const slug = body.dealerCode.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check uniqueness
    const existingCode = await prisma.dealer.findUnique({ where: { dealerCode: body.dealerCode.trim() } })
    if (existingCode) return NextResponse.json({ success: false, error: 'Dealer code already exists' }, { status: 409 })

    const existingSlug = await prisma.dealer.findUnique({ where: { slug } })
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

    const dealer = await prisma.dealer.create({
      data: {
        name:           body.name.trim(),
        slug:           finalSlug,
        dealerCode:     body.dealerCode.trim().toUpperCase(),
        businessName:   body.businessName   || null,
        dealerType:     body.dealerType     || 'AUTHORIZED',
        status:         body.status         || 'ACTIVE',

        contactPerson:  body.contactPerson  || null,
        designation:    body.designation    || null,
        phone:          body.phone          || null,
        whatsapp:       body.whatsapp       || null,
        landline:       body.landline       || null,
        email:          body.email          || null,

        address:        body.address        || null,
        city:           body.city           || null,
        district:       body.district       || null,
        province:       body.province       || null,
        country:        body.country        || 'Pakistan',
        postalCode:     body.postalCode     || null,
        googleMapsUrl:  body.googleMapsUrl  || null,

        registrationNo: body.registrationNo || null,
        taxNo:          body.taxNo          || null,
        yearsInBusiness: body.yearsInBusiness ? parseInt(body.yearsInBusiness) : null,

        products:       body.products       || [],
        services:       body.services       || [],

        openingTime:    body.openingTime    || null,
        closingTime:    body.closingTime    || null,
        workingDays:    body.workingDays    || [],

        facebook:       body.facebook       || null,
        instagram:      body.instagram      || null,
        linkedin:       body.linkedin       || null,
        youtube:        body.youtube        || null,
        website:        body.website        || null,

        logo:           body.logo           || null,
        coverImage:     body.coverImage     || null,
        galleryImages:  body.galleryImages  || [],
        documents:      body.documents      || [],

        internalNotes:  body.internalNotes  || null,
        publicNotes:    body.publicNotes    || null,

        companyId:      body.companyId      || null,
        isActive:       body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    })

    // Sync media usage
    await syncMediaUsages('Dealer', dealer.id, [
      dealer.logo,
      dealer.coverImage,
      ...(dealer.galleryImages as string[] || []),
      ...(dealer.documents as string[] || [])
    ])

    return NextResponse.json({ success: true, data: dealer }, { status: 201 })
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 500
    return NextResponse.json({ success: false, error: error.message }, { status })
  }
}
