import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/permissions ────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    // Requires users.view or roles.view to retrieve listing
    const session = await requirePermission(PERMISSIONS.VIEW_ROLES)

    const permissions = await prisma.permission.findMany({
      orderBy: [
        { group: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({ success: true, data: permissions })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
