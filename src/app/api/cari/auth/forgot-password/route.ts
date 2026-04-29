import { NextRequest, NextResponse } from 'next/server';
import { createCariResetToken, hashCariResetToken, normalizeCariLogin } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import { sendCariPasswordResetMail } from '@/lib/cari-mail';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const identifier = normalizeCariLogin(String(body.identifier || body.email || body.username || ''));

  if (!identifier) {
    return NextResponse.json({ ok: true });
  }

  try {
    const user = await prisma.cariUser.findFirst({
      where: {
        isActive: true,
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (user?.email) {
      const token = createCariResetToken();
      const resetTokenHash = hashCariResetToken(token);
      const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      const origin = process.env.CARI_APP_URL || process.env.NEXT_PUBLIC_CARI_APP_URL || `${request.nextUrl.protocol}//${request.headers.get('host') || 'cari.gokceozel.com.tr'}`;
      const resetUrl = `${origin.replace(/\/$/, '')}/?resetToken=${encodeURIComponent(token)}`;

      await prisma.cariUser.update({
        where: { id: user.id },
        data: { resetTokenHash, resetTokenExpiresAt },
      });

      await sendCariPasswordResetMail({ to: user.email, name: user.name, resetUrl });
      await writeCariLog({ id: user.id, username: user.username, email: user.email, name: user.name, role: user.role as 'secretary' | 'doctor' }, 'Şifre reset maili', `${user.email} adresine şifre reset bağlantısı gönderildi.`, request);
    }
  } catch (error) {
    console.error('Cari password reset request failed', error);
  }

  return NextResponse.json({ ok: true });
}
