import { NextRequest, NextResponse } from 'next/server';
import { hashCariPassword, hashCariResetToken, setCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token || '');
  const password = String(body.password || '');

  if (!token || password.length < 8) {
    return NextResponse.json({ error: 'Invalid reset request.' }, { status: 400 });
  }

  const resetTokenHash = hashCariResetToken(token);
  const user = await prisma.cariUser.findFirst({
    where: {
      resetTokenHash,
      resetTokenExpiresAt: { gt: new Date() },
      isActive: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Reset token is invalid or expired.' }, { status: 400 });
  }

  const passwordHash = await hashCariPassword(password);
  const updated = await prisma.cariUser.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      lastLoginAt: new Date(),
    },
  });

  const session = {
    id: updated.id,
    username: updated.username,
    email: updated.email,
    name: updated.name,
    role: updated.role as 'secretary' | 'doctor',
  };

  await setCariSession(session);
  await writeCariLog(session, 'Şifre sıfırlandı', `${updated.name} reset bağlantısıyla yeni şifre belirledi.`, request);

  return NextResponse.json({ user: session });
}
