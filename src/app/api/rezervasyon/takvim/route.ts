import { NextResponse } from 'next/server';
import { getCalendarAvailability } from '@/lib/reservations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const month = url.searchParams.get('month') || '';

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ days: [] }, { status: 400 });
  }

  const days = await getCalendarAvailability(month);
  return NextResponse.json({ days });
}
