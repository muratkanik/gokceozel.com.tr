import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

function numberOrDefault(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function timeOrDefault(value: unknown, fallback: string) {
  const text = String(value || '').trim();
  return /^\d{2}:\d{2}$/.test(text) ? text : fallback;
}

export async function PATCH(request: Request) {
  if (!await requireAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const workingDays = Array.isArray(body.workingDays)
    ? body.workingDays.map(Number).filter((day: number) => Number.isInteger(day) && day >= 0 && day <= 6)
    : [];

  const settings = await prisma.reservationSetting.upsert({
    where: { id: 'default' },
    update: {
      isEnabled: Boolean(body.isEnabled),
      workingDays,
      dayStart: timeOrDefault(body.dayStart, '10:00'),
      dayEnd: timeOrDefault(body.dayEnd, '18:00'),
      slotMinutes: numberOrDefault(body.slotMinutes, 30),
      bufferMinutes: numberOrDefault(body.bufferMinutes, 0),
      maxPerSlot: numberOrDefault(body.maxPerSlot, 1),
      minNoticeHours: numberOrDefault(body.minNoticeHours, 2),
      bookingHorizonDays: numberOrDefault(body.bookingHorizonDays, 60),
    },
    create: {
      id: 'default',
      isEnabled: Boolean(body.isEnabled),
      workingDays,
      dayStart: timeOrDefault(body.dayStart, '10:00'),
      dayEnd: timeOrDefault(body.dayEnd, '18:00'),
      slotMinutes: numberOrDefault(body.slotMinutes, 30),
      bufferMinutes: numberOrDefault(body.bufferMinutes, 0),
      maxPerSlot: numberOrDefault(body.maxPerSlot, 1),
      minNoticeHours: numberOrDefault(body.minNoticeHours, 2),
      bookingHorizonDays: numberOrDefault(body.bookingHorizonDays, 60),
    },
  });

  return NextResponse.json({ settings });
}
