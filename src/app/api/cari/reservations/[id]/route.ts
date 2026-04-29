import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import { APPOINTMENT_STATUS_VALUES, appointmentStatusLabel } from '@/lib/appointment-status';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireCariSession();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const status = String(body.status || 'pending');
    if (!APPOINTMENT_STATUS_VALUES.includes(status as typeof APPOINTMENT_STATUS_VALUES[number])) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const reservation = await prisma.appointments.update({
      where: { id },
      data: { status },
    });

    await writeCariLog(session, 'Randevu güncellendi', `${reservation.name} randevusu "${appointmentStatusLabel(status)}" durumuna alındı.`, request);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Reservation could not be updated.' }, { status: 500 });
  }
}
