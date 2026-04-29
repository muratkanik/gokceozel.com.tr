import { NextRequest, NextResponse } from 'next/server';
import { clearCariSession, getCariSession } from '@/lib/cari-auth';
import { writeCariLog } from '@/lib/cari-db';

export async function POST(request: NextRequest) {
  const user = await getCariSession();
  await clearCariSession();

  if (user) {
    await writeCariLog(user, 'Çıkış', `${user.name} cari takip sisteminden çıkış yaptı.`, request);
  }

  return NextResponse.json({ ok: true });
}
