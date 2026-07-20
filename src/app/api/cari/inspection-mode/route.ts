import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCariSession } from '@/lib/cari-auth';

export async function GET(request: Request) {
  try {
    const session = await requireCariSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const setting = await prisma.setting.findUnique({
      where: { key: 'inspection_mode_active' }
    });

    return NextResponse.json({ active: setting?.value === 'true' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireCariSession();
    if (!session || session.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const active = body.active === true ? 'true' : 'false';

    await prisma.setting.upsert({
      where: { key: 'inspection_mode_active' },
      update: { value: active },
      create: { key: 'inspection_mode_active', value: active },
    });

    return NextResponse.json({ success: true, active: body.active });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
