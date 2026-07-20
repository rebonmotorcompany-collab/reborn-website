import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// ─── GET /api/media/[id] ─────────────────────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.VIEW_MEDIA)
    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        folder: true,
        usages: true
      }
    })

    if (!media) {
      return NextResponse.json({ success: false, error: 'Media file not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: media })
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}

// ─── PUT /api/media/[id] ─────────────────────────────────────────────────────
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.EDIT_MEDIA)
    const { id } = await params
    const body = await req.json()

    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) {
      return NextResponse.json({ success: false, error: 'Media file not found' }, { status: 404 })
    }

    // Handles moving virtual folders
    let finalFolderId = media.folderId
    if (body.folderId !== undefined) {
      if (body.folderId === null || body.folderId === 'null' || body.folderId === 'root') {
        finalFolderId = null
      } else {
        const folder = await prisma.mediaFolder.findUnique({ where: { id: body.folderId } })
        if (folder) finalFolderId = folder.id
      }
    }

    const updated = await prisma.media.update({
      where: { id },
      data: {
        altText:      body.altText !== undefined ? body.altText : media.altText,
        caption:      body.caption !== undefined ? body.caption : media.caption,
        description:  body.description !== undefined ? body.description : media.description,
        tags:         body.tags !== undefined ? body.tags : media.tags,
        folderId:     finalFolderId,
      }
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

// ─── DELETE /api/media/[id] ──────────────────────────────────────────────────
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission(PERMISSIONS.DELETE_MEDIA)
    const { id } = await params

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        usages: true
      }
    })

    if (!media) {
      return NextResponse.json({ success: false, error: 'Media file not found' }, { status: 404 })
    }

    // ─── Safety usage lock check ─────────────────────────────────────────────
    if (media.usages.length > 0) {
      const usageReferences = media.usages.map(u => `${u.entity} #${u.entityId} (${u.fieldName || 'general'})`).join(', ')
      return NextResponse.json({
        success: false,
        error: `Cannot delete media. It is currently referenced in: ${usageReferences}. Please unlink them first.`
      }, { status: 400 })
    }

    // Delete static file from uploads directory
    const filePath = join(process.cwd(), 'public', 'uploads', media.filename)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }

    // Delete database entry
    await prisma.media.delete({ where: { id } })

    return NextResponse.json({ success: true, message: 'Media file deleted successfully' })
  } catch (error: any) {
    console.error('[media/[id]] DELETE Error:', error)
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
