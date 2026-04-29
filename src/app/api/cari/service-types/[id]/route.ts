import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireCariSession();
    const { id } = await params;
    const type = await prisma.cariServiceType.findUnique({ where: { id } });

    if (!type) return NextResponse.json({ error: 'Service type not found.' }, { status: 404 });

    const usedCount = await prisma.cariEntry.count({ where: { serviceType: type.name } });
    if (usedCount > 0) {
      return NextResponse.json({ error: 'Service type is in use.' }, { status: 409 });
    }

    await prisma.cariServiceType.delete({ where: { id } });
    await writeCariLog(session, 'İşlem grubu silindi', `${type.name} işlem grubu silindi.`, request);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Service type could not be deleted.' }, { status });
  }
}
