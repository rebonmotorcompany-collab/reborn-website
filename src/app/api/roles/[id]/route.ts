import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/roles/[id] ─────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.VIEW_ROLES)
    const { id } = await params

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    })

    if (!role) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: role })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── PUT /api/roles/[id] ─────────────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.EDIT_ROLES)
    const { id } = await params
    const body = await req.json()

    const role = await prisma.role.findUnique({ where: { id } })
    if (!role) {
      return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 })
    }

    const updateData: any = {
      displayName: body.displayName?.trim() || role.displayName,
      description: body.description ?? null,
      color: body.color || '#6B7280',
      priority: parseInt(body.priority, 10) || 0,
    }

    // Only allow changing name and slug if it is NOT a system role
    if (!role.isSystem && body.name?.trim()) {
      const name = body.name.trim()
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      const slugConflict = await prisma.role.findFirst({
        where: { slug, NOT: { id } }
      })
      if (slugConflict) {
        return NextResponse.json({ success: false, error: 'A role with similar name already exists' }, { status: 409 })
      }
      
      updateData.name = name
      updateData.slug = slug
    }

    const updated = await prisma.role.update({
      where: { id },
      data: updateData
    })

    // Sync Permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
      // Delete existing and insert new
      await prisma.rolePermission.deleteMany({ where: { roleId: id } })
      
      for (const permId of body.permissions) {
        await prisma.rolePermission.create({
          data: {
            roleId: id,
            permissionId: permId
          }
        })
      }
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── DELETE /api/roles/[id] ──────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.DELETE_ROLES)
    const { id } = await params

    const role = await prisma.role.findUnique({ where: { id } })
    if (!role) return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 })

    if (role.isSystem) {
      return NextResponse.json({ success: false, error: 'System protected roles cannot be deleted' }, { status: 403 })
    }

    await prisma.role.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
