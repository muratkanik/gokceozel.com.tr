import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCariSession();
    
    let settings = await prisma.reservationSetting.findUnique({
      where: { id: 'default' },
    });
    
    if (!settings) {
      settings = await prisma.reservationSetting.create({
        data: { id: 'default' },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Cari Reservation Settings GET Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireCariSession();
    const data = await request.json();
    
    const settings = await prisma.reservationSetting.upsert({
      where: { id: 'default' },
      update: {
        isEnabled: data.isEnabled,
        workingDays: data.workingDays,
        dayStart: data.dayStart,
        dayEnd: data.dayEnd,
        slotMinutes: data.slotMinutes,
        bufferMinutes: data.bufferMinutes,
        maxPerSlot: data.maxPerSlot,
        minNoticeHours: data.minNoticeHours,
        bookingHorizonDays: data.bookingHorizonDays,
      },
      create: {
        id: 'default',
        isEnabled: data.isEnabled ?? true,
        workingDays: data.workingDays ?? [1, 2, 3, 4, 5, 6],
        dayStart: data.dayStart ?? '10:00',
        dayEnd: data.dayEnd ?? '18:00',
        slotMinutes: data.slotMinutes ?? 30,
        bufferMinutes: data.bufferMinutes ?? 0,
        maxPerSlot: data.maxPerSlot ?? 1,
        minNoticeHours: data.minNoticeHours ?? 2,
        bookingHorizonDays: data.bookingHorizonDays ?? 60,
      },
    });

    await writeCariLog(session, 'Randevu Ayarları Güncellendi', 'Cari sistem üzerinden randevu ayarları güncellendi.', request);

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Cari Reservation Settings POST Error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
