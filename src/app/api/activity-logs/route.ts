import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/activity-logs ──────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_ACTIVITY_LOGS)

    const { searchParams } = new URL(req.url)
    const page  = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const action = searchParams.get('action') || ''
    const userId = searchParams.get('userId') || ''

    const where: any = {}
    if (action) where.action = action
    if (userId) where.userId = userId

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
