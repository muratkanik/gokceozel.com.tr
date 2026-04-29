import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireCariSession(['doctor']);
    const { id } = await params;

    const entry = await prisma.cariEntry.findUnique({
      where: { id },
      select: { patientName: true, procedureName: true },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
    }

    await prisma.cariEntry.delete({ where: { id } });
    await writeCariLog(session, 'Kayıt silindi', `${entry.patientName} için ${entry.procedureName} kaydı silindi.`, request);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const status = message === 'Unauthorized' ? 401 : message === 'Forbidden' ? 403 : 500;
    return NextResponse.json({ error: 'Entry could not be deleted.' }, { status });
  }
}
