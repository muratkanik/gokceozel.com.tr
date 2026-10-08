import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 25;

  const where: any = {};
  if (filter === 'anxiety') where.anxiety = true;
  if (filter === 'hot') where.leadScore = { gte: 50 };
  if (filter === 'contact') where.contactPhone = { not: null };
  if (filter === 'callback') where = { contactPhone: { not: null }, calledBack: false };
  if (filter === 'called') where = { contactPhone: { not: null }, calledBack: true };

  const [sessions, total] = await Promise.all([
    prisma.chatSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        locale: true,
        messages: true,
        anxiety: true,
        leadScore: true,
        contactName: true,
        contactPhone: true,
        summary: true,
        emailSent: true,
        whatsappNotified: true,
        calledBack: true,
        calledBackAt: true,
        city: true,
        country: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.chatSession.count({ where }),
  ]);

  // Counts for filter badges
  const [pendingCallbackCount, calledCount, anxietyCount, hotCount] = await Promise.all([
    prisma.chatSession.count({ where: { contactPhone: { not: null }, calledBack: false } }),
    prisma.chatSession.count({ where: { contactPhone: { not: null }, calledBack: true } }),
    prisma.chatSession.count({ where: { anxiety: true } }),
    prisma.chatSession.count({ where: { leadScore: { gte: 50 } } }),
  ]);

  return NextResponse.json({ sessions, total, page, pageSize, pendingCallbackCount, calledCount, anxietyCount, hotCount });
}

export async function PATCH(req: NextRequest) {
  const { id, calledBack } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const updated = await prisma.chatSession.update({
    where: { id },
    data: {
      calledBack: !!calledBack,
      calledBackAt: calledBack ? new Date() : null,
    },
    select: { id: true, calledBack: true, calledBackAt: true },
  });
  return NextResponse.json({ ok: true, session: updated });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  // Bulk delete: { ids: string[] }
  if (body.ids && Array.isArray(body.ids) && body.ids.length > 0) {
    const { count } = await prisma.chatSession.deleteMany({ where: { id: { in: body.ids } } });
    return NextResponse.json({ ok: true, count });
  }

  // Single delete: { id: string }
  if (!body.id) return NextResponse.json({ error: 'Missing id or ids' }, { status: 400 });
  await prisma.chatSession.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}
