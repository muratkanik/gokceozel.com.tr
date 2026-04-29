import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCariSession();
    
    const blackouts = await prisma.reservationBlackout.findMany({
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    
    return NextResponse.json(blackouts);
  } catch (error: any) {
    console.error('Cari Reservation Blackouts GET Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireCariSession();
    const data = await request.json();
    
    const blackout = await prisma.reservationBlackout.create({
      data: {
        date: new Date(data.date),
        reason: data.reason || null,
        isFullDay: data.isFullDay,
        startTime: data.isFullDay ? null : data.startTime,
        endTime: data.isFullDay ? null : data.endTime,
      },
    });

    await writeCariLog(session, 'Kapalı Tarih Eklendi', `${data.date} tarihi kapalı olarak işaretlendi.`, request);

    return NextResponse.json(blackout);
  } catch (error: any) {
    console.error('Cari Reservation Blackouts POST Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
