'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

export async function updateReservationStatus(formData: FormData) {
  const id = text(formData, 'id');
  const status = text(formData, 'quickStatus') || text(formData, 'status') || 'pending';
  const internalNote = text(formData, 'internalNote');

  await prisma.appointments.update({
    where: { id },
    data: { status, internal_note: internalNote || null },
  });

  revalidatePath('/admin/rezervasyonlar');
}

export async function saveReservationSettings(formData: FormData) {
  const workingDays = formData.getAll('workingDays').map(Number).filter((day) => Number.isInteger(day));

  await prisma.reservationSetting.upsert({
    where: { id: 'default' },
    update: {
      isEnabled: formData.get('isEnabled') === 'on',
      workingDays,
      dayStart: text(formData, 'dayStart') || '10:00',
      dayEnd: text(formData, 'dayEnd') || '18:00',
      slotMinutes: Number(formData.get('slotMinutes') || 30),
      bufferMinutes: Number(formData.get('bufferMinutes') || 0),
      maxPerSlot: Number(formData.get('maxPerSlot') || 1),
      minNoticeHours: Number(formData.get('minNoticeHours') || 2),
      bookingHorizonDays: Number(formData.get('bookingHorizonDays') || 60),
    },
    create: {
      id: 'default',
      isEnabled: formData.get('isEnabled') === 'on',
      workingDays,
      dayStart: text(formData, 'dayStart') || '10:00',
      dayEnd: text(formData, 'dayEnd') || '18:00',
      slotMinutes: Number(formData.get('slotMinutes') || 30),
      bufferMinutes: Number(formData.get('bufferMinutes') || 0),
      maxPerSlot: Number(formData.get('maxPerSlot') || 1),
      minNoticeHours: Number(formData.get('minNoticeHours') || 2),
      bookingHorizonDays: Number(formData.get('bookingHorizonDays') || 60),
    },
  });

  revalidatePath('/admin/rezervasyonlar');
}

export async function createBlackout(formData: FormData) {
  const date = text(formData, 'date');
  if (!date) return;

  await prisma.reservationBlackout.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      reason: text(formData, 'reason') || null,
      isFullDay: formData.get('isFullDay') === 'on',
      startTime: text(formData, 'startTime') || null,
      endTime: text(formData, 'endTime') || null,
    },
  });

  revalidatePath('/admin/rezervasyonlar');
}

export async function deleteBlackout(formData: FormData) {
  const id = text(formData, 'id');
  if (!id) return;

  await prisma.reservationBlackout.delete({ where: { id } });
  revalidatePath('/admin/rezervasyonlar');
}
