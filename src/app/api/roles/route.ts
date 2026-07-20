import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/roles ──────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_ROLES)

    const roles = await prisma.role.findMany({
      orderBy: { priority: 'desc' },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        _count: {
          select: {
            userRoles: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: roles })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── POST /api/roles ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.CREATE_ROLES)
    const body = await req.json()

    if (!body.name?.trim()) return NextResponse.json({ success: false, error: 'Role name is required' }, { status: 400 })

    const name = body.name.trim()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check slug uniqueness
    const existing = await prisma.role.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'A role with similar name or slug already exists' }, { status: 409 })
    }

    const role = await prisma.role.create({
      data: {
        name,
        slug,
        displayName: body.displayName?.trim() || name,
        description: body.description || null,
        color: body.color || '#6B7280',
        priority: parseInt(body.priority, 10) || 0,
      }
    })

    // Create role permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
      for (const permId of body.permissions) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permId
          }
        })
      }
    }

    return NextResponse.json({ success: true, data: role }, { status: 201 })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
