import { NextRequest, NextResponse } from 'next/server';
import { requireCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import { sendReservationConfirmationMail } from '@/lib/cari-mail';
import prisma from '@/lib/prisma';
import { createReservationConfirmationToken, hashReservationConfirmationToken } from '@/lib/reservations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireCariSession();
    const { id } = await params;
    const appointment = await prisma.appointments.findUnique({ where: { id } });

    if (!appointment) {
      return NextResponse.json({ error: 'Randevu bulunamadı.' }, { status: 404 });
    }

    if (!appointment.email) {
      return NextResponse.json({ error: 'Bu randevuda e-posta adresi yok.' }, { status: 400 });
    }

    if ((appointment.status || 'pending') !== 'pending_confirmation') {
      return NextResponse.json({ error: 'Hatırlatma sadece e-posta onayı bekleyen randevular için gönderilebilir.' }, { status: 400 });
    }

    const token = createReservationConfirmationToken();
    const confirmationTokenHash = hashReservationConfirmationToken(token);
    const confirmationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.appointments.update({
      where: { id },
      data: {
        confirmation_token_hash: confirmationTokenHash,
        confirmation_expires_at: confirmationExpiresAt,
      },
    });

    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const locale = appointment.locale || 'tr';
    const confirmUrl = `${siteOrigin}/api/rezervasyon/onayla?token=${encodeURIComponent(token)}&locale=${encodeURIComponent(locale)}`;

    await sendReservationConfirmationMail({
      to: appointment.email,
      name: appointment.name,
      service: appointment.service_requested || '',
      date: appointment.scheduled_date?.toISOString().slice(0, 10) || '',
      time: `${appointment.start_time || ''}${appointment.end_time ? ` - ${appointment.end_time}` : ''}`.trim(),
      confirmUrl,
    });

    await writeCariLog(session, 'Randevu hatırlatma maili gönderildi', `${appointment.name} için onay hatırlatma maili gönderildi.`, request);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Hatırlatma maili gönderilemedi.' }, { status: 500 });
  }
}
