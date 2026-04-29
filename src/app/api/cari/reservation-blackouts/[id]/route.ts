import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCariSession();
    const { id } = await params;
    
    const blackout = await prisma.reservationBlackout.delete({
      where: { id },
    });

    await writeCariLog(session, 'Kapalı Tarih Silindi', `${blackout.date.toISOString().split('T')[0]} tarihli kapalı gün kaydı silindi.`, request);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cari Reservation Blackouts DELETE Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
