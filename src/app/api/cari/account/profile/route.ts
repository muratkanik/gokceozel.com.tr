import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import {
  getFallbackUser,
  hashCariPassword,
  normalizeCariLogin,
  requireCariSession,
  setCariSession,
  verifyCariPassword,
} from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';
import prisma from '@/lib/prisma';

function clean(value: unknown) {
  return String(value || '').trim();
}

function publicUser(user: { id: string; username: string; email?: string | null; name: string; role: string }) {
  return {
    id: user.id,
    username: user.username,
    email: user.email || '',
    name: user.name,
    role: user.role,
  };
}

export async function GET() {
  try {
    const session = await requireCariSession();

    if (session.id.startsWith('fallback-')) {
      return NextResponse.json({ user: publicUser(session) });
    }

    const user = await prisma.cariUser.findUnique({
      where: { id: session.id },
      select: { id: true, username: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ user: publicUser(user || session) });
  } catch (error) {
    return NextResponse.json({ error: 'Profile could not be loaded.' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireCariSession();
    const body = await request.json().catch(() => ({}));
    const currentPassword = String(body.currentPassword || '');
    const username = normalizeCariLogin(clean(body.username) || session.username);
    const email = normalizeCariLogin(clean(body.email));
    const nextPassword = String(body.newPassword || '');

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    const passwordOk = await verifyCariPassword(session, currentPassword);
    if (!passwordOk) {
      return NextResponse.json({ error: 'Current password is invalid.' }, { status: 403 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Username is too short.' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email is invalid.' }, { status: 400 });
    }

    if (nextPassword && nextPassword.length < 8) {
      return NextResponse.json({ error: 'New password is too short.' }, { status: 400 });
    }

    const passwordHash = nextPassword ? await hashCariPassword(nextPassword) : session.id.startsWith('fallback-') ? await hashCariPassword(currentPassword) : undefined;
    const fallback = getFallbackUser(session.username);

    const user = session.id.startsWith('fallback-')
      ? await prisma.cariUser.create({
          data: {
            username,
            email: email || null,
            name: fallback?.name || session.name,
            role: fallback?.role || session.role,
            passwordHash,
            lastLoginAt: new Date(),
          },
        })
      : await prisma.cariUser.update({
          where: { id: session.id },
          data: {
            username,
            email: email || null,
            ...(passwordHash ? { passwordHash } : {}),
          },
        });

    const nextSession = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role as 'secretary' | 'doctor',
    };

    await setCariSession(nextSession);
    await writeCariLog(nextSession, 'Hesap güncellendi', `${user.name} hesap bilgilerini güncelledi.`, request);

    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    const code = error instanceof Prisma.PrismaClientKnownRequestError ? error.code : '';
    const status = code === 'P2002' ? 409 : 500;
    return NextResponse.json({ error: code === 'P2002' ? 'Username or email already exists.' : 'Profile could not be saved.' }, { status });
  }
}
