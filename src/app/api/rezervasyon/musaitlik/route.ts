import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/reservations';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ slots: [], reason: 'Geçerli bir tarih seçin.' }, { status: 400 });
  }

  const availability = await getAvailableSlots(date);
  return NextResponse.json(availability);
}
