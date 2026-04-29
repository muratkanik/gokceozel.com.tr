import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { APPOINTMENT_STATUS_VALUES } from '@/lib/appointment-status';

async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = String(body.status || 'pending');

  if (!APPOINTMENT_STATUS_VALUES.includes(status as typeof APPOINTMENT_STATUS_VALUES[number])) {
    return NextResponse.json({ error: 'Geçersiz randevu durumu.' }, { status: 400 });
  }

  const appointment = await prisma.appointments.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ appointment });
}
