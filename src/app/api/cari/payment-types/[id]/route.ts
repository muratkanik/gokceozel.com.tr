import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

function paymentTypeIsUsed(paymentBreakdown: unknown, name: string) {
  if (!paymentBreakdown || typeof paymentBreakdown !== 'object' || Array.isArray(paymentBreakdown)) return false;
  return Number((paymentBreakdown as Record<string, unknown>)[name] || 0) > 0;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireCariSession();
    const { id } = await params;
    const type = await prisma.cariPaymentType.findUnique({ where: { id } });

    if (!type) return NextResponse.json({ error: 'Payment type not found.' }, { status: 404 });

    const entries = await prisma.cariEntry.findMany({ select: { paymentBreakdown: true } });
    if (entries.some((entry) => paymentTypeIsUsed(entry.paymentBreakdown, type.name))) {
      return NextResponse.json({ error: 'Payment type is in use.' }, { status: 409 });
    }

    await prisma.cariPaymentType.delete({ where: { id } });
    await writeCariLog(session, 'Tahsilat türü silindi', `${type.name} tahsilat türü silindi.`, request);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof Error && error.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: 'Payment type could not be deleted.' }, { status });
  }
}
