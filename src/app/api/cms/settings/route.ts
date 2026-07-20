import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    await requirePermission(PERMISSIONS.VIEW_SETTINGS);

    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');
    const format = searchParams.get('format') || 'object';

    const where: any = {};
    if (group) where.group = group;

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { key: 'asc' },
    });
    
    if (format === 'list') {
      return NextResponse.json({ success: true, data: settings });
    }

    // Convert array of {key, value} into a single key-value object for easier frontend consumption
    const settingsObject: Record<string, string | null> = {};
    settings.forEach(s => {
      settingsObject[s.key] = s.value;
    });

    return NextResponse.json({ success: true, data: settingsObject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission(PERMISSIONS.EDIT_SETTINGS);

    const body = await req.json(); // Expected format: { "contact_email": "new@email.com", "site_name": "New Name" }
    
    // Bulk upsert settings
    const updates = Object.keys(body).map(key => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: {
          key,
          value: String(body[key]),
          label: key.replace(/_/g, ' ').toUpperCase(),
        }
      });
    });

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: 'Settings updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
