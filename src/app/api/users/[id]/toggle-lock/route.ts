import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.LOCK_USER)
    const { id } = await params
    const { lock } = await req.json()

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    if (user.isSystemAdmin) {
      return NextResponse.json({ success: false, error: 'Cannot lock system administrator accounts' }, { status: 403 })
    }

    await prisma.user.update({
      where: { id },
      data: {
        lockedAt: lock ? new Date() : null,
        failedLoginAttempts: 0 // Reset attempts on manual toggle
      }
    })

    return NextResponse.json({
      success: true,
      message: lock ? 'Account locked successfully' : 'Account unlocked successfully'
    })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
