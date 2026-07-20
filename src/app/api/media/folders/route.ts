import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── GET /api/media/folders ──────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_MEDIA)

    const folders = await prisma.mediaFolder.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            media: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: folders })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── POST /api/media/folders ─────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.MANAGE_FOLDERS)
    const { name, parentId } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'Folder name is required' }, { status: 400 })
    }

    const folderName = name.trim()
    const parentFolderId = parentId && parentId !== 'null' && parentId !== 'root' ? parentId : null

    // Check unique folder name at this level
    const existing = await prisma.mediaFolder.findFirst({
      where: {
        name: folderName,
        parentId: parentFolderId
      }
    })

    if (existing) {
      return NextResponse.json({ success: false, error: 'A folder with this name already exists in this directory' }, { status: 409 })
    }

    const newFolder = await prisma.mediaFolder.create({
      data: {
        name: folderName,
        parentId: parentFolderId
      }
    })

    return NextResponse.json({ success: true, data: newFolder }, { status: 201 })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
