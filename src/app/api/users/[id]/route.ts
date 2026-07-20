import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import bcrypt from 'bcryptjs'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/users/[id] ─────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.VIEW_USERS)
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        userPermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── PUT /api/users/[id] ─────────────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.EDIT_USERS)
    const { id } = await params
    const body = await req.json()

    // Validate required fields
    if (!body.name?.trim())  return NextResponse.json({ success: false, error: 'Full Name is required' }, { status: 400 })
    if (!body.email?.trim()) return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })

    const email = body.email.trim().toLowerCase()
    const username = body.username?.trim()?.toLowerCase() || null

    // Check email unique (exclude self)
    const emailConflict = await prisma.user.findFirst({
      where: { email, NOT: { id } }
    })
    if (emailConflict) {
      return NextResponse.json({ success: false, error: 'Email already taken' }, { status: 409 })
    }

    // Check username unique (exclude self)
    if (username) {
      const usernameConflict = await prisma.user.findFirst({
        where: { username, NOT: { id } }
      })
      if (usernameConflict) {
        return NextResponse.json({ success: false, error: 'Username already taken' }, { status: 409 })
      }
    }

    const updateData: any = {
      name: body.name.trim(),
      username,
      email,
      status: body.status || 'ACTIVE',
      phone: body.phone || null,
      department: body.department || null,
      designation: body.designation || null,
      employeeId: body.employeeId || null,
      image: body.image || null,
      timezone: body.timezone || 'UTC',
      language: body.language || 'en',
      forcePasswordChange: Boolean(body.forcePasswordChange),
      twoFactorEnabled: Boolean(body.twoFactorEnabled),
      accountExpiresAt: body.accountExpiresAt ? new Date(body.accountExpiresAt) : null,
    }

    // Hash and update password if provided
    if (body.password?.trim()) {
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData
    })

    // Assign Role if provided
    if (body.roleId) {
      // Clear previous roles
      await prisma.userRole.deleteMany({ where: { userId: id } })
      
      // Add new role
      await prisma.userRole.create({
        data: {
          userId: id,
          roleId: body.roleId
        }
      })
    }

    // Update user permission overrides if provided
    if (body.permissions && Array.isArray(body.permissions)) {
      // Clear previous direct overrides
      await prisma.userPermission.deleteMany({ where: { userId: id } })
      
      for (const p of body.permissions) {
        await prisma.userPermission.create({
          data: {
            userId: id,
            permissionId: p.permissionId,
            value: p.value
          }
        })
      }
    }

    // Sync media usage
    await syncMediaUsages('User', id, [user.image])

    return NextResponse.json({ success: true, data: user })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── DELETE /api/users/[id] ──────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.DELETE_USERS)
    const { id } = await params

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    if (existing.isSystemAdmin) {
      return NextResponse.json({ success: false, error: 'Cannot delete system administrator' }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })

    // Clear media usage references
    await syncMediaUsages('User', id, [])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
