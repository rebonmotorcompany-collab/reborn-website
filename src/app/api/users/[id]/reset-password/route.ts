import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import bcrypt from 'bcryptjs'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.RESET_USER_PASSWORD)
    const { id } = await params
    const { password, forcePasswordChange } = await req.json()

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        forcePasswordChange: forcePasswordChange !== undefined ? Boolean(forcePasswordChange) : true
      }
    })

    return NextResponse.json({ success: true, message: 'Password reset successfully' })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
