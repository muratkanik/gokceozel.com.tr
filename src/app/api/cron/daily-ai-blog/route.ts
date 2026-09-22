import { NextResponse } from 'next/server';
import { runDailyAiBlogJob } from '@/lib/automated-blog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== 'production';
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === '1';
  const keyword = searchParams.get('keyword') || undefined;

  try {
    const result = await runDailyAiBlogJob({ force, keyword });
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    console.error('[daily-ai-blog-cron]', error);
    return NextResponse.json({ ok: false, error: error?.message || 'Daily AI blog job failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
