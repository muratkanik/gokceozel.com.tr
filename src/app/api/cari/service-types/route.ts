import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { mapCariServiceType, writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

function normalizeName(value: unknown) {
  return String(value || '').trim();
}

export async function GET() {
  try {
    await requireCariSession();

    const [types, entries] = await Promise.all([
      prisma.cariServiceType.findMany({ orderBy: { name: 'asc' } }),
      prisma.cariEntry.findMany({ select: { serviceType: true } }),
    ]);

    const usage = new Map<string, number>();
    entries.forEach((entry) => usage.set(entry.serviceType, (usage.get(entry.serviceType) || 0) + 1));

    return NextResponse.json(types.map((type) => mapCariServiceType(type, usage.get(type.name) || 0)));
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Service types could not be loaded.' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCariSession();
    const body = await request.json().catch(() => ({}));
    const name = normalizeName(body.name);

    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    const type = await prisma.cariServiceType.create({
      data: {
        name,
        createdBy: session.id.startsWith('fallback-') ? null : session.id,
        createdByName: session.name,
      },
    });

    await writeCariLog(session, 'İşlem grubu eklendi', `${name} işlem grubu eklendi.`, request);
    return NextResponse.json(mapCariServiceType(type), { status: 201 });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    const status = code === 'P2002' ? 409 : error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Service type could not be saved.' }, { status });
  }
}
