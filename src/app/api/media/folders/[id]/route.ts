import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'

// ─── PUT /api/media/folders/[id] ─────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.MANAGE_FOLDERS)
    const { id } = await params
    const { name, parentId } = await req.json()

    const folder = await prisma.mediaFolder.findUnique({ where: { id } })
    if (!folder) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 })
    }

    const updatedData: any = {}

    if (name?.trim()) {
      const folderName = name.trim()
      // Check unique constraints at parent level
      const targetParentId = parentId !== undefined ? (parentId === 'root' || parentId === 'null' ? null : parentId) : folder.parentId

      const nameConflict = await prisma.mediaFolder.findFirst({
        where: {
          name: folderName,
          parentId: targetParentId,
          NOT: { id }
        }
      })

      if (nameConflict) {
        return NextResponse.json({ success: false, error: 'A folder with this name already exists in this directory' }, { status: 409 })
      }

      updatedData.name = folderName
    }

    if (parentId !== undefined) {
      const finalParentId = parentId === 'root' || parentId === 'null' ? null : parentId

      // Prevent circular nested hierarchies (cannot move folder inside itself)
      if (finalParentId === id) {
        return NextResponse.json({ success: false, error: 'A folder cannot be nested within itself' }, { status: 400 })
      }

      updatedData.parentId = finalParentId
    }

    const updated = await prisma.mediaFolder.update({
      where: { id },
      data: updatedData
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── DELETE /api/media/folders/[id] ──────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.MANAGE_FOLDERS)
    const { id } = await params

    const folder = await prisma.mediaFolder.findUnique({ where: { id } })
    if (!folder) {
      return NextResponse.json({ success: false, error: 'Folder not found' }, { status: 404 })
    }

    // Move any media files nested in this folder to the root (folderId: null)
    // rather than cascade deleting the static files, ensuring user safety.
    await prisma.$transaction([
      prisma.media.updateMany({
        where: { folderId: id },
        data: { folderId: null }
      }),
      // Re-assign sub-folders to root level or cascade delete
      prisma.mediaFolder.delete({
        where: { id }
      })
    ])

    return NextResponse.json({ success: true, message: 'Folder deleted successfully' })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
