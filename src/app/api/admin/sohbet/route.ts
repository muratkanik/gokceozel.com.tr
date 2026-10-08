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
  if (filter === 'callback') where.contactPhone = { not: null };

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
        city: true,
        country: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.chatSession.count({ where }),
  ]);

  // Counts for badge totals
  const [callbackCount, anxietyCount, hotCount] = await Promise.all([
    prisma.chatSession.count({ where: { contactPhone: { not: null } } }),
    prisma.chatSession.count({ where: { anxiety: true } }),
    prisma.chatSession.count({ where: { leadScore: { gte: 50 } } }),
  ]);

  return NextResponse.json({ sessions, total, page, pageSize, callbackCount, anxietyCount, hotCount });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.chatSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
