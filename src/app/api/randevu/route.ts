import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendReservationConfirmationMail, sendNewAppointmentAdminNotification } from '@/lib/cari-mail';
import { assertSlotAvailable, createReservationConfirmationToken, hashReservationConfirmationToken } from '@/lib/reservations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, service_requested, date, startTime, locale } = body;

    if (!name || !phone || !email || !date || !startTime) {
      return NextResponse.json({ error: 'Name, phone, email, date and time are required' }, { status: 400 });
    }

    const slot = await assertSlotAvailable(String(date), String(startTime));
    const confirmationToken = createReservationConfirmationToken();
    const confirmationTokenHash = hashReservationConfirmationToken(confirmationToken);
    const confirmationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const appointment = await prisma.appointments.create({
      data: {
        name,
        email,
        phone,
        message: message || null,
        service_requested: service_requested || null,
        status: 'pending_confirmation',
        scheduled_date: new Date(`${String(date).slice(0, 10)}T00:00:00.000Z`),
        start_time: slot.startTime,
        end_time: slot.endTime,
        duration_minutes: 30,
        source: 'web',
        locale: locale || 'tr',
        patient_note: message || null,
        confirmation_token_hash: confirmationTokenHash,
        confirmation_expires_at: confirmationExpiresAt,
      }
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const confirmUrl = `${origin}/api/rezervasyon/onayla?token=${encodeURIComponent(confirmationToken)}&locale=${encodeURIComponent(locale || 'tr')}`;
    await Promise.allSettled([
      sendReservationConfirmationMail({
        to: email,
        name,
        service: service_requested,
        date: String(date),
        time: `${slot.startTime} - ${slot.endTime}`,
        confirmUrl,
      }),
      sendNewAppointmentAdminNotification({
        name,
        phone,
        email,
        service: service_requested,
        date: String(date),
        time: `${slot.startTime} - ${slot.endTime}`,
        locale: locale || 'tr',
      }),
    ]);

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error) {
    console.error('Randevu submission error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
