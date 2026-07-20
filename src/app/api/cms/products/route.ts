import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { prisma } from '@/lib/db';
import { syncMediaUsages } from '@/lib/media-usage';

// ─── GET /api/cms/products ───────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_CMS);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const isFeatured = searchParams.get('isFeatured');

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
      });
      if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: product });
    }

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured === 'true') where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: { category: true }
    });
    
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized');
    return NextResponse.json({ success: false, error: error.message }, { status: isUnauthorized ? 403 : 500 });
  }
}

// ─── POST /api/cms/products ──────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const body = await req.json();
    if (!body.name?.trim()) return NextResponse.json({ success: false, error: 'Product Name is required' }, { status: 400 });
    if (!body.slug?.trim()) return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });

    const slug = body.slug.trim().toLowerCase();
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ success: false, error: 'Product slug already exists' }, { status: 409 });

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || '',
        price: body.price ? parseFloat(body.price) : null,
        categoryId: body.categoryId || null,
        thumbnail: body.thumbnail || null,
        images: body.image || null, // Map body.image input to images Json field
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
        status: body.status || 'DRAFT',
        sortOrder: parseInt(body.sortOrder || body.order, 10) || 0,
        content: body.content || '',
      }
    });

    // Sync media usage
    await syncMediaUsages('Product', product.id, [product.images as string, product.thumbnail]);
    
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized');
    return NextResponse.json({ success: false, error: error.message }, { status: isUnauthorized ? 403 : 500 });
  }
}

// ─── PUT /api/cms/products ───────────────────────────────────────────────────
export async function PUT(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

    const body = await req.json();
    if (!body.name?.trim()) return NextResponse.json({ success: false, error: 'Product Name is required' }, { status: 400 });

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price ? parseFloat(body.price) : null,
        categoryId: body.categoryId || null,
        thumbnail: body.thumbnail,
        images: body.image, // Map body.image input to images Json field
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existingProduct.isFeatured,
        status: body.status || 'DRAFT',
        sortOrder: parseInt(body.sortOrder || body.order, 10) || 0,
        content: body.content,
      }
    });

    // Sync media usage
    await syncMediaUsages('Product', id, [updated.images as string, updated.thumbnail]);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized');
    return NextResponse.json({ success: false, error: error.message }, { status: isUnauthorized ? 403 : 500 });
  }
}

// ─── DELETE /api/cms/products ────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_CMS);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    // Clear media usage for deleted product
    await syncMediaUsages('Product', id, []);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const isUnauthorized = error.message?.includes('Unauthorized');
    return NextResponse.json({ success: false, error: error.message }, { status: isUnauthorized ? 403 : 500 });
  }
}
