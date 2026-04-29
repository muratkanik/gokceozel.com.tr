import prisma from '@/lib/prisma';
import crypto from 'node:crypto';

export const ACTIVE_RESERVATION_STATUSES = ['pending_confirmation', 'pending', 'confirmed'];

export function minutesFromTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return (hour || 0) * 60 + (minute || 0);
}

export function timeFromMinutes(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function dateOnly(value: string) {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

export function createReservationConfirmationToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashReservationConfirmationToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function toPublicReservation(item: any) {
  return {
    id: item.id,
    name: item.name,
    phone: item.phone,
    email: item.email || '',
    service: item.service_requested || '',
    message: item.message || item.patient_note || '',
    status: item.status || 'pending',
    date: item.scheduled_date ? item.scheduled_date.toISOString().slice(0, 10) : '',
    startTime: item.start_time || '',
    endTime: item.end_time || '',
    source: item.source || 'web',
    cariEntryId: item.cari_entry_id || '',
    createdAt: item.created_at?.toISOString?.() || '',
  };
}

export async function getReservationSettings() {
  return prisma.reservationSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });
}

function calculateSlots(
  date: string,
  settings: any,
  blackouts: Array<{ isFullDay: boolean; reason: string | null; startTime?: string | null; endTime?: string | null }>,
  appointments: Array<{ start_time: string | null }>
) {
  const targetDate = dateOnly(date);

  if (!settings.isEnabled) {
    return { slots: [], reason: 'Randevu sistemi geçici olarak kapalı.' };
  }

  const now = new Date();
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + settings.bookingHorizonDays);
  if (targetDate > maxDate) {
    return { slots: [], reason: 'Bu tarih için henüz randevu alınmıyor.' };
  }

  const dayOfWeek = targetDate.getUTCDay();
  if (!settings.workingDays.includes(dayOfWeek)) {
    return { slots: [], reason: 'Seçilen gün çalışma günü değil.' };
  }

  if (blackouts.some((item) => item.isFullDay)) {
    return { slots: [], reason: blackouts.find((item) => item.isFullDay)?.reason || 'Bu tarih kapalı.' };
  }

  const reservedCounts = new Map<string, number>();
  appointments.forEach((item) => {
    if (item.start_time) reservedCounts.set(item.start_time, (reservedCounts.get(item.start_time) || 0) + 1);
  });

  const start = minutesFromTime(settings.dayStart);
  const end = minutesFromTime(settings.dayEnd);
  const step = Math.max(settings.slotMinutes + settings.bufferMinutes, 5);
  const slots: Array<{ startTime: string; endTime: string; available: boolean }> = [];

  for (let cursor = start; cursor + settings.slotMinutes <= end; cursor += step) {
    const startTime = timeFromMinutes(cursor);
    const endTime = timeFromMinutes(cursor + settings.slotMinutes);
    const slotDateTime = new Date(`${date}T${startTime}:00+03:00`);
    const isPastNotice = slotDateTime.getTime() < now.getTime() + settings.minNoticeHours * 60 * 60 * 1000;
    const blocked = blackouts.some((item) => {
      if (item.isFullDay || !item.startTime || !item.endTime) return item.isFullDay;
      return cursor < minutesFromTime(item.endTime) && cursor + settings.slotMinutes > minutesFromTime(item.startTime);
    });
    const reserved = (reservedCounts.get(startTime) || 0) >= settings.maxPerSlot;

    slots.push({ startTime, endTime, available: !blocked && !reserved && !isPastNotice });
  }

  return { slots, reason: slots.some((slot) => slot.available) ? null : 'Bu tarihte uygun saat bulunmuyor.' };
}

export async function getAvailableSlots(date: string) {
  const targetDate = dateOnly(date);
  const settings = await getReservationSettings();
  const [blackouts, appointments] = await Promise.all([
    prisma.reservationBlackout.findMany({ where: { date: targetDate } }),
    prisma.appointments.findMany({
      where: {
        scheduled_date: targetDate,
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
      select: { start_time: true },
    }),
  ]);

  return calculateSlots(date, settings, blackouts, appointments);
}

export async function assertSlotAvailable(date: string, startTime: string) {
  const availability = await getAvailableSlots(date);
  const slot = availability.slots.find((item) => item.startTime === startTime);
  if (!slot?.available) throw new Error(availability.reason || 'Seçilen saat uygun değil.');
  return slot;
}

export async function getCalendarAvailability(month: string) {
  const [year, monthIndex] = month.split('-').map(Number);
  if (!year || !monthIndex) return [];

  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
  const endDate = new Date(Date.UTC(year, monthIndex - 1, daysInMonth));
  const settings = await getReservationSettings();
  const [blackouts, appointments] = await Promise.all([
    prisma.reservationBlackout.findMany({
      where: { date: { gte: startDate, lte: endDate } },
    }),
    prisma.appointments.findMany({
      where: {
        scheduled_date: { gte: startDate, lte: endDate },
        status: { in: ACTIVE_RESERVATION_STATUSES },
      },
      select: { scheduled_date: true, start_time: true },
    }),
  ]);

  const blackoutByDate = new Map<string, typeof blackouts>();
  blackouts.forEach((item) => {
    const key = item.date.toISOString().slice(0, 10);
    blackoutByDate.set(key, [...(blackoutByDate.get(key) || []), item]);
  });

  const appointmentByDate = new Map<string, Array<{ start_time: string | null }>>();
  appointments.forEach((item) => {
    if (!item.scheduled_date) return;
    const key = item.scheduled_date.toISOString().slice(0, 10);
    appointmentByDate.set(key, [...(appointmentByDate.get(key) || []), { start_time: item.start_time }]);
  });

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const availability = calculateSlots(date, settings, blackoutByDate.get(date) || [], appointmentByDate.get(date) || []);
    const availableCount = availability.slots.filter((slot) => slot.available).length;
    return {
      date,
      availableCount,
      available: availableCount > 0,
      reason: availability.reason,
    };
  });

  return days;
}
