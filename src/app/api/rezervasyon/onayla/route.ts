import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashReservationConfirmationToken } from '@/lib/reservations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  const locale = url.searchParams.get('locale') || 'tr';
  const redirectUrl = new URL(locale === 'tr' ? '/iletisim' : `/${locale}/iletisim`, url.origin);

  if (!token) {
    redirectUrl.searchParams.set('rezervasyon', 'gecersiz');
    return NextResponse.redirect(redirectUrl);
  }

  const tokenHash = hashReservationConfirmationToken(token);
  const appointment = await prisma.appointments.findFirst({
    where: {
      confirmation_token_hash: tokenHash,
      confirmation_expires_at: { gt: new Date() },
    },
  });

  if (!appointment) {
    redirectUrl.searchParams.set('rezervasyon', 'gecersiz');
    return NextResponse.redirect(redirectUrl);
  }

  await prisma.appointments.update({
    where: { id: appointment.id },
    data: {
      status: 'confirmed',
      confirmed_at: new Date(),
      confirmation_token_hash: null,
      confirmation_expires_at: null,
    },
  });

  redirectUrl.searchParams.set('rezervasyon', 'onaylandi');
  return NextResponse.redirect(redirectUrl);
}
