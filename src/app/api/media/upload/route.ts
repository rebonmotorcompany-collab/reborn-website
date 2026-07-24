import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const albumSlug = (formData.get('albumSlug') as string) || 'global-media';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadPath = join(process.cwd(), 'public', 'uploads', filename);

    // Write file to public/uploads
    await writeFile(uploadPath, buffer);

    // Ensure the album exists
    let album = await prisma.galleryAlbum.findUnique({ where: { slug: albumSlug } });
    if (!album) {
      album = await prisma.galleryAlbum.create({
        data: {
          name: albumSlug.replace(/-/g, ' ').toUpperCase(),
          slug: albumSlug,
          description: 'Auto-generated album for media uploads',
        }
      });
    }

    // Save to database
    const fileUrl = `/uploads/${filename}`;
    const image = await prisma.galleryImage.create({
      data: {
        url: fileUrl,
        altText: file.name,
        caption: '',
        albumId: album.id,
      }
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
