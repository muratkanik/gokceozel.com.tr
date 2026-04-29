import { NextResponse } from 'next/server';
import { getCariSession } from '@/lib/cari-auth';

export async function GET() {
  const user = await getCariSession();
  return NextResponse.json({ user });
}
