import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';

import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_CMS);

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const page = await prisma.contentPage.findUnique({ where: { id } })
      if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(page)
    }

    const pages = await prisma.contentPage.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });
    return NextResponse.json({ success: true, data: pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const body = await req.json();
    const page = await prisma.contentPage.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        isPublished: body.isPublished || false,
      }
    });
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const body = await req.json()
    const page = await prisma.contentPage.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        isPublished: body.isPublished,
      }
    })
    return NextResponse.json({ success: true, data: page })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    await prisma.contentPage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
