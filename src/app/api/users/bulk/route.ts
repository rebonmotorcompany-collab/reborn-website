import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.BULK_ACTION_USERS)
    const { ids, action } = await req.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No user IDs provided' }, { status: 400 })
    }

    // Filter out any system administrator accounts from bulk operations to prevent lockouts
    const targetUsers = await prisma.user.findMany({
      where: {
        id: { in: ids },
        isSystemAdmin: false
      },
      select: { id: true }
    })

    const targetIds = targetUsers.map(u => u.id)
    if (targetIds.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid non-system users selected' }, { status: 400 })
    }

    if (action === 'delete') {
      await prisma.user.deleteMany({
        where: { id: { in: targetIds } }
      })
      return NextResponse.json({ success: true, message: `Successfully deleted ${targetIds.length} users` })
    }

    if (action === 'activate') {
      await prisma.user.updateMany({
        where: { id: { in: targetIds } },
        data: { status: 'ACTIVE' }
      })
      return NextResponse.json({ success: true, message: `Successfully activated ${targetIds.length} users` })
    }

    if (action === 'deactivate') {
      await prisma.user.updateMany({
        where: { id: { in: targetIds } },
        data: { status: 'INACTIVE' }
      })
      return NextResponse.json({ success: true, message: `Successfully deactivated ${targetIds.length} users` })
    }

    if (action === 'lock') {
      await prisma.user.updateMany({
        where: { id: { in: targetIds } },
        data: { lockedAt: new Date() }
      })
      return NextResponse.json({ success: true, message: `Successfully locked ${targetIds.length} users` })
    }

    if (action === 'unlock') {
      await prisma.user.updateMany({
        where: { id: { in: targetIds } },
        data: { lockedAt: null, failedLoginAttempts: 0 }
      })
      return NextResponse.json({ success: true, message: `Successfully unlocked ${targetIds.length} users` })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
