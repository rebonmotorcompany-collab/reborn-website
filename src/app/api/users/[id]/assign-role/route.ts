import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.ASSIGN_USER_ROLES)
    const { id } = await params
    const { roleId } = await req.json()

    if (!roleId) {
      return NextResponse.json({ success: false, error: 'Role ID is required' }, { status: 400 })
    }

    const [user, role] = await Promise.all([
      prisma.user.findUnique({ where: { id } }),
      prisma.role.findUnique({ where: { id: roleId } })
    ])

    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    if (!role) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 })

    // Check system admin safety if needed
    if (user.isSystemAdmin && role.slug !== 'super-admin') {
      return NextResponse.json({ success: false, error: 'Cannot remove super-admin role from system administrator' }, { status: 403 })
    }

    // Delete existing roles and insert the new one
    await prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId: id } }),
      prisma.userRole.create({
        data: {
          userId: id,
          roleId: roleId
        }
      })
    ])

    return NextResponse.json({ success: true, message: 'Role assigned successfully' })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
