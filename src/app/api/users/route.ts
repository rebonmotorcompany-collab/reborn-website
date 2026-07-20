import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import bcrypt from 'bcryptjs'
import { syncMediaUsages } from '@/lib/media-usage'

// ─── GET /api/users ──────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_USERS)

    const { searchParams } = new URL(req.url)
    const page       = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit      = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search     = searchParams.get('search') || ''
    const status     = searchParams.get('status') || ''
    const roleId     = searchParams.get('roleId') || ''
    const department = searchParams.get('department') || ''
    const sortBy     = searchParams.get('sortBy') || 'createdAt'
    const sortOrder  = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { name:     { contains: search } },
        { username: { contains: search } },
        { email:    { contains: search } },
        { phone:    { contains: search } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (department) {
      where.department = department
    }

    if (roleId) {
      where.userRoles = {
        some: {
          roleId: roleId
        }
      }
    }

    const allowedSort = ['name', 'username', 'email', 'createdAt', 'status', 'lastLoginAt']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      })
    ])

    // Group departments for filters
    const departments = await prisma.user.findMany({
      where: { department: { not: null } },
      select: { department: true },
      distinct: ['department'],
    })

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      meta: {
        departments: departments.map(d => d.department).filter(Boolean)
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

// ─── POST /api/users ─────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.CREATE_USERS)

    const body = await req.json()

    if (!body.name?.trim())     return NextResponse.json({ success: false, error: 'Full Name is required' }, { status: 400 })
    if (!body.email?.trim())    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    if (!body.password?.trim()) return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 })

    const email = body.email.trim().toLowerCase()
    const username = body.username?.trim()?.toLowerCase() || email.split('@')[0]

    // Check unique email
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 })
    }

    // Check unique username
    if (body.username?.trim()) {
      const existingUser = await prisma.user.findUnique({ where: { username } })
      if (existingUser) {
        return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 409 })
      }
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        username: username,
        email,
        password: hashedPassword,
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
    })

    // Assign Role if provided
    if (body.roleId) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: body.roleId
        }
      })
    }

    // Assign additional permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
      for (const p of body.permissions) {
        await prisma.userPermission.create({
          data: {
            userId: user.id,
            permissionId: p.permissionId,
            value: p.value // true = allow, false = deny
          }
        })
      }
    }

    // Sync media usage
    await syncMediaUsages('User', user.id, [user.image])

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
