import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * PUBLIC endpoint — no auth required.
 * Returns active, non-deleted dealers for the public-facing Dealers page.
 *
 * GET /api/public/dealers
 * Query params: page, limit, search, dealerType, city, province, sortBy, sortOrder
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page       = Math.max(1, parseInt(searchParams.get('page')   || '1'))
    const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
    const search     = searchParams.get('search')     || ''
    const dealerType = searchParams.get('dealerType') || ''
    const city       = searchParams.get('city')       || ''
    const province   = searchParams.get('province')   || ''
    const sortBy     = searchParams.get('sortBy')     || 'name'
    const sortOrder  = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'

    // Only show active, visible, non-deleted dealers
    const where: any = {
      status:    'ACTIVE',
      isActive:  true,
      deletedAt: null,
    }

    if (search) {
      where.OR = [
        { name:          { contains: search } },
        { businessName:  { contains: search } },
        { contactPerson: { contains: search } },
        { city:          { contains: search } },
        { dealerCode:    { contains: search } },
      ]
    }

    if (dealerType) where.dealerType = dealerType
    if (city)       where.city       = { contains: city }
    if (province)   where.province   = { contains: province }

    const allowedSort = ['name', 'city', 'dealerType', 'createdAt']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { name: 'asc' }

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
          designation:   true,
          phone:         true,
          whatsapp:      true,
          email:         true,
          address:       true,
          city:          true,
          district:      true,
          province:      true,
          country:       true,
          googleMapsUrl: true,
          products:      true,
          services:      true,
          openingTime:   true,
          closingTime:   true,
          workingDays:   true,
          facebook:      true,
          instagram:     true,
          website:       true,
          logo:          true,
          coverImage:    true,
          isActive:      true,
          createdAt:     true,
          publicNotes:   true,
        },
      }),
    ])

    // Collect unique cities and provinces for filter dropdowns
    const [cities, provinces] = await Promise.all([
      prisma.dealer.findMany({
        where: { status: 'ACTIVE', isActive: true, deletedAt: null, city: { not: null } },
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' },
      }),
      prisma.dealer.findMany({
        where: { status: 'ACTIVE', isActive: true, deletedAt: null, province: { not: null } },
        select: { province: true },
        distinct: ['province'],
        orderBy: { province: 'asc' },
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
      meta: {
        cities:    cities.map(c => c.city).filter(Boolean),
        provinces: provinces.map(p => p.province).filter(Boolean),
      },
    })
  } catch (error: any) {
    console.error('[public/dealers] Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dealers', data: [] }, { status: 500 })
  }
}
