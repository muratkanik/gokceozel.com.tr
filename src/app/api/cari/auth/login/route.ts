import { NextRequest, NextResponse } from 'next/server';
import { setCariSession, verifyCariCredentials } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username || '');
  const password = String(body.password || '');

  const user = await verifyCariCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await setCariSession(user);
  await writeCariLog(user, 'Giriş', `${user.name} cari takip sistemine giriş yaptı.`, request);

  return NextResponse.json({ user });
}
