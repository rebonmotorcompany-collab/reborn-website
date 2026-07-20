import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requirePermission } from '@/lib/permissions'
import { PERMISSIONS } from '@/constants/permissions'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { MediaType } from '@prisma/client'

// Supported mime type mapping to MediaType enum
const MIME_TYPE_MAP: Record<string, MediaType> = {
  // Images
  'image/jpeg':      'IMAGE',
  'image/png':       'IMAGE',
  'image/gif':       'IMAGE',
  'image/webp':      'IMAGE',
  'image/svg+xml':   'IMAGE',
  // Videos
  'video/mp4':       'VIDEO',
  'video/quicktime': 'VIDEO', // .mov
  'video/x-msvideo': 'VIDEO', // .avi
  // PDFs
  'application/pdf': 'PDF',
  // Documents
  'application/msword':                                                      'DOCUMENT', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCUMENT', // .docx
  'application/vnd.ms-excel':                                                'DOCUMENT', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':       'DOCUMENT', // .xlsx
  'application/vnd.ms-powerpoint':                                          'DOCUMENT', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'DOCUMENT', // .pptx
  'application/zip':                                                         'OTHER',    // .zip
}

function getMediaTypeFromMime(mime: string): MediaType {
  return MIME_TYPE_MAP[mime] || 'OTHER'
}

// ─── GET /api/media ──────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_MEDIA)

    const { searchParams } = new URL(req.url)
    const page       = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit      = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const search     = searchParams.get('search') || ''
    const type       = searchParams.get('type') || ''
    const folderId   = searchParams.get('folderId') || ''
    const sortBy     = searchParams.get('sortBy') || 'createdAt'
    const sortOrder  = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'

    const where: any = {}

    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { filename:     { contains: search } },
        { altText:      { contains: search } },
        { caption:      { contains: search } },
      ]
    }

    if (type) {
      if (type === 'SVG') {
        where.mimeType = 'image/svg+xml'
      } else if (type === 'ICON') {
        where.OR = [
          { originalName: { endsWith: '.ico' } },
          { mimeType: 'image/x-icon' }
        ]
      } else {
        where.type = type as MediaType
      }
    }

    // Handles virtual folders lookup. Empty string means root files only (folderId: null)
    if (folderId === 'root' || folderId === 'null' || folderId === '') {
      where.folderId = null
    } else if (folderId !== 'all') {
      where.folderId = folderId
    }

    const allowedSort = ['createdAt', 'size', 'originalName']
    const orderBy: any = allowedSort.includes(sortBy) ? { [sortBy]: sortOrder } : { createdAt: 'desc' }

    const [total, mediaFiles] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          folder: true
        }
      })
    ])

    // Get aggregated info for storage usage
    const allMediaSummary = await prisma.media.groupBy({
      by: ['type'],
      _sum: {
        size: true
      },
      _count: {
        id: true
      }
    })

    const totalStorageUsed = allMediaSummary.reduce((acc, curr) => acc + (curr._sum.size || 0), 0)
    const totalFilesCount  = allMediaSummary.reduce((acc, curr) => acc + curr._count.id, 0)

    return NextResponse.json({
      success: true,
      data: mediaFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      meta: {
        summary: allMediaSummary,
        totalStorageUsed,
        totalFilesCount
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

// ─── POST /api/media/upload ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.UPLOAD_MEDIA)

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folderId = formData.get('folderId') as string | null
    const altText = formData.get('altText') as string | null
    const caption = formData.get('caption') as string | null
    const description = formData.get('description') as string | null
    const widthVal = formData.get('width') as string | null
    const heightVal = formData.get('height') as string | null
    const durationVal = formData.get('duration') as string | null
    const tagsVal = formData.get('tags') as string | null // expected JSON string

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique safe filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const sanitizedOriginal = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${uniqueSuffix}-${sanitizedOriginal}`
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    // Ensure upload directory exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const uploadPath = join(uploadsDir, filename)
    await writeFile(uploadPath, buffer)

    const fileUrl = `/uploads/${filename}`
    const mediaType = getMediaTypeFromMime(file.type)

    // Validate folder exists if provided
    let finalFolderId = null
    if (folderId && folderId !== 'null' && folderId !== 'root') {
      const folder = await prisma.mediaFolder.findUnique({ where: { id: folderId } })
      if (folder) finalFolderId = folder.id
    }

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        url: fileUrl,
        mimeType: file.type,
        size: file.size,
        type: mediaType,
        width: widthVal ? parseInt(widthVal, 10) : null,
        height: heightVal ? parseInt(heightVal, 10) : null,
        duration: durationVal ? parseFloat(durationVal) : null,
        altText: altText || file.name,
        caption: caption || '',
        description: description || '',
        folderId: finalFolderId,
        tags: tagsVal ? JSON.parse(tagsVal) : [],
        uploadedBy: 'admin', // Default placeholder, can bind to active session name
      }
    })

    return NextResponse.json({ success: true, data: media }, { status: 201 })
  } catch (error: any) {
    console.error('[media/upload] POST Error:', error)
    const isUnauthorized = error.message?.includes('Unauthorized')
    return NextResponse.json(
      { success: false, error: error.message },
      { status: isUnauthorized ? 403 : 500 }
    )
  }
}
