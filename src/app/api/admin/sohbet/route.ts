import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = 20;

  const where: any = {};
  if (filter === 'anxiety') where.anxiety = true;
  if (filter === 'hot') where.leadScore = { gte: 50 };
  if (filter === 'contact') where.contactPhone = { not: null };

  const [sessions, total] = await Promise.all([
    prisma.chatSession.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.chatSession.count({ where }),
  ]);

  return NextResponse.json({ sessions, total, page, pageSize });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.chatSession.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
