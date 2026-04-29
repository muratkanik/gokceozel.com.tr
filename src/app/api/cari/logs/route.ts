import { NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { mapCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await requireCariSession();

    const logs = await prisma.cariLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 80,
    });

    return NextResponse.json(logs.map(mapCariLog));
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Logs could not be loaded.' }, { status });
  }
}
