import { NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { toPublicReservation } from '@/lib/reservations';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await requireCariSession();

    const reservations = await prisma.appointments.findMany({
      where: { scheduled_date: { not: null } },
      orderBy: [{ scheduled_date: 'asc' }, { start_time: 'asc' }],
      take: 200,
    });

    return NextResponse.json(reservations.map(toPublicReservation));
  } catch (error) {
    return NextResponse.json({ error: 'Reservations could not be loaded.' }, { status: 401 });
  }
}
